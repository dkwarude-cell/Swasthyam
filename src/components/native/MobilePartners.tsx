import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface MobilePartnersProps {
  language: string;
}

interface Partner {
  id: number;
  name: string;
  rating: number;
  verified: boolean;
  products: number;
  logo: string;
}

interface OilProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  healthScore: number;
  verified: boolean;
}

const partners: Partner[] = [
  { id: 1, name: 'Fortune Oils', rating: 4.5, verified: true, products: 12, logo: '🛢️' },
  { id: 2, name: 'Saffola', rating: 4.7, verified: true, products: 8, logo: '🌻' },
  { id: 3, name: 'Dhara', rating: 4.3, verified: true, products: 10, logo: '🌾' },
  { id: 4, name: 'Sundrop', rating: 4.6, verified: true, products: 7, logo: '☀️' },
  { id: 5, name: 'Gemini', rating: 4.2, verified: true, products: 9, logo: '♊' },
  { id: 6, name: 'Postman', rating: 4.4, verified: true, products: 6, logo: '📦' },
];

const oilProducts: OilProduct[] = [
  { id: 1, name: 'Sunflower Oil', brand: 'Fortune', price: 180, rating: 4.5, healthScore: 85, verified: true },
  { id: 2, name: 'Rice Bran Oil', brand: 'Saffola', price: 220, rating: 4.7, healthScore: 92, verified: true },
  { id: 3, name: 'Groundnut Oil', brand: 'Dhara', price: 150, rating: 4.3, healthScore: 78, verified: true },
  { id: 4, name: 'Olive Oil', brand: 'Figaro', price: 450, rating: 4.8, healthScore: 95, verified: true },
  { id: 5, name: 'Mustard Oil', brand: 'Postman', price: 130, rating: 4.2, healthScore: 82, verified: true },
  { id: 6, name: 'Coconut Oil', brand: 'Parachute', price: 190, rating: 4.6, healthScore: 88, verified: true },
];

export function MobilePartners({ language }: MobilePartnersProps) {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState('partners');

  const text = {
    en: {
      title: 'Partners',
      subtitle: 'Certified oil brands',
      partners: 'Partners',
      products: 'Products',
      verified: 'Verified',
      productsAvailable: 'products',
      rating: 'Rating',
      healthScore: 'Health Score',
      viewDetails: 'View Details',
      compare: 'Compare',
    },
    hi: {
      title: 'साझेदार',
      subtitle: 'प्रमाणित तेल ब्रांड',
      partners: 'साझेदार',
      products: 'उत्पाद',
      verified: 'सत्यापित',
      productsAvailable: 'उत्पाद',
      rating: 'रेटिंग',
      healthScore: 'स्वास्थ्य स्कोर',
      viewDetails: 'विवरण देखें',
      compare: 'तुलना करें',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const renderPartnerCard = ({ item }: { item: Partner }) => (
    <TouchableOpacity 
      style={styles.partnerCard}
      onPress={() => navigation.navigate('PartnerDetail', { partnerId: item.id })}
    >
      <View style={styles.partnerHeader}>
        <View style={styles.partnerLogo}>
          <Text style={styles.partnerLogoText}>{item.logo}</Text>
        </View>
        <View style={styles.partnerInfo}>
          <View style={styles.partnerTitleRow}>
            <Text style={styles.partnerName}>{item.name}</Text>
            {item.verified && (
              <Ionicons name="checkmark-circle" size={20} color="#07A996" />
            )}
          </View>
          <View style={styles.partnerStats}>
            <View style={styles.stat}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <Text style={styles.statDivider}>•</Text>
            <Text style={styles.statText}>
              {item.products} {t.productsAvailable}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }: { item: OilProduct }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productIcon}>
          <Ionicons name="water" size={32} color="#1b4a5a" />
        </View>
        {item.verified && (
          <Badge variant="success" style={styles.verifiedBadge}>
            <Text style={{color: '#16a34a', fontSize: 10}}>{t.verified}</Text>
          </Badge>
        )}
      </View>
      
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      
      <View style={styles.productStats}>
        <View style={styles.productStat}>
          <Text style={styles.productStatLabel}>{t.rating}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.productStatValue}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.productStat}>
          <Text style={styles.productStatLabel}>{t.healthScore}</Text>
          <Text style={styles.productStatValue}>{item.healthScore}</Text>
        </View>
      </View>

      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>₹{item.price}/L</Text>
        <TouchableOpacity style={styles.productButton}>
          <Text style={styles.productButtonText}>{t.viewDetails}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'partners' && styles.tabActive]}
            onPress={() => setSelectedTab('partners')}
          >
            <Text style={[styles.tabText, selectedTab === 'partners' && styles.tabTextActive]}>
              {t.partners}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'products' && styles.tabActive]}
            onPress={() => setSelectedTab('products')}
          >
            <Text style={[styles.tabText, selectedTab === 'products' && styles.tabTextActive]}>
              {t.products}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {selectedTab === 'partners' ? (
        <FlatList
          data={partners}
          renderItem={renderPartnerCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.partnersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={oilProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          columnWrapperStyle={styles.productsRow}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Compare Button (floating) */}
      {selectedTab === 'products' && (
        <TouchableOpacity 
          style={styles.compareButton}
          onPress={() => navigation.navigate('ProductComparison')}
        >
          <Ionicons name="git-compare" size={24} color="#ffffff" />
          <Text style={styles.compareButtonText}>{t.compare}</Text>
        </TouchableOpacity>
      )}
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
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: -1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabActive: {
    backgroundColor: '#fafbfa',
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#1b4a5a',
    fontWeight: '600',
  },
  partnersList: {
    padding: 16,
  },
  partnerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  partnerHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  partnerLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#E7F2F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerLogoText: {
    fontSize: 32,
  },
  partnerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  partnerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
  },
  partnerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  statDivider: {
    color: '#D3D3D3',
  },
  productsList: {
    padding: 16,
  },
  productsRow: {
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#E7F2F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: '#5B5B5B',
    marginBottom: 12,
  },
  productStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productStat: {
    flex: 1,
  },
  productStatLabel: {
    fontSize: 11,
    color: '#5B5B5B',
    marginBottom: 4,
  },
  productStatValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b4a5a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7F2F1',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b4a5a',
  },
  productButton: {
    backgroundColor: '#07A996',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  productButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  compareButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1b4a5a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  compareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
