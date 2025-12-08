const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');

// OpenFoodFacts API configuration
const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/api/v0/product';
const OPENFOODFACTS_SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

/**
 * @desc    Upload and scan barcode from image
 * @route   POST /api/barcode/scan (multipart) or POST /api/barcode/scan-base64 (JSON)
 * @access  Private
 */
exports.scanBarcodeImage = async (req, res) => {
  try {
    console.log('[ScanController] Received image upload request');
    console.log('[ScanController] Request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
    });
    console.log('[ScanController] Request body keys:', Object.keys(req.body || {}));
    console.log('[ScanController] Has file:', !!req.file);
    
    let imageBuffer;
    
    // Handle base64 image from JSON body (React Native friendly)
    if (req.body.image && typeof req.body.image === 'string') {
      console.log('[ScanController] Processing base64 image from JSON body');
      try {
        // Remove data:image/...;base64, prefix if present
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
        console.log('[ScanController] Base64 image decoded:', {
          size: imageBuffer.length,
          filename: req.body.filename || 'image.jpg',
        });
      } catch (error) {
        console.error('[ScanController] Failed to decode base64 image:', error);
        return res.status(400).json({
          success: false,
          error: 'Invalid base64 image data',
        });
      }
    }
    // Handle multipart file upload (traditional web upload)
    else if (req.file) {
      console.log('[ScanController] Processing multipart file upload');
      console.log('[ScanController] File received:', {
        size: req.file.size,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        fieldname: req.file.fieldname,
      });
      imageBuffer = req.file.buffer;
    }
    // No image provided
    else {
      console.error('[ScanController] No image provided in request');
      return res.status(400).json({
        success: false,
        error: 'No image provided. Please provide either a file upload or base64 image data.',
        debug: {
          hasBody: !!req.body,
          bodyKeys: Object.keys(req.body || {}),
          hasFile: !!req.file,
          contentType: req.headers['content-type'],
        }
      });
    }

    // Process image with sharp for optimization - multiple versions for detection
    console.log('[ScanController] Processing image for barcode detection...');
    
    // Create optimized version for detection
    imageBuffer = await sharp(imageBuffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .sharpen()
      .normalize()
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log('[ScanController] Image processed, size:', imageBuffer.length);

    // Try to decode barcode - with timeout
    let barcodeData = null;
    try {
      const decodePromise = decodeBarcodeFromImage(imageBuffer);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Decode timeout')), 20000)
      );
      barcodeData = await Promise.race([decodePromise, timeoutPromise]);
    } catch (decodeError) {
      console.error('[ScanController] Decode error:', decodeError.message);
    }

    if (!barcodeData) {
      console.error('[ScanController] No barcode detected after all methods');
      
      // Save failed image for debugging (optional)
      try {
        const fs = require('fs');
        const path = require('path');
        const debugDir = path.join(__dirname, '../../cache/failed-scans');
        
        if (!fs.existsSync(debugDir)) {
          fs.mkdirSync(debugDir, { recursive: true });
        }
        
        const timestamp = Date.now();
        const filename = path.join(debugDir, `failed-${timestamp}.jpg`);
        fs.writeFileSync(filename, imageBuffer);
        console.log('[ScanController] Failed image saved for debugging:', filename);
      } catch (saveError) {
        console.error('[ScanController] Could not save debug image:', saveError.message);
      }
      
      // Return helpful response with manual entry suggestion
      return res.status(200).json({
        success: false,
        error: 'Could not automatically detect barcode',
        message: 'Barcode detection failed. Tips: Make sure the barcode is clearly visible, well-lit, and in focus. Try different angles or use manual entry.',
        suggestion: 'manual_entry',
        tips: [
          'Ensure good lighting',
          'Hold camera steady',
          'Position barcode in center',
          'Try different angles',
          'Clean camera lens',
          'Use manual entry as alternative'
        ]
      });
    }

    console.log('[ScanController] Barcode detected:', barcodeData);

    // Validate barcode format
    if (!/^\d{8,13}$/.test(barcodeData)) {
      console.warn('[ScanController] Invalid barcode format:', barcodeData);
      return res.status(200).json({
        success: false,
        error: 'Invalid barcode format detected',
        message: 'The detected code doesn\'t match standard barcode formats. Please use manual entry.',
        suggestion: 'manual_entry',
        detected: barcodeData,
      });
    }

    // Look up product information
    const productInfo = await lookupProduct(barcodeData);

    console.log('[ScanController] Product lookup complete');

    res.json({
      success: true,
      data: {
        barcode: barcodeData,
        ...productInfo,
      },
    });
  } catch (error) {
    console.error('[ScanController] Barcode scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to scan barcode',
    });
  }
};

