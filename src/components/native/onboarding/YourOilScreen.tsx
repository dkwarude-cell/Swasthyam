import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

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
    // Mock barcode scan - simulates scanning
    const mockProducts = [
      { id: '1', name: 'Fortune Rice Bran Oil', brand: 'Fortune', type: 'Rice Bran', volume: '5L', barcode: '8901234567890' },
      { id: '2', name: 'Saffola Gold Oil', brand: 'Saffola', type: 'Blended', volume: '5L', barcode: '8901234567891' },
      { id: '3', name: 'Sundrop Heart Oil', brand: 'Sundrop', type: 'Sunflower', volume: '5L', barcode: '8901234567892' }
    ];
    
    const scannedProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    setOilProducts(prev => [...prev, { ...scannedProduct, id: Date.now().toString() }]);
    Alert.alert('Success', `Added ${scannedProduct.name}`);
  };

  const handleAddManual = () => {
    if (manualProduct.name && manualProduct.brand && manualProduct.type && manualProduct.volume) {
      setOilProducts(prev => [...prev, {
        ...manualProduct,
        id: Date.now().toString()
      }]);
      setManualProduct({ name: '', brand: '', type: '', volume: '' });
      setShowManualAdd(false);
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const handleRemoveProduct = (id: string) => {
    setOilProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleContinue = () => {
    onNext({ oilProducts });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#5B5B5B" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 4 of 6</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66.67%' }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Oil at Home</Text>
        <Text style={styles.subtitle}>Scan or add the cooking oils you use</Text>

        {/* Scan Barcode Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanBarcode}
        >
          <Ionicons name="scan" size={24} color="#ffffff" />
          <Text style={styles.scanButtonText}>Scan Oil Barcode</Text>
        </TouchableOpacity>

        {/* Manual Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowManualAdd(!showManualAdd)}
        >
          <Ionicons name="add" size={20} color="#040707" />
          <Text style={styles.addButtonText}>Add Manually</Text>
        </TouchableOpacity>

        {/* Manual Add Form */}
        {showManualAdd && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Oil Details</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Oil Name"
              placeholderTextColor="#999"
              value={manualProduct.name}
              onChangeText={(text) => setManualProduct(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Brand"
              placeholderTextColor="#999"
              value={manualProduct.brand}
              onChangeText={(text) => setManualProduct(prev => ({ ...prev, brand: text }))}
            />
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={manualProduct.type}
                onValueChange={(value) => setManualProduct(prev => ({ ...prev, type: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select Oil Type" value="" />
                <Picker.Item label="Sunflower Oil" value="sunflower" />
                <Picker.Item label="Rice Bran Oil" value="rice-bran" />
                <Picker.Item label="Mustard Oil" value="mustard" />
                <Picker.Item label="Groundnut Oil" value="groundnut" />
                <Picker.Item label="Olive Oil" value="olive" />
                <Picker.Item label="Coconut Oil" value="coconut" />
                <Picker.Item label="Soybean Oil" value="soybean" />
                <Picker.Item label="Blended Oil" value="blended" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={manualProduct.volume}
                onValueChange={(value) => setManualProduct(prev => ({ ...prev, volume: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select Volume" value="" />
                <Picker.Item label="1 Liter" value="1L" />
                <Picker.Item label="2 Liters" value="2L" />
                <Picker.Item label="5 Liters" value="5L" />
                <Picker.Item label="15 Liters" value="15L" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.formButtonAdd}
                onPress={handleAddManual}
              >
                <Text style={styles.formButtonAddText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.formButtonCancel}
                onPress={() => setShowManualAdd(false)}
              >
                <Text style={styles.formButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Added Products List */}
        {oilProducts.length > 0 ? (
          <View style={styles.productsList}>
            <Text style={styles.productsTitle}>Added Oils ({oilProducts.length})</Text>
            {oilProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productIcon}>
                  <Ionicons name="water" size={24} color="#fcaf56" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDetails}>{product.brand} • {product.type}</Text>
                  <Text style={styles.productVolume}>Volume: {product.volume}</Text>
                  {product.barcode && (
                    <Text style={styles.productBarcode}>Barcode: {product.barcode}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveProduct(product.id)}
                >
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="water" size={48} color="#5B5B5B" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No oils added yet</Text>
            <Text style={styles.emptySubtext}>Scan or add your cooking oils to continue</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, oilProducts.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={oilProducts.length === 0}
        >
          <Text style={[styles.continueButtonText, oilProducts.length === 0 && styles.continueButtonTextDisabled]}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E7F2F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1b4a5a',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#040707',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b4a5a',
    paddingVertical: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#E7F2F1',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  addButtonText: {
    color: '#040707',
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fafbfa',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#040707',
  },
  pickerContainer: {
    backgroundColor: '#fafbfa',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  formButtonAdd: {
    flex: 1,
    backgroundColor: '#1b4a5a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  formButtonAddText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  formButtonCancel: {
    flex: 1,
    backgroundColor: '#E7F2F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  formButtonCancelText: {
    color: '#5B5B5B',
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    gap: 12,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 4,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(252, 175, 86, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 2,
  },
  productVolume: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 2,
  },
  productBarcode: {
    fontSize: 12,
    color: '#5B5B5B',
    marginTop: 4,
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E7F2F1',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#5B5B5B',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#5B5B5B',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E7F2F1',
  },
  continueButton: {
    backgroundColor: '#1b4a5a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#E7F2F1',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#5B5B5B',
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#5B5B5B',
    fontSize: 14,
  },
});
