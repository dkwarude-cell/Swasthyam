# SwasthTel - OpenCV Integration Installation Script
# Run this script from the swasthtel-app directory

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SwasthTel - OpenCV Integration Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (!(Test-Path ".\backend\package.json")) {
    Write-Host "ERROR: Please run this script from the swasthtel-app directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Installing backend dependencies..." -ForegroundColor Yellow
Write-Host ""

Set-Location backend

Write-Host "Running: npm install" -ForegroundColor Gray
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "Warning: No .env file found in backend directory" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example if it exists..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
    } else {
        Write-Host "No .env.example found. Backend will use default configuration." -ForegroundColor Yellow
    }
    Write-Host ""
}

Set-Location ..

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The following packages were installed:" -ForegroundColor White
Write-Host "  • axios - HTTP client for OpenFoodFacts API" -ForegroundColor Gray
Write-Host "  • multer - File upload middleware" -ForegroundColor Gray
Write-Host "  • sharp - High-performance image processing" -ForegroundColor Gray
Write-Host "  • jimp - JavaScript image manipulation" -ForegroundColor Gray
Write-Host "  • jsqr - QR code decoder" -ForegroundColor Gray
Write-Host "  • quagga - Barcode decoder for EAN/UPC" -ForegroundColor Gray
Write-Host "  • form-data - FormData implementation" -ForegroundColor Gray
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start the backend server:" -ForegroundColor White
Write-Host "     cd backend" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Start the mobile app (in a new terminal):" -ForegroundColor White
Write-Host "     npm start" -ForegroundColor Gray
Write-Host "     # or" -ForegroundColor Gray
Write-Host "     expo start" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Test the Oil Scan feature:" -ForegroundColor White
Write-Host "     • Open app → Tap 'Oil Scan'" -ForegroundColor Gray
Write-Host "     • Take a photo of a product barcode" -ForegroundColor Gray
Write-Host "     • Or use manual entry with barcode: 5449000000996" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  • Quick Start: OPENCV_INTEGRATION_SUMMARY.md" -ForegroundColor Gray
Write-Host "  • Full Docs: docs/OPENCV_INTEGRATION.md" -ForegroundColor Gray
Write-Host "  • Architecture: docs/ARCHITECTURE_DIAGRAM.txt" -ForegroundColor Gray
Write-Host ""

Write-Host "API Endpoints Available:" -ForegroundColor Yellow
Write-Host "  POST   /api/barcode/scan           - Upload and scan barcode" -ForegroundColor Gray
Write-Host "  GET    /api/barcode/lookup/:code   - Lookup by barcode number" -ForegroundColor Gray
Write-Host "  GET    /api/barcode/search?q=term  - Search products by name" -ForegroundColor Gray
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Ready to scan barcodes! 📱" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
