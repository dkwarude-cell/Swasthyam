import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Conditionally import FileSystem only for native platforms
let FileSystem: any = null;
if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system/legacy');
}

// Add console logging for debugging
console.log('[BarcodeService] Module loaded successfully');
console.log('[BarcodeService] API_BASE_URL:', API_BASE_URL);
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
    } | null;
    oil_content: string;
    additives: string[];
    nutriscore_grade: string | null;
    nova_group: number | null;
    labels: string;
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
 * Get auth token from AsyncStorage
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@swasthtel_token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Scan barcode from image using base64 encoding (React Native friendly)
 */
export const scanBarcodeImage = async (imageUri: string): Promise<BarcodeResponse> => {
  try {
    console.log('[BarcodeService] scanBarcodeImage called with:', imageUri);
    const token = await getAuthToken();
    console.log('[BarcodeService] Token retrieved:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.error('[BarcodeService] No auth token found');
      return {
        success: false,
        error: 'Authentication required. Please log in again.',
      };
    }

    // Extract filename from URI
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1] || 'barcode.jpg';
    
    console.log('[BarcodeService] Reading file as base64:', imageUri);
    
    let base64Image: string;
    
    if (Platform.OS === 'web') {
      // For web, fetch the blob and convert to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove the data:image/xxx;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // For native platforms, use FileSystem
      if (!FileSystem) {
        throw new Error('FileSystem not available');
      }
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
    }
    
    console.log('[BarcodeService] File read successfully, size:', base64Image.length, 'chars');

    // Use the base64 endpoint
    const url = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.SCAN_BASE64}`;
    console.log('[BarcodeService] Sending request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        filename: fileName,
      }),
    });

    console.log('[BarcodeService] Response status:', response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error('[BarcodeService] Server error:', data);
      return {
        success: false,
        error: data.error || `Server error: ${response.status}`,
      };
    }

    console.log('[BarcodeService] Scan successful');
    return data;
    
  } catch (error: any) {
    console.error('[BarcodeService] Barcode scan error:', error);
    return {
      success: false,
      error: error.message || 'Failed to scan barcode',
    };
  }
};

/**
 * Look up product by barcode number
 */
export const lookupBarcode = async (barcode: string): Promise<BarcodeResponse> => {
  try {
    console.log('[BarcodeService] lookupBarcode called with:', barcode);
    const token = await getAuthToken();
    console.log('[BarcodeService] Token retrieved:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.error('[BarcodeService] No auth token found');
      throw new Error('Authentication required. Please log in again.');
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.BARCODE.LOOKUP(barcode)}`;
    console.log('[BarcodeService] Sending request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[BarcodeService] Response status:', response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error('[BarcodeService] Server error:', data);
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    console.log('[BarcodeService] Lookup successful');
    return data;
  } catch (error: any) {
    console.error('[BarcodeService] Barcode lookup error:', error);
    return {
      success: false,
      error: error.message || 'Failed to lookup barcode',
    };
  }
};

/**
 * Search products by name
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.BARCODE.SEARCH}?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data;
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
