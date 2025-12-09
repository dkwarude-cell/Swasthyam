import { Platform } from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Conditionally import FileSystem only for native platforms
let FileSystem: any = null;
if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system/legacy');
}

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyD9WVGxf1lZNM4M-bEEhPFXhdrqIHk4MZs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Add console logging for debugging
console.log('[BarcodeService] Module loaded successfully');
console.log('[BarcodeService] Hybrid mode: OpenCV/pyzbar + Gemini AI');
console.log('[BarcodeService] Platform:', Platform.OS);

interface BarcodeResponse {
  success: boolean;
  data?: {
    barcode: string;
    product_name: string;
    brand: string;
    quantity: string;
    categories: string;
    ingredients_text: string;
    image_url: string;
    nutritional_info: {
      energy_kcal: number | null;
      fat: number | null;
      saturated_fat: number | null;
      trans_fat: number | null;
      cholesterol: number | null;
      carbohydrates: number | null;
      sugars: number | null;
      fiber: number | null;
      proteins: number | null;
      salt: number | null;
      sodium: number | null;
      unit: string;
      polyunsaturated_fat?: number | null;
    } | null;
    oil_content: string;
    additives: string[];
    nutriscore_grade: string | null;
    nova_group: number | null;
    labels: string;
    fatty_acids?: {
      sfa: string | null;
      tfa: string | null;
      pfa: string | null;
      is_food_product?: boolean;
    };
  };
  error?: string;
  message?: string;
  tips?: string[];
  suggestion?: string;
}

interface SearchResult {
  barcode: string;
  product_name: string;
  brand: string;
  image_url: string;
  nutriscore_grade: string | null;
}

interface SearchResponse {
  success: boolean;
  data?: {
    query: string;
    count: number;
    results: SearchResult[];
  };
  error?: string;
}

/**
 * Get product details from Gemini AI using barcode and image
 */
const getProductDetailsFromGemini = async (barcode: string, base64Image: string): Promise<any> => {
  const prompt = `You are a Product Information Expert. I have scanned a barcode: ${barcode}

Analyze this product image and the barcode to provide detailed product information.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "product_name": "full product name",
  "brand": "brand/manufacturer name",
  "quantity": "e.g., 1L, 500ml, 1kg",
  "product_type": "e.g., Sunflower Oil, Mustard Oil, Refined Oil, Cooking Oil",
  "categories": "e.g., Edible Oil, Cooking Oil, Food Product",
  "ingredients": "list of ingredients if visible or known",
  "nutritional_info": {
    "energy_kcal": number or null,
    "fat": number or null,
    "saturated_fat": number or null,
    "trans_fat": number or null,
    "polyunsaturated_fat": number or null,
    "carbohydrates": number or null,
    "proteins": number or null,
    "sodium": number or null
  },
  "sfa": "saturated fat value with unit (e.g., '12g') or null",
  "tfa": "trans fat value with unit (e.g., '0g') or null", 
  "pfa": "polyunsaturated fat value with unit (e.g., '25g') or null",
  "health_tips": ["tip1", "tip2", "tip3"],
  "is_food_product": true
}

RULES:
- Use the barcode ${barcode} to identify the product if possible
- Extract nutritional values per 100g/100ml
- If you recognize the product from the barcode or image, provide accurate info
- For Indian products, include common brand knowledge
- If unsure, make reasonable estimates based on product type
- Return ONLY the JSON object, no extra text`;

  try {
    console.log('[BarcodeService] -------- GEMINI API CALL --------');
    console.log('[BarcodeService] Barcode:', barcode);
    console.log('[BarcodeService] Image data size:', base64Image.length, 'chars');
    
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      }),
    });

    console.log('[BarcodeService] Gemini response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[BarcodeService] Gemini API error:', errorData.substring(0, 300));
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini AI');
    }
    
    console.log('[BarcodeService] Gemini response preview:', generatedText.substring(0, 200));

    // Parse JSON from response
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(jsonText);
    console.log('[BarcodeService] Gemini parsed successfully');
    return parsedData;
  } catch (error: any) {
    console.error('[BarcodeService] Gemini analysis error:', error.message);
    throw error;
  }
};

/**
 * Scan barcode from image using OpenCV/pyzbar backend, then get details from Gemini
 */