/**
 * @desc    Lookup product by barcode number
 * @route   GET /api/barcode/lookup/:barcode
 * @access  Private
 */
exports.lookupBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    if (!barcode || !/^\d{8,13}$/.test(barcode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid barcode format. Barcode must be 8-13 digits.',
      });
    }

    const productInfo = await lookupProduct(barcode);

    res.json({
      success: true,
      data: {
        barcode,
        ...productInfo,
      },
    });
  } catch (error) {
    console.error('Barcode lookup error:', error);
    
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        error: 'Product not found in database',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to lookup product',
    });
  }
};

/**
 * @desc    Search products by name
 * @route   GET /api/barcode/search
 * @access  Private
 */
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, page_size = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters',
      });
    }

    const searchResults = await searchProductsByName(q, page, page_size);

    res.json({
      success: true,
      data: {
        query: q,
        page: parseInt(page),
        page_size: parseInt(page_size),
        count: searchResults.length,
        results: searchResults,
      },
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search products',
    });
  }
};

/**
 * Decode barcode from image buffer using multiple methods
 */
async function decodeBarcodeFromImage(imageBuffer) {
  console.log('[BarcodeDecoder] Starting barcode decoding...');
  console.log('[BarcodeDecoder] Image buffer size:', imageBuffer.length);
  
  // Method 1: Use Python/pyzbar FIRST (most reliable for various barcode types)
  try {
    console.log('[BarcodeDecoder] Trying Python/pyzbar...');
    const { exec } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Save image to temporary file instead of passing base64 in command line
    const tempDir = path.join(__dirname, '../../cache/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempImagePath = path.join(tempDir, `barcode-${Date.now()}.jpg`);
    fs.writeFileSync(tempImagePath, imageBuffer);
    
    // Path to Python script
    const pythonScript = path.join(__dirname, '../python/decode_barcode.py');
    
    // Execute Python script with file path
    const { stdout, stderr } = await execPromise(
      `python "${pythonScript}" --file "${tempImagePath}"`,
      { 
        maxBuffer: 10 * 1024 * 1024,
        timeout: 10000 
      }
    );
    
    // Clean up temp file
    try {
      fs.unlinkSync(tempImagePath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    // Log all output for debugging
    if (stderr) {
      console.log('[BarcodeDecoder] Python stderr:', stderr);
    }
    if (!stdout || stdout.trim().length === 0) {
      console.log('[BarcodeDecoder] Python produced no output');
      throw new Error('Python script produced no output');
    }
    
    console.log('[BarcodeDecoder] Python stdout:', stdout.trim());
    const result = JSON.parse(stdout.trim());
    
    if (result.success && result.barcode) {
      console.log('[BarcodeDecoder] ✓ Python/pyzbar decoded:', result.barcode, `(method: ${result.method})`);
      return result.barcode;
    }
    
    console.log('[BarcodeDecoder] Python/pyzbar: No barcode found');
  } catch (pythonError) {
    console.log('[BarcodeDecoder] Python/pyzbar failed:', pythonError.message);
  }
  
  // Method 2: Try QR Server API with proper form data (fallback)
  try {
    console.log('[BarcodeDecoder] Trying QR Server API...');
    
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'barcode.jpg',
      contentType: 'image/jpeg',
    });
    
    const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 8000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    console.log('[BarcodeDecoder] QR API response:', JSON.stringify(response.data));
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const result = response.data[0];
      if (result.symbol && Array.isArray(result.symbol) && result.symbol.length > 0) {
        const decoded = result.symbol[0].data;
        if (decoded && decoded !== null) {
          console.log('[BarcodeDecoder] ✓ QR API decoded:', decoded);
          return decoded;
        }
      }
    }
    console.log('[BarcodeDecoder] QR API: No barcode found');
  } catch (apiError) {
    console.log('[BarcodeDecoder] QR API error:', apiError.message);
  }

  // Method 2: Try jsQR for QR codes (local library)
  try {
    console.log('[BarcodeDecoder] Trying jsQR (local)...');
    const jsQR = require('jsqr');
    const Jimp = require('jimp');
    
    const image = await Jimp.read(imageBuffer);
    console.log('[BarcodeDecoder] Image dimensions:', image.bitmap.width, 'x', image.bitmap.height);
    
    // Try with multiple image transformations and rotations
    const transformations = [
      { name: 'original', fn: () => image.clone() },
      { name: 'grayscale', fn: () => image.clone().grayscale() },
      { name: 'contrast+0.5', fn: () => image.clone().grayscale().contrast(0.5) },
      { name: 'contrast+0.8', fn: () => image.clone().grayscale().contrast(0.8) },
      { name: 'normalized', fn: () => image.clone().grayscale().normalize() },
      { name: 'inverted', fn: () => image.clone().grayscale().invert() },
      { name: 'brightness', fn: () => image.clone().grayscale().brightness(0.1) },
      { name: 'rotated-90', fn: () => image.clone().grayscale().rotate(90) },
      { name: 'rotated-180', fn: () => image.clone().grayscale().rotate(180) },
      { name: 'rotated-270', fn: () => image.clone().grayscale().rotate(270) },
    ];
    
    for (const { name, fn } of transformations) {
      try {
        const img = fn();
        const imageData = {
          data: new Uint8ClampedArray(img.bitmap.data),
          width: img.bitmap.width,
          height: img.bitmap.height,
        };
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        
        if (code && code.data) {
          console.log(`[BarcodeDecoder] ✓ jsQR decoded with ${name}:`, code.data);
          return code.data;
        }
      } catch (transformError) {
        console.log(`[BarcodeDecoder] Transform ${name} failed:`, transformError.message);
      }
    }
    console.log('[BarcodeDecoder] jsQR: No barcode found in any variation');
  } catch (jsQRError) {
    console.log('[BarcodeDecoder] jsQR error:', jsQRError.message);
  }

  // Method 3: Try ZXing via API
  try {
    console.log('[BarcodeDecoder] Trying ZXing API...');
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: 'barcode.jpg', contentType: 'image/jpeg' });
    
    // Using ZXing online decoder
    const response = await axios.post('https://zxing.org/w/decode', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 15000,
      maxRedirects: 5,
    });
    
    // Parse HTML response for barcode data
    const html = response.data;
    const match = html.match(/Parsed Result:<\/th><td><pre>([^<]+)<\/pre>/);
    if (match && match[1]) {
      const decoded = match[1].trim();
      console.log('[BarcodeDecoder] ✓ ZXing decoded:', decoded);
      return decoded;
    }
  } catch (zxingError) {
    console.log('[BarcodeDecoder] ZXing API failed:', zxingError.message);
  }

  // Method 4: Use Quagga with multiple orientations and formats
  try {
    console.log('[BarcodeDecoder] Trying Quagga with enhanced settings...');
    const Quagga = require('quagga');
    const Jimp = require('jimp');
    
    const image = await Jimp.read(imageBuffer);
    
    // Try different image preprocessing for Quagga
    const quaggaAttempts = [
      { name: 'original', img: image.clone() },
      { name: 'grayscale+contrast', img: image.clone().grayscale().contrast(0.5) },
      { name: 'normalized', img: image.clone().grayscale().normalize() },
      { name: 'rotated-90', img: image.clone().rotate(90) },
    ];
    
    for (const { name, img } of quaggaAttempts) {
      try {
        const base64Image = await img.getBase64Async(Jimp.MIME_JPEG);
        
        const result = await new Promise((resolve) => {
          Quagga.decodeSingle({
            src: base64Image,
            numOfWorkers: 0,
            decoder: {
              readers: [
                'ean_reader',
                'ean_8_reader',
                'code_128_reader',
                'code_39_reader',
                'code_39_vin_reader',
                'codabar_reader',
                'upc_reader',
                'upc_e_reader',
                'i2of5_reader',
              ],
            },
            locate: true,
            locator: {
              patchSize: 'medium',
              halfSample: false,
            },
          }, (result) => {
            if (result && result.codeResult && result.codeResult.code) {
              console.log(`[BarcodeDecoder] ✓ Quagga decoded with ${name}:`, result.codeResult.code);
              resolve(result.codeResult.code);
            } else {
              resolve(null);
            }
          });
        });
        
        if (result) return result;
      } catch (attemptError) {
        console.log(`[BarcodeDecoder] Quagga ${name} failed:`, attemptError.message);
      }
    }
  } catch (quaggaError) {
    console.log('[BarcodeDecoder] Quagga failed:', quaggaError.message);
  }

  console.warn('[BarcodeDecoder] All decoding methods failed');
  return null;
}

