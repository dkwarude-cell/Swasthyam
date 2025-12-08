import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface MobilePartnersProps {
  language: string;
}

const { width } = Dimensions.get('window');

const certifiedPartners = [
  {
    id: 1,
    name: 'Spice Garden Restaurant',
    category: 'Restaurant',
    rating: 4.8,
    verified: true,
    healthScore: 92,
    address: 'Mumbai, Maharashtra',
    speciality: 'Traditional Indian Cuisine'
  },
  {
    id: 2,
    name: 'Green Leaf Cafe',
    category: 'Cafe',
    rating: 4.6,
    verified: true,
    healthScore: 88,
    address: 'Pune, Maharashtra',
    speciality: 'Healthy Fast Food'
  },
  {
    id: 3,
    name: 'Ocean View Bistro',
    category: 'Restaurant',
    rating: 4.7,
    verified: true,
    healthScore: 90,
    address: 'Goa',
    speciality: 'Seafood & Continental'
  },
  {
    id: 4,
    name: 'Masala Kitchen',
    category: 'Restaurant',
    rating: 4.5,
    verified: true,
    healthScore: 86,
    address: 'Delhi NCR',
    speciality: 'North Indian Cuisine'
  },
  {
    id: 5,
    name: 'Fresh Bites',
    category: 'Cafe',
    rating: 4.4,
    verified: true,
    healthScore: 84,
    address: 'Bangalore, Karnataka',
    speciality: 'Quick Bites & Beverages'
  },
  {
    id: 6,
    name: 'Royal Tandoor',
    category: 'Restaurant',
    rating: 4.9,
    verified: true,
    healthScore: 94,
    address: 'Hyderabad, Telangana',
    speciality: 'Mughlai & Tandoori'
  }
];

const oilProducts = [
  {
    id: 1,
    name: 'Fortune Rice Bran Oil',
    price: 155,
    unit: 'L',
    gst: '5%',
    tfa: '<2%',
    badges: ['Fortified', 'Healthy Choice'],
    availability: 'Available via PDS in Maharashtra',
    points: 5,
    featured: true
  },
  {
    id: 2,
    name: 'Sundrop Heart Lite',
    price: 142,
    unit: 'L',
    gst: '12%',
    tfa: '<2%',
    badges: ['Fortified'],
    availability: 'Available in most regions',
    points: 4,
    featured: false
  },
  {
    id: 3,
    name: 'Saffola Gold Pro Healthy Lifestyle',
    price: 168,
    unit: 'L',
    gst: '5%',
    tfa: '<1%',
    badges: ['Fortified', 'Healthy Choice', 'Low TFA'],
    availability: 'Premium stores nationwide',
    points: 8,
    featured: true
  },
  {
    id: 4,
    name: 'Dhara Groundnut Oil',
    price: 135,
    unit: 'L',
    gst: '18%',
    tfa: '<3%',
    badges: ['Traditional'],
    availability: 'Available via PDS in Tamil Nadu',
    points: 3,
    featured: false
  },
  {
    id: 5,
    name: 'Oleev Active Olive Oil',
    price: 285,
    unit: 'L',
    gst: '5%',
    tfa: '<1%',
    badges: ['Fortified', 'Healthy Choice', 'Premium'],
    availability: 'Premium outlets',
    points: 12,
    featured: true
  },
  {
    id: 6,
    name: 'Gemini Sunflower Oil',
    price: 128,
    unit: 'L',
    gst: '12%',
    tfa: '<2%',
    badges: ['Fortified'],
    availability: 'Available in South India',
    points: 4,
    featured: false
  }
];