export const scanBarcodeImage = async (imageUri: string): Promise<BarcodeResponse> => {
  try {
    console.log('[BarcodeService] ========== SCAN START ==========');
    console.log('[BarcodeService] scanBarcodeImage called with:', imageUri);
    console.log('[BarcodeService] Platform:', Platform.OS);
    console.log('[BarcodeService] Using OpenCV/pyzbar backend for barcode detection');
    
    // Read image as base64
    let base64Image: string;
    
    if (Platform.OS === 'web') {
      console.log('[BarcodeService] Reading image for WEB platform...');
      // For web, fetch the blob and convert to base64
      const response = await fetch(imageUri);
      console.log('[BarcodeService] Fetch response status:', response.status);
      const blob = await response.blob();
      console.log('[BarcodeService] Blob size:', blob.size, 'type:', blob.type);
      base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          console.log('[BarcodeService] Base64 result length:', result?.length || 0);
          resolve(result);
        };
        reader.onerror = (err) => {
          console.error('[BarcodeService] FileReader error:', err);
          reject(err);
        };
        reader.readAsDataURL(blob);
      });
    } else {
      console.log('[BarcodeService] Reading image for NATIVE platform...');
      // For native platforms, use FileSystem
      if (!FileSystem) {
        throw new Error('FileSystem not available');
      }
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      console.log('[BarcodeService] Base64 length:', base64Data?.length || 0);
      // Add data URL prefix for the backend
      base64Image = `data:image/jpeg;base64,${base64Data}`;
    }
    
    if (!base64Image || base64Image.length === 0) {
      throw new Error('Failed to read image - empty base64 data');
    }
    
    console.log('[BarcodeService] Image read successfully, total size:', base64Image.length);
    
    // Step 1: Use OpenCV/pyzbar backend to detect barcode
    console.log('[BarcodeService] Step 1: Sending to backend OpenCV/pyzbar for barcode detection...');
    
    const scanUrl = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.SCAN_BASE64}`;
    console.log('[BarcodeService] Backend URL:', scanUrl);
    
    let detectedBarcode: string | null = null;
    
    try {
      const response = await fetch(scanUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          filename: 'barcode_scan.jpg',
        }),
      });
      
      console.log('[BarcodeService] Backend response status:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('[BarcodeService] Backend response:', JSON.stringify(result).substring(0, 300));
      
      if (result.success && result.data?.barcode) {
        detectedBarcode = result.data.barcode;
        console.log('[BarcodeService] ✓ Barcode detected by OpenCV:', detectedBarcode);
      } else {
        console.warn('[BarcodeService] OpenCV could not detect barcode:', result.error || result.message);
      }
    } catch (backendError: any) {
      console.warn('[BarcodeService] Backend OpenCV error:', backendError.message);
    }
    
    // If no barcode detected, return error
    if (!detectedBarcode) {
      return {
        success: false,
        error: 'Could not detect barcode in the image',
        message: 'No barcode found. Please ensure the barcode is clearly visible.',
        tips: [
          'Ensure the barcode is clearly visible and well-lit',
          'Hold the camera steady and in focus',
          'Position the barcode in the center of the frame',
          'Try different angles if detection fails',
          'Use manual entry as an alternative',
        ],
        suggestion: 'manual_entry',
      };
    }
    
    // Step 2: Use Gemini AI to get detailed product information
    console.log('[BarcodeService] Step 2: Sending to Gemini AI for product details...');
    
    // Extract raw base64 data (remove data URL prefix)
    const rawBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    
    try {
      const geminiData = await getProductDetailsFromGemini(detectedBarcode, rawBase64);
      console.log('[BarcodeService] ✓ Gemini AI provided product details');
      
      // Combine OpenCV barcode detection with Gemini product info
      return {
        success: true,
        data: {
          barcode: detectedBarcode,
          product_name: geminiData.product_name || 'Unknown Product',
          brand: geminiData.brand || 'Unknown Brand',
          quantity: geminiData.quantity || 'N/A',
          categories: geminiData.categories || geminiData.product_type || 'Food Product',
          ingredients_text: geminiData.ingredients || 'Not specified',
          image_url: imageUri,
          nutritional_info: geminiData.nutritional_info ? {
            energy_kcal: geminiData.nutritional_info.energy_kcal || null,
            fat: geminiData.nutritional_info.fat || null,
            saturated_fat: geminiData.nutritional_info.saturated_fat || null,
            trans_fat: geminiData.nutritional_info.trans_fat || null,
            cholesterol: null,
            carbohydrates: geminiData.nutritional_info.carbohydrates || null,
            sugars: null,
            fiber: null,
            proteins: geminiData.nutritional_info.proteins || null,
            salt: null,
            sodium: geminiData.nutritional_info.sodium || null,
            unit: '100g',
            polyunsaturated_fat: geminiData.nutritional_info.polyunsaturated_fat || null,
          } : null,
          oil_content: geminiData.nutritional_info?.fat ? `${geminiData.nutritional_info.fat}g` : 'Unknown',
          additives: [],
          nutriscore_grade: null,
          nova_group: null,
          labels: geminiData.product_type || 'Edible Product',
          fatty_acids: {
            sfa: geminiData.sfa || null,
            tfa: geminiData.tfa || null,
            pfa: geminiData.pfa || null,
            is_food_product: geminiData.is_food_product !== false,
          },
        },
        message: 'Product scanned successfully with AI analysis',
        tips: geminiData.health_tips || [
          'Track your oil consumption daily',
          'Choose healthier oil alternatives',
          'Monitor your SwasthaIndex score',
        ],
      };
    } catch (geminiError: any) {
      console.warn('[BarcodeService] Gemini AI failed, falling back to OpenFoodFacts:', geminiError.message);
      
      // Fallback: Try OpenFoodFacts with the detected barcode
      try {
        const offResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${detectedBarcode}.json`);
        const offData = await offResponse.json();
        
        if (offData.status === 1 && offData.product) {
          const product = offData.product;
          console.log('[BarcodeService] ✓ Product found in OpenFoodFacts:', product.product_name);
          
          return {
            success: true,
            data: {
              barcode: detectedBarcode,
              product_name: product.product_name || 'Unknown Product',
              brand: product.brands || 'Unknown Brand',
              quantity: product.quantity || 'N/A',
              categories: product.categories || 'Food Product',
              ingredients_text: product.ingredients_text || 'Not specified',
              image_url: product.image_url || imageUri,
              nutritional_info: {
                energy_kcal: product.nutriments?.['energy-kcal_100g'] || null,
                fat: product.nutriments?.fat_100g || null,
                saturated_fat: product.nutriments?.['saturated-fat_100g'] || null,
                trans_fat: product.nutriments?.['trans-fat_100g'] || null,
                cholesterol: product.nutriments?.cholesterol_100g || null,
                carbohydrates: product.nutriments?.carbohydrates_100g || null,
                sugars: product.nutriments?.sugars_100g || null,
                fiber: product.nutriments?.fiber_100g || null,
                proteins: product.nutriments?.proteins_100g || null,
                salt: product.nutriments?.salt_100g || null,
                sodium: product.nutriments?.sodium_100g || null,
                unit: '100g',
              },
              oil_content: product.nutriments?.fat_100g ? `${product.nutriments.fat_100g}g` : 'Unknown',
              additives: product.additives_tags || [],
              nutriscore_grade: product.nutriscore_grade || null,
              nova_group: product.nova_group || null,
              labels: product.labels || 'N/A',
            },
            message: 'Product found in OpenFoodFacts database',
            tips: [
              'Check the nutritional information',
              'Track your daily oil consumption',
              'Compare with healthier alternatives',
            ],
          };
        }
      } catch (offError) {
        console.warn('[BarcodeService] OpenFoodFacts fallback also failed');
      }
      
      // Return basic info with just the barcode
      return {
        success: true,
        data: {
          barcode: detectedBarcode,
          product_name: 'Unknown Product',
          brand: 'Unknown Brand',
          quantity: 'N/A',
          categories: 'Food Product',
          ingredients_text: 'Not specified',
          image_url: imageUri,
          nutritional_info: null,
          oil_content: 'Unknown',
          additives: [],
          nutriscore_grade: null,
          nova_group: null,
          labels: 'N/A',
        },
        message: `Barcode ${detectedBarcode} detected. Product details not available.`,
        tips: [
          'Enter product details manually for accurate tracking',
          'Check the product packaging for nutritional info',
        ],
      };
    }
    
  } catch (error: any) {
    console.error('[BarcodeService] Barcode scan failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to scan barcode',
      tips: [
        'Ensure the barcode is clearly visible and well-lit',
        'Avoid glare and reflections on the packaging',
        'Try to capture the barcode in the center of the frame',
        'Make sure the backend server is running',
        'Use manual entry if scanning fails repeatedly',
      ],
    };
  }
};

