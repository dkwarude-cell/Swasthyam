# OpenCV Integration - Quick Start Guide

## What Was Done

The OpenCV barcode scanning backend has been successfully integrated into the SwasthTel app. Users can now scan product barcodes to get detailed nutritional information and oil content analysis.

## Files Created/Modified

### Backend Files Created:
1. `backend/controllers/barcodeScanController.js` - Barcode scanning logic with OpenFoodFacts integration
2. `backend/routes/barcode.js` - API routes for barcode operations

### Backend Files Modified:
3. `backend/server.js` - Added barcode routes
4. `backend/package.json` - Added required dependencies

### Frontend Files Created:
5. `src/services/barcodeService.ts` - API client for barcode operations

### Frontend Files Modified:
6. `src/config/api.ts` - Added barcode endpoints
7. `src/components/native/screens/BarcodeScannerScreen.tsx` - Connected to new backend

### Documentation:
8. `docs/OPENCV_INTEGRATION.md` - Comprehensive integration documentation

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd swasthtel-app/backend
npm install
```

This will install the following new packages:
- axios (HTTP client)
- multer (file upload)
- sharp (image processing)
- jimp (image manipulation)
- jsqr (QR/barcode decoder)
- quagga (EAN/UPC barcode decoder)
- form-data (FormData support)

### 2. Start Backend Server

```bash
npm run dev
```

The server will start on port 5000 with the new barcode endpoints available.

### 3. Test the Integration

The frontend is already configured to use the new backend. Simply:

1. Open the SwasthTel app
2. Tap "Oil Scan" on the home screen
3. Take a photo or upload an image of a product barcode
4. View the nutritional information and oil content

## API Endpoints Available

- `POST /api/barcode/scan` - Upload image and scan barcode
- `GET /api/barcode/lookup/:barcode` - Lookup product by barcode number
- `GET /api/barcode/search?q=query` - Search products by name

## How It Works

1. **User Action**: User taps "Oil Scan" and takes/uploads a photo
2. **Frontend**: Sends image to backend via barcodeService
3. **Backend**: 
   - Processes image with Sharp
   - Decodes barcode using jsQR/Quagga
   - Queries OpenFoodFacts API
   - Analyzes oil content from nutritional data
4. **Response**: Product info, nutritional data, and oil analysis
5. **Display**: User sees complete product information

## Key Features

✅ **Barcode Detection** - Automatic barcode decoding from images
✅ **Product Database** - Access to millions of products via OpenFoodFacts
✅ **Nutritional Info** - Complete nutritional breakdown per 100g
✅ **Oil Analysis** - Categorized oil content (High/Moderate/Low/Very Low)
✅ **Health Scores** - Nutriscore, NOVA group, Ecoscore
✅ **Manual Entry** - Fallback option to enter barcode manually
✅ **Product Search** - Search by product name

## Testing

### Quick Test with Manual Entry

1. Open app → Oil Scan
2. Tap "Manual Entry"
3. Enter barcode: `5449000000996` (Coca-Cola)
4. Should display product information

### Test with Image

Use any product with a visible barcode:
- Ensure good lighting
- Barcode clearly visible and in focus
- Take photo or select from gallery

## Troubleshooting

### Backend won't start
- Run `npm install` again
- Check Node.js version (should be 14+)
- Review error logs

### Can't scan barcodes
- Check camera permissions
- Ensure barcode is clearly visible
- Try manual entry as fallback

### Product not found
- Product may not be in OpenFoodFacts database
- Verify barcode number is correct
- Try searching by product name

## Next Steps

1. **Install dependencies**: `cd backend && npm install`
2. **Start server**: `npm run dev`
3. **Test in app**: Use Oil Scan feature
4. **Review docs**: See `docs/OPENCV_INTEGRATION.md` for details

## Support

For issues or questions:
1. Check `docs/OPENCV_INTEGRATION.md` for detailed documentation
2. Review error logs in backend console
3. Verify API_BASE_URL in `src/config/api.ts`

---

**Integration Status**: ✅ Complete
**Ready to Use**: Yes, after running `npm install` in backend