/**
 * Look up product information from OpenFoodFacts API
 */
async function lookupProduct(barcode) {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API_URL}/${barcode}.json`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'SwasthTel - Oil Tracking App - Version 1.0',
      },
    });

    if (!response.data || response.data.status !== 1) {
      throw new Error('Product not found');
    }

    const product = response.data.product;

    // Extract relevant information
    const productInfo = {
      product_name: product.product_name || product.product_name_en || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      quantity: product.quantity || '',
      categories: product.categories || '',
      ingredients_text: product.ingredients_text || product.ingredients_text_en || '',
      image_url: product.image_url || product.image_front_url || '',
      
      // Nutritional information
      nutritional_info: extractNutritionalInfo(product.nutriments),
      
      // Oil content analysis
      oil_content: analyzeOilContent(product),
      
      // Additives
      additives: product.additives_tags || [],
      additives_en: product.additives_en || [],
      
      // Health scores
      nutriscore_grade: product.nutriscore_grade || null,
      nova_group: product.nova_group || null,
      ecoscore_grade: product.ecoscore_grade || null,
      
      // Labels
      labels: product.labels || '',
      
      // Product metadata
      countries: product.countries || '',
      packaging: product.packaging || '',
    };

    return productInfo;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Product not found');
    }
    throw error;
  }
}

/**
 * Extract nutritional information from product nutriments
 */
function extractNutritionalInfo(nutriments) {
  if (!nutriments) return null;

  return {
    energy_kcal: nutriments.energy_value || nutriments['energy-kcal_100g'] || null,
    energy_kj: nutriments['energy-kj_100g'] || null,
    fat: nutriments.fat_100g || nutriments.fat || null,
    saturated_fat: nutriments['saturated-fat_100g'] || nutriments.saturated_fat || null,
    trans_fat: nutriments['trans-fat_100g'] || nutriments.trans_fat || null,
    cholesterol: nutriments.cholesterol_100g || nutriments.cholesterol || null,
    carbohydrates: nutriments.carbohydrates_100g || nutriments.carbohydrates || null,
    sugars: nutriments.sugars_100g || nutriments.sugars || null,
    fiber: nutriments.fiber_100g || nutriments.fiber || null,
    proteins: nutriments.proteins_100g || nutriments.proteins || null,
    salt: nutriments.salt_100g || nutriments.salt || null,
    sodium: nutriments.sodium_100g || nutriments.sodium || null,
    unit: '100g',
  };
}

/**
 * Analyze oil content in the product
 */
function analyzeOilContent(product) {
  const nutriments = product.nutriments || {};
  const fat = nutriments.fat_100g || nutriments.fat || 0;
  const ingredients = (product.ingredients_text || '').toLowerCase();
  
  // Check if it's an oil product
  const isOilProduct = 
    ingredients.includes('oil') || 
    ingredients.includes('ghee') ||
    ingredients.includes('butter') ||
    (product.categories || '').toLowerCase().includes('oil');

  if (isOilProduct && fat > 50) {
    return `High oil content: ${fat}g per 100g`;
  } else if (fat > 20) {
    return `Moderate oil content: ${fat}g per 100g`;
  } else if (fat > 5) {
    return `Low oil content: ${fat}g per 100g`;
  } else if (fat > 0) {
    return `Very low oil content: ${fat}g per 100g`;
  }
  
  return 'Oil content not available';
}

/**
 * Search products by name
 */
async function searchProductsByName(query, page = 1, pageSize = 10) {
  try {
    const response = await axios.get(OPENFOODFACTS_SEARCH_URL, {
      params: {
        search_terms: query,
        page: page,
        page_size: pageSize,
        json: true,
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'SwasthTel - Oil Tracking App - Version 1.0',
      },
    });

    if (!response.data || !response.data.products) {
      return [];
    }

    return response.data.products.map(product => ({
      barcode: product.code || product._id,
      product_name: product.product_name || product.product_name_en || 'Unknown',
      brand: product.brands || 'Unknown',
      image_url: product.image_url || product.image_front_small_url || '',
      nutriscore_grade: product.nutriscore_grade || null,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

module.exports = exports;