/**
 * Look up product by barcode number using OpenFoodFacts API
 */
export const lookupBarcode = async (barcode: string): Promise<BarcodeResponse> => {
  try {
    console.log('[BarcodeService] lookupBarcode called with:', barcode);
    console.log('[BarcodeService] Searching OpenFoodFacts database...');
    
    // Try backend lookup first
    const lookupUrl = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.LOOKUP(barcode)}`;
    console.log('[BarcodeService] Backend lookup URL:', lookupUrl);
    
    try {
      const response = await fetch(lookupUrl);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('[BarcodeService] Product found via backend:', data.data.product_name);
        return {
          success: true,
          data: data.data,
          message: 'Product found in database',
          tips: [
            'Check the nutritional information',
            'Track your daily oil consumption',
            'Compare with healthier alternatives',
          ],
        };
      }
    } catch (backendError) {
      console.warn('[BarcodeService] Backend lookup failed, trying OpenFoodFacts directly');
    }
    
    // Fallback to direct OpenFoodFacts API
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      const product = data.product;
      console.log('[BarcodeService] Product found in OpenFoodFacts:', product.product_name);
      
      return {
        success: true,
        data: {
          barcode: barcode,
          product_name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          quantity: product.quantity || 'N/A',
          categories: product.categories || 'Food Product',
          ingredients_text: product.ingredients_text || 'Not specified',
          image_url: product.image_url || 'https://via.placeholder.com/300',
          nutritional_info: {
            energy_kcal: product.nutriments?.['energy-kcal_100g'] || null,
            fat: product.nutriments?.fat_100g || null,
            saturated_fat: product.nutriments?.['saturated-fat_100g'] || null,
            trans_fat: product.nutriments?.['trans-fat_100g'] || null,
            cholesterol: product.nutriments?.cholesterol_100g || null,
            carbohydrates: product.nutriments?.carbohydrates_100g || null,
            sugars: product.nutriments?.sugars_100g || null,
            fiber: product.nutriments?.fiber_100g || null,
            proteins: product.nutriments?.proteins_100g || null,
            salt: product.nutriments?.salt_100g || null,
            sodium: product.nutriments?.sodium_100g || null,
            unit: '100g',
          },
          oil_content: product.nutriments?.fat_100g ? `${product.nutriments.fat_100g}g` : 'Unknown',
          additives: product.additives_tags || [],
          nutriscore_grade: product.nutriscore_grade || null,
          nova_group: product.nova_group || null,
          labels: product.labels || 'N/A',
        },
        message: 'Product found in database',
        tips: [
          'Check the nutritional information',
          'Track your daily oil consumption',
          'Compare with healthier alternatives',
        ],
      };
    }
    
    // If not found in OpenFoodFacts, return a helpful message
    console.log('[BarcodeService] Product not found in database');
    return {
      success: false,
      error: 'Product not found. Try scanning the product image instead or enter details manually.',
    };

  } catch (error: any) {
    console.error('[BarcodeService] Barcode lookup error:', error);
    return {
      success: false,
      error: error.message || 'Failed to lookup barcode',
    };
  }
};

/**
 * Search products by name using backend or OpenFoodFacts
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> => {
  try {
    console.log('[BarcodeService] searchProducts called with:', query);
    
    // Try backend search first
    const searchUrl = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.SEARCH}?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
    console.log('[BarcodeService] Backend search URL:', searchUrl);
    
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('[BarcodeService] Search results from backend:', data.data.count);
        return {
          success: true,
          data: data.data,
        };
      }
    } catch (backendError) {
      console.warn('[BarcodeService] Backend search failed, trying OpenFoodFacts directly');
    }
    
    // Fallback to direct OpenFoodFacts API
    const searchResponse = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}`
    );
    const searchData = await searchResponse.json();
    
    const results: SearchResult[] = (searchData.products || []).map((product: any) => ({
      barcode: product.code || '',
      product_name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      image_url: product.image_url || 'https://via.placeholder.com/150',
      nutriscore_grade: product.nutriscore_grade || null,
    }));
    
    console.log('[BarcodeService] Search results from OpenFoodFacts:', results.length);
    
    return {
      success: true,
      data: {
        query: query,
        count: results.length,
        results: results,
      },
    };
  } catch (error: any) {
    console.error('Product search error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search products',
    };
  }
};

export const barcodeService = {
  scanBarcodeImage,
  lookupBarcode,
  searchProducts,
};

export default barcodeService;