const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  scanBarcodeImage,
  lookupBarcode,
  searchProducts,
} = require('../controllers/barcodeScanController');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('[Multer] Receiving file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('[Multer] Rejected non-image file:', file.mimetype);
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Middleware to log request details
const logRequest = (req, res, next) => {
  console.log('[Barcode Route] POST /scan request received');
  console.log('[Barcode Route] Content-Type:', req.headers['content-type']);
  console.log('[Barcode Route] Body type:', typeof req.body);
  console.log('[Barcode Route] Has file:', !!req.file);
  next();
};

// @route   POST /api/barcode/scan
// @desc    Upload and scan barcode from image (multipart/form-data)
// @access  Private
router.post('/scan', protect, logRequest, upload.single('file'), scanBarcodeImage);

// @route   POST /api/barcode/scan-base64
// @desc    Scan barcode from base64 encoded image
// @access  Private
router.post('/scan-base64', protect, scanBarcodeImage);

// @route   GET /api/barcode/lookup/:barcode
// @desc    Lookup product by barcode number
// @access  Private
router.get('/lookup/:barcode', protect, lookupBarcode);

// @route   GET /api/barcode/search
// @desc    Search products by name
// @access  Private
router.get('/search', protect, searchProducts);

module.exports = router;
