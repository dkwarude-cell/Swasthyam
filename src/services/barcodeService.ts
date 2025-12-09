import { Platform } from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Conditionally import FileSystem only for native platforms
let FileSystem: any = null;
if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system/legacy');
}

// Add console logging for debugging
console.log('[BarcodeService] Module loaded successfully');
console.log('[BarcodeService] OpenCV/pyzbar integration enabled');
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
 * Scan barcode from image using OpenCV/pyzbar backend
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
    console.log('[BarcodeService] Sending to backend OpenCV/pyzbar...');
    
    // Send to backend for barcode detection
    const scanUrl = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.SCAN_BASE64}`;
    console.log('[BarcodeService] Backend URL:', scanUrl);
    
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
    
    if (!result.success) {
      console.warn('[BarcodeService] Barcode detection failed:', result.error || result.message);
      return {
        success: false,
        error: result.error || result.message || 'Could not detect barcode',
        message: result.message,
        tips: result.tips || [
          'Ensure the barcode is clearly visible and well-lit',
          'Hold the camera steady and in focus',
          'Position the barcode in the center of the frame',
          'Try different angles if detection fails',
          'Use manual entry as an alternative',
        ],
        suggestion: result.suggestion,
      };
    }
    
    console.log('[BarcodeService] Barcode detected successfully');
    console.log('[BarcodeService] ========== SCAN COMPLETE ==========');
    
    return {
      success: true,
      data: {
        barcode: result.data.barcode,
        product_name: result.data.product_name || 'Unknown Product',
        brand: result.data.brand || 'Unknown Brand',
        quantity: result.data.quantity || 'N/A',
        categories: result.data.categories || 'Food Product',
        ingredients_text: result.data.ingredients_text || 'Not specified',
        image_url: result.data.image_url || imageUri,
        nutritional_info: result.data.nutritional_info || null,
        oil_content: result.data.oil_content || 'Unknown',
        additives: result.data.additives || [],
        nutriscore_grade: result.data.nutriscore_grade || null,
        nova_group: result.data.nova_group || null,
        labels: result.data.labels || 'N/A',
        fatty_acids: result.data.fatty_acids || {
          sfa: null,
          tfa: null,
          pfa: null,
          is_food_product: true,
        },
      },
      message: result.message || 'Product scanned successfully',
      tips: result.tips || [
        'Track your oil consumption daily',
        'Choose healthier oil alternatives',
        'Monitor your SwasthaIndex score',
      ],
    };
    
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