export function MobilePartners({ language }: MobilePartnersProps) {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState('certified');
  const [productSearch, setProductSearch] = useState('');
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [selectedGST, setSelectedGST] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [showFortified, setShowFortified] = useState(false);
  const [compareProducts, setCompareProducts] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const text = {
    en: {
      partnersTitle: 'SwasthTel Partners',
      partnersSubtitle: 'Certified partners & products',
      certifiedTab: 'Swasth Tel Certified',
      productsTab: 'Swasth Oil Products',
      title: 'Swasth Oil Products',
      subtitle: 'Verified healthy cooking oils',
      restaurantSearchPlaceholder: 'Search restaurants, cafes...',
      verified: 'Verified',
      healthScore: 'Health Score',
      scanProduct: 'Scan Oil Product',
      enterManual: 'Enter SKU / Manual',
      scanInfo: 'Scan any edible oil bottle to view GST, health score and better alternatives.',
      howWorks: 'How scanning works',
      searchPlaceholder: 'Search oil, brand, or SKU',
      sort: 'Sort:',
      popular: 'Popular',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      compareProducts: 'Compare Products',
      addToCompare: 'Add to compare',
      pts: 'pts if purchased',
      compare: 'Compare',
      closeComparison: 'Close',
      clearAll: 'Clear All',
      selectProducts: 'Select 2-3 products to compare',
      price: 'Price',
      gstRate: 'GST Rate',
      transFat: 'Trans Fat',
      benefits: 'Benefits',
      availability: 'Availability',
      rewardPoints: 'Reward Points',
      aboutTitle: 'About Swasth Oil Products',
      aboutText1: 'All listed products are verified for quality standards and health parameters. Products with "Healthy Choice" badge meet SwasthTel\'s recommended criteria for heart health and low trans-fat content.',
      aboutText2: 'GST rates shown are indicative. Actual prices may vary by region and retailer. PDS availability is subject to state government schemes.',
      fortified: 'Fortified',
      healthyChoice: 'Healthy Choice',
    },
    hi: {
      partnersTitle: 'स्वास्थ्यटेल साझेदार',
      partnersSubtitle: 'प्रमाणित साझेदार और उत्पाद',
      certifiedTab: 'स्वास्थ्य टेल प्रमाणित',
      productsTab: 'स्वस्थ तेल उत्पाद',
      title: 'स्वस्थ तेल उत्पाद',
      subtitle: 'सत्यापित स्वस्थ खाना पकाने के तेल',
      restaurantSearchPlaceholder: 'रेस्तरां, कैफे खोजें...',
      verified: 'सत्यापित',
      healthScore: 'स्वास्थ्य स्कोर',
      scanProduct: 'तेल उत्पाद स्कैन करें',
      enterManual: 'SKU दर्ज करें / मैनुअल',
      scanInfo: 'GST, स्वास्थ्य स्कोर और बेहतर विकल्प देखने के लिए किसी भी खाद्य तेल की बोतल को स्कैन करें।',
      howWorks: 'स्कैनिंग कैसे काम करती है',
      searchPlaceholder: 'तेल, ब्रांड या SKU खोजें',
      sort: 'क्रमबद्ध करें:',
      popular: 'लोकप्रिय',
      priceLow: 'कीमत: कम से ज्यादा',
      priceHigh: 'कीमत: ज्यादा से कम',
      compareProducts: 'उत्पादों की तुलना करें',
      addToCompare: 'तुलना में जोड़ें',
      pts: 'अंक यदि खरीदा',
      compare: 'तुलना करें',
      closeComparison: 'बंद करें',
      clearAll: 'सभी हटाएं',
      selectProducts: 'तुलना के लिए 2-3 उत्पाद चुनें',
      price: 'कीमत',
      gstRate: 'GST दर',
      transFat: 'ट्रांस वसा',
      benefits: 'लाभ',
      availability: 'उपलब्धता',
      rewardPoints: 'पुरस्कार अंक',
      aboutTitle: 'स्वस्थ तेल उत्पादों के बारे में',
      aboutText1: 'सूचीबद्ध सभी उत्पाद गुणवत्ता मानकों और स्वास्थ्य मापदंडों के लिए सत्यापित हैं।',
      aboutText2: 'दिखाए गए GST दरें सांकेतिक हैं। वास्तविक कीमतें क्षेत्र और खुदरा विक्रेता के अनुसार भिन्न हो सकती हैं।',
      fortified: 'फोर्टिफाइड',
      healthyChoice: 'स्वस्थ विकल्प',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const filteredPartners = certifiedPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
                          partner.category.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
                          partner.speciality.toLowerCase().includes(restaurantSearch.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => b.healthScore - a.healthScore);

  const filteredProducts = oilProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesGST = !selectedGST || product.gst === selectedGST;
    const matchesFortified = !showFortified || product.badges.includes('Fortified');
    return matchesSearch && matchesGST && matchesFortified;
  }).sort((a, b) => {
    if (selectedSort === 'popular') return b.points - a.points;
    if (selectedSort === 'price-low') return a.price - b.price;
    if (selectedSort === 'price-high') return b.price - a.price;
    return 0;
  });

  const toggleCompare = (id: number) => {
    if (compareProducts.includes(id)) {
      setCompareProducts(compareProducts.filter(pid => pid !== id));
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, id]);
    }
  };

  const handleCompare = () => {
    if (compareProducts.length >= 2) {
      setShowCompareModal(true);
    }
  };

  const clearComparison = () => {
    setCompareProducts([]);
    setShowCompareModal(false);
  };

  const getComparedProducts = () => {
    return oilProducts.filter(p => compareProducts.includes(p.id));
  };

  const handleScan = () => {
    console.log('Open camera for product scanning');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.iconContainer}>
              <Ionicons name="storefront" size={24} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>{t.partnersTitle}</Text>
              <Text style={styles.headerSubtitle}>{t.partnersSubtitle}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'certified' && styles.tabActive]}
              onPress={() => setSelectedTab('certified')}
            >
              <Text style={[styles.tabText, selectedTab === 'certified' && styles.tabTextActive]}>
                {t.certifiedTab}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'products' && styles.tabActive]}
              onPress={() => setSelectedTab('products')}
            >
              <Text style={[styles.tabText, selectedTab === 'products' && styles.tabTextActive]}>
                {t.productsTab}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {selectedTab === 'certified' ? (
            // Certified Partners Tab
            <>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#5B5B5B" style={styles.searchIcon} />
                <TextInput
                  placeholder={t.restaurantSearchPlaceholder}
                  value={restaurantSearch}
                  onChangeText={setRestaurantSearch}
                  style={styles.searchInput}
                  placeholderTextColor="#5B5B5B"
                />
              </View>

              {/* Certified Partners List */}
              <View style={styles.partnersList}>
                {filteredPartners.map((partner) => (
                  <TouchableOpacity key={partner.id} style={styles.partnerCard}>
                    <View style={styles.partnerCardHeader}>
                      <View style={styles.partnerIconContainer}>
                        <Ionicons name="restaurant" size={28} color="#1b4a5a" />
                      </View>
                      <View style={styles.partnerCardInfo}>
                        <View style={styles.partnerNameRow}>
                          <Text style={styles.partnerName}>{partner.name}</Text>
                          {partner.verified && (
                            <Ionicons name="checkmark-circle" size={20} color="#07A996" />
                          )}
                        </View>
                        <Text style={styles.partnerCategory}>{partner.category} • {partner.speciality}</Text>
                        <Text style={styles.partnerAddress}>
                          <Ionicons name="location" size={12} color="#5B5B5B" /> {partner.address}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.partnerCardFooter}>
                      <View style={styles.partnerStat}>
                        <Ionicons name="star" size={16} color="#fcaf56" />
                        <Text style={styles.partnerStatText}>{partner.rating}</Text>
                      </View>
                      <View style={styles.partnerHealthScore}>
                        <Text style={styles.healthScoreLabel}>{t.healthScore}: </Text>
                        <Text style={styles.healthScoreValue}>{partner.healthScore}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            // Swasth Oil Products Tab
            <>
          {/* Scan Product Section */}
          <View style={styles.scanSection}>
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Ionicons name="camera" size={20} color="#1b4a5a" />
              <Text style={styles.scanButtonText}>{t.scanProduct}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.manualButton}>
              <Text style={styles.manualButtonText}>{t.enterManual}</Text>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{t.scanInfo}</Text>
              <TouchableOpacity>
                <Text style={styles.infoLink}>{t.howWorks}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#5B5B5B" style={styles.searchIcon} />
            <TextInput
              placeholder={t.searchPlaceholder}
              value={productSearch}
              onChangeText={setProductSearch}
              style={styles.searchInput}
              placeholderTextColor="#5B5B5B"
            />
          </View>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterChips}>
              <TouchableOpacity
                style={[styles.chip, selectedGST === '5%' && styles.chipActive]}
                onPress={() => setSelectedGST(selectedGST === '5%' ? null : '5%')}
              >
                <Text style={[styles.chipText, selectedGST === '5%' && styles.chipTextActive]}>GST 5%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, selectedGST === '12%' && styles.chipActive]}
                onPress={() => setSelectedGST(selectedGST === '12%' ? null : '12%')}
              >
                <Text style={[styles.chipText, selectedGST === '12%' && styles.chipTextActive]}>GST 12%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, selectedGST === '18%' && styles.chipActive]}
                onPress={() => setSelectedGST(selectedGST === '18%' ? null : '18%')}
              >
                <Text style={[styles.chipText, selectedGST === '18%' && styles.chipTextActive]}>GST 18%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, showFortified && styles.chipActive]}
                onPress={() => setShowFortified(!showFortified)}
              >
                <Text style={[styles.chipText, showFortified && styles.chipTextActive]}>{t.fortified}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sort Dropdown */}
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>{t.sort}</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortText}>
                {selectedSort === 'popular' ? t.popular : selectedSort === 'price-low' ? t.priceLow : t.priceHigh}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#5B5B5B" />
            </TouchableOpacity>
          </View>

          {/* Compare Products Button */}
          {compareProducts.length > 0 && (
            <TouchableOpacity 
              style={[styles.compareButton, compareProducts.length < 2 && styles.compareButtonDisabled]}
              onPress={handleCompare}
              disabled={compareProducts.length < 2}
            >
              <Ionicons name="git-compare" size={20} color="#ffffff" />
              <Text style={styles.compareButtonText}>
                {compareProducts.length < 2 ? t.selectProducts : `${t.compare} (${compareProducts.length})`}
              </Text>
            </TouchableOpacity>
          )}

          {/* Product Listings */}
          <View style={styles.productList}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productRow}>
                  {/* Product Image Placeholder */}
                  <View style={styles.productImage}>
                    <View style={styles.productImageInner}>
                      <View style={styles.productImageCircle} />
                    </View>
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <View style={styles.productTitleRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
                      </View>
                      <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>₹{product.price}/{product.unit}</Text>
                        {product.featured && (
                          <Ionicons name="trophy" size={16} color="#fcaf56" />
                        )}
                      </View>
                    </View>

                    {/* Badges */}
                    <View style={styles.badges}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>GST {product.gst}</Text>
                      </View>
                      {product.badges.includes('Fortified') && (
                        <View style={[styles.badge, styles.badgeFortified]}>
                          <Text style={styles.badgeTextFortified}>{t.fortified}</Text>
                        </View>
                      )}
                      <View style={[styles.badge, styles.badgeTFA]}>
                        <Text style={styles.badgeTextTFA}>TFA {product.tfa}</Text>
                      </View>
                      {product.badges.includes('Healthy Choice') && (
                        <View style={[styles.badge, styles.badgeHealthy]}>
                          <Text style={styles.badgeTextHealthy}>{t.healthyChoice}</Text>
                        </View>
                      )}
                    </View>

                    {/* Availability */}
                    {product.availability && (
                      <View style={styles.availabilityRow}>
                        <Ionicons name="location" size={14} color="#3b82f6" />
                        <Text style={styles.availabilityText}>{product.availability}</Text>
                      </View>
                    )}

                    {/* Points */}
                    <View style={styles.pointsRow}>
                      <Ionicons name="star" size={14} color="#fcaf56" />
                      <Text style={styles.pointsText}>+{product.points} {t.pts}</Text>
                    </View>

                    {/* Compare Checkbox */}
                    <TouchableOpacity
                      style={styles.compareCheckbox}
                      onPress={() => toggleCompare(product.id)}
                      disabled={!compareProducts.includes(product.id) && compareProducts.length >= 3}
                    >
                      <View style={[styles.checkbox, compareProducts.includes(product.id) && styles.checkboxActive]}>
                        {compareProducts.includes(product.id) && (
                          <Ionicons name="checkmark" size={14} color="#ffffff" />
                        )}
                      </View>
                      <Text style={styles.compareText}>{t.addToCompare}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Info Section */}
          <View style={styles.aboutSection}>
            <View style={styles.aboutHeader}>
              <Ionicons name="information-circle" size={20} color="#1b4a5a" />
              <Text style={styles.aboutTitle}>{t.aboutTitle}</Text>
            </View>
            <Text style={styles.aboutText}>{t.aboutText1}</Text>
            <Text style={styles.aboutText}>{t.aboutText2}</Text>
          </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Comparison Modal */}
      <Modal
        visible={showCompareModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCompareModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <LinearGradient colors={['#1b4a5a', '#0f3a47']} style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <View style={styles.modalHeaderLeft}>
                <Ionicons name="git-compare" size={24} color="#ffffff" />
                <Text style={styles.modalTitle}>{t.compareProducts}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCompareModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Comparison Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Product Names Header */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Text style={styles.labelText}>Product</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <Text style={styles.productHeaderName} numberOfLines={2}>{product.name}</Text>
                    <TouchableOpacity 
                      onPress={() => toggleCompare(product.id)}
                      style={styles.removeProductBtn}
                    >
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Price Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="cash-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.price}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <Text style={styles.valueText}>₹{product.price}/{product.unit}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* GST Rate Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="document-text-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.gstRate}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{product.gst}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Trans Fat Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="water-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.transFat}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <View style={[styles.badge, styles.badgeTFA]}>
                      <Text style={styles.badgeTextTFA}>{product.tfa}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Benefits/Badges Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.benefits}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <View style={styles.badgesList}>
                      {product.badges.map((badge, idx) => (
                        <View 
                          key={idx} 
                          style={[
                            styles.comparisonBadge,
                            badge === 'Fortified' && styles.badgeFortified,
                            badge === 'Healthy Choice' && styles.badgeHealthy,
                          ]}
                        >
                          <Text 
                            style={[
                              styles.comparisonBadgeText,
                              badge === 'Fortified' && styles.badgeTextFortified,
                              badge === 'Healthy Choice' && styles.badgeTextHealthy,
                            ]}
                          >
                            {badge}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Availability Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="location-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.availability}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <Text style={styles.smallText} numberOfLines={3}>{product.availability}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Reward Points Comparison */}
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonLabel}>
                <Ionicons name="star-outline" size={18} color="#1b4a5a" />
                <Text style={styles.labelText}>{t.rewardPoints}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {getComparedProducts().map((product, index) => (
                  <View key={product.id} style={[styles.productColumn, index === 0 && styles.firstColumn]}>
                    <View style={styles.pointsBadge}>
                      <Ionicons name="star" size={16} color="#fcaf56" />
                      <Text style={styles.pointsValue}>+{product.points}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearComparison}>
              <Text style={styles.clearButtonText}>{t.clearAll}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={() => setShowCompareModal(false)}>
              <Text style={styles.doneButtonText}>{t.closeComparison}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    backgroundColor: '#1b4a5a',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1b4a5a',
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  scanSection: {
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1b4a5a',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b4a5a',
  },
  manualButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  manualButtonText: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  infoBox: {
    backgroundColor: '#ffeedd',
    borderWidth: 1,
    borderColor: '#fcaf56',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#040707',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoLink: {
    fontSize: 14,
    color: '#1b4a5a',
    textDecorationLine: 'underline',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#040707',
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: '#1b4a5a',
    borderColor: '#1b4a5a',
  },
  chipText: {
    fontSize: 14,
    color: '#040707',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sortText: {
    fontSize: 14,
    color: '#040707',
  },
  compareButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  compareButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  productList: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageInner: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageCircle: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#9ca3af',
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    gap: 8,
  },
  productHeader: {
    gap: 4,
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#16a34a',
  },
  badgeFortified: {
    backgroundColor: '#dbeafe',
  },
  badgeTextFortified: {
    fontSize: 12,
    color: '#2563eb',
  },
  badgeTFA: {
    backgroundColor: '#ccfbf1',
  },
  badgeTextTFA: {
    fontSize: 12,
    color: '#0d9488',
  },
  badgeHealthy: {
    backgroundColor: '#ffeedd',
  },
  badgeTextHealthy: {
    fontSize: 12,
    color: '#1b4a5a',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availabilityText: {
    flex: 1,
    fontSize: 12,
    color: '#3b82f6',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    color: '#fcaf56',
  },
  compareCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1b4a5a',
    borderColor: '#1b4a5a',
  },
  compareText: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  aboutSection: {
    backgroundColor: '#fafbfa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b4a5a',
  },
  aboutText: {
    fontSize: 14,
    color: '#5B5B5B',
    lineHeight: 20,
    marginBottom: 8,
  },
  partnersList: {
    gap: 16,
  },
  partnerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  partnerCardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  partnerIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#E7F2F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerCardInfo: {
    flex: 1,
    gap: 4,
  },
  partnerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    flex: 1,
  },
  partnerCategory: {
    fontSize: 13,
    color: '#5B5B5B',
  },
  partnerAddress: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  partnerCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7F2F1',
  },
  partnerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerStatText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#040707',
  },
  partnerHealthScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreLabel: {
    fontSize: 13,
    color: '#5B5B5B',
  },
  healthScoreValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#07A996',
  },
  // Comparison Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    minHeight: 80,
  },
  comparisonLabel: {
    width: 120,
    padding: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#040707',
  },
  productsScroll: {
    flex: 1,
  },
  productColumn: {
    width: 140,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  firstColumn: {
    borderLeftWidth: 0,
  },
  productHeaderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#040707',
    textAlign: 'center',
    marginBottom: 8,
  },
  removeProductBtn: {
    marginTop: 4,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b4a5a',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
    color: '#5B5B5B',
    textAlign: 'center',
    lineHeight: 18,
  },
  badgesList: {
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center',
  },
  comparisonBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  comparisonBadgeText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '500',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#1b4a5a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
