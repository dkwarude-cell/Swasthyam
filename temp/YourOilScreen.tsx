import { ChevronLeft, Scan, Plus, Trash2, Droplet } from 'lucide-react';
import { useState } from 'react';

interface YourOilScreenProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

interface OilProduct {
  id: string;
  name: string;
  brand: string;
  type: string;
  volume: string;
  barcode?: string;
}

export function YourOilScreen({ onNext, onSkip, onBack, language }: YourOilScreenProps) {
  const [oilProducts, setOilProducts] = useState<OilProduct[]>([]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualProduct, setManualProduct] = useState({
    name: '',
    brand: '',
    type: '',
    volume: ''
  });

  const handleScanBarcode = () => {
    // Mock barcode scan - in real app would use device camera
    const mockProducts = [
      { id: '1', name: 'Fortune Rice Bran Oil', brand: 'Fortune', type: 'Rice Bran', volume: '5L', barcode: '8901234567890' },
      { id: '2', name: 'Saffola Gold Oil', brand: 'Saffola', type: 'Blended', volume: '5L', barcode: '8901234567891' },
      { id: '3', name: 'Sundrop Heart Oil', brand: 'Sundrop', type: 'Sunflower', volume: '5L', barcode: '8901234567892' }
    ];
    
    // Simulate scan with random product
    const scannedProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    setOilProducts(prev => [...prev, { ...scannedProduct, id: Date.now().toString() }]);
  };

  const handleAddManual = () => {
    if (manualProduct.name && manualProduct.brand && manualProduct.type && manualProduct.volume) {
      setOilProducts(prev => [...prev, {
        ...manualProduct,
        id: Date.now().toString()
      }]);
      setManualProduct({ name: '', brand: '', type: '', volume: '' });
      setShowManualAdd(false);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setOilProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleContinue = () => {
    onNext({ oilProducts });
  };

  return (
    <div className="h-screen bg-[#fafbfa] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E7F2F1] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
          </button>
          <span className="text-[#5B5B5B] text-sm">Step 4 of 6</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1b4a5a] rounded-full transition-all duration-300"
            style={{ width: '66.67%' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h1 className="text-[#040707] text-2xl mb-2">Your Oil at Home</h1>
        <p className="text-[#5B5B5B] text-sm mb-8">Scan or add the cooking oils you use</p>

        {/* Scan Barcode Button */}
        <button
          onClick={handleScanBarcode}
          className="w-full py-6 bg-gradient-to-r from-[#1b4a5a] to-[#2a5a6a] text-white rounded-xl flex items-center justify-center gap-3 mb-4 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Scan className="w-6 h-6" />
          <span>Scan Oil Barcode</span>
        </button>

        {/* Manual Add Button */}
        <button
          onClick={() => setShowManualAdd(!showManualAdd)}
          className="w-full py-4 bg-white border-2 border-[#E7F2F1] text-[#040707] rounded-xl flex items-center justify-center gap-3 mb-6 hover:border-[#1b4a5a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Manually</span>
        </button>

        {/* Manual Add Form */}
        {showManualAdd && (
          <div className="bg-white border border-[#E7F2F1] rounded-xl p-4 mb-6 space-y-3">
            <h3 className="text-[#040707]">Add Oil Details</h3>
            
            <input
              type="text"
              placeholder="Oil Name"
              value={manualProduct.name}
              onChange={(e) => setManualProduct(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-[#fafbfa] border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
            
            <input
              type="text"
              placeholder="Brand"
              value={manualProduct.brand}
              onChange={(e) => setManualProduct(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-4 py-3 bg-[#fafbfa] border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
            
            <select
              value={manualProduct.type}
              onChange={(e) => setManualProduct(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-[#fafbfa] border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
            >
              <option value="">Select Oil Type</option>
              <option value="sunflower">Sunflower Oil</option>
              <option value="rice-bran">Rice Bran Oil</option>
              <option value="mustard">Mustard Oil</option>
              <option value="groundnut">Groundnut Oil</option>
              <option value="olive">Olive Oil</option>
              <option value="coconut">Coconut Oil</option>
              <option value="soybean">Soybean Oil</option>
              <option value="blended">Blended Oil</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={manualProduct.volume}
              onChange={(e) => setManualProduct(prev => ({ ...prev, volume: e.target.value }))}
              className="w-full px-4 py-3 bg-[#fafbfa] border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
            >
              <option value="">Select Volume</option>
              <option value="1L">1 Liter</option>
              <option value="2L">2 Liters</option>
              <option value="5L">5 Liters</option>
              <option value="15L">15 Liters</option>
              <option value="other">Other</option>
            </select>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddManual}
                className="flex-1 py-2 bg-[#1b4a5a] text-white rounded-lg hover:bg-[#153a47] transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowManualAdd(false)}
                className="flex-1 py-2 bg-[#E7F2F1] text-[#5B5B5B] rounded-lg hover:bg-[#d0dad9] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Added Products List */}
        {oilProducts.length > 0 ? (
          <div className="space-y-3 pb-6">
            <h3 className="text-[#040707]">Added Oils ({oilProducts.length})</h3>
            {oilProducts.map((product) => (
              <div key={product.id} className="bg-white border border-[#E7F2F1] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#fcaf56]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-6 h-6 text-[#fcaf56]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#040707]">{product.name}</p>
                    <p className="text-[#5B5B5B] text-sm">{product.brand} • {product.type}</p>
                    <p className="text-[#5B5B5B] text-sm">Volume: {product.volume}</p>
                    {product.barcode && (
                      <p className="text-[#5B5B5B] text-xs mt-1">Barcode: {product.barcode}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-[#E7F2F1] rounded-xl p-8 text-center">
            <Droplet className="w-12 h-12 text-[#5B5B5B] mx-auto mb-3 opacity-50" />
            <p className="text-[#5B5B5B]">No oils added yet</p>
            <p className="text-[#5B5B5B] text-sm mt-1">Scan or add your cooking oils to continue</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white px-5 py-4 border-t border-[#E7F2F1] space-y-3 flex-shrink-0">
        <button
          onClick={handleContinue}
          disabled={oilProducts.length === 0}
          className={`w-full py-4 rounded-xl transition-colors ${
            oilProducts.length > 0
              ? 'bg-[#1b4a5a] text-white hover:bg-[#153a47]'
              : 'bg-[#E7F2F1] text-[#5B5B5B] cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        <button
          onClick={onSkip}
          className="w-full py-2 text-[#5B5B5B] hover:text-[#040707] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
