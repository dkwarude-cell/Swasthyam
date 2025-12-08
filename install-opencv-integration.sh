#!/bin/bash

# SwasthTel - OpenCV Integration Installation Script
# Run this script from the swasthtel-app directory

echo "================================================"
echo "  SwasthTel - OpenCV Integration Setup"
echo "================================================"
echo ""

# Check if we're in the correct directory
if [ ! -f "./backend/package.json" ]; then
    echo "ERROR: Please run this script from the swasthtel-app directory"
    exit 1
fi

echo "Step 1: Installing backend dependencies..."
echo ""

cd backend

echo "Running: npm install"
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    exit 1
fi

echo ""
echo "✓ Backend dependencies installed successfully!"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: No .env file found in backend directory"
    echo "Creating .env from .env.example if it exists..."
    
    if [ -f ".env.example" ]; then
        cp ".env.example" ".env"
        echo "✓ Created .env file from .env.example"
    else
        echo "No .env.example found. Backend will use default configuration."
    fi
    echo ""
fi

cd ..

echo "================================================"
echo "  Installation Complete!"
echo "================================================"
echo ""
echo "The following packages were installed:"
echo "  • axios - HTTP client for OpenFoodFacts API"
echo "  • multer - File upload middleware"
echo "  • sharp - High-performance image processing"
echo "  • jimp - JavaScript image manipulation"
echo "  • jsqr - QR code decoder"
echo "  • quagga - Barcode decoder for EAN/UPC"
echo "  • form-data - FormData implementation"
echo ""

echo "Next Steps:"
echo "  1. Start the backend server:"
echo "     cd backend"
echo "     npm run dev"
echo ""
echo "  2. Start the mobile app (in a new terminal):"
echo "     npm start"
echo "     # or"
echo "     expo start"
echo ""
echo "  3. Test the Oil Scan feature:"
echo "     • Open app → Tap 'Oil Scan'"
echo "     • Take a photo of a product barcode"
echo "     • Or use manual entry with barcode: 5449000000996"
echo ""

echo "Documentation:"
echo "  • Quick Start: OPENCV_INTEGRATION_SUMMARY.md"
echo "  • Full Docs: docs/OPENCV_INTEGRATION.md"
echo "  • Architecture: docs/ARCHITECTURE_DIAGRAM.txt"
echo ""

echo "API Endpoints Available:"
echo "  POST   /api/barcode/scan           - Upload and scan barcode"
echo "  GET    /api/barcode/lookup/:code   - Lookup by barcode number"
echo "  GET    /api/barcode/search?q=term  - Search products by name"
echo ""

echo "================================================"
echo "  Ready to scan barcodes! 📱"
echo "================================================"
