import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../Card';
import { Button } from '../Button';

interface EditProfileScreenProps {
  navigation: any;
}

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    name: 'Raj Kumar',
    email: 'raj.kumar@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👨</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <Card>
            <View style={styles.field}>
              <View style={styles.fieldLabel}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.labelText}>Full Name</Text>
              </View>
              <TextInput style={styles.input} value={formData.name} onChangeText={(val) => setFormData({...formData, name: val})} />
            </View>
            <View style={styles.field}>
              <View style={styles.fieldLabel}>
                <Ionicons name="mail" size={16} color="#6b7280" />
                <Text style={styles.labelText}>Email</Text>
              </View>
              <TextInput style={styles.input} value={formData.email} onChangeText={(val) => setFormData({...formData, email: val})} keyboardType="email-address" />
            </View>
            <View style={styles.field}>
              <View style={styles.fieldLabel}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.labelText}>Phone</Text>
              </View>
              <TextInput style={styles.input} value={formData.phone} onChangeText={(val) => setFormData({...formData, phone: val})} keyboardType="phone-pad" />
            </View>
            <View style={[styles.field, styles.fieldLast]}>
              <View style={styles.fieldLabel}>
                <Ionicons name="location" size={16} color="#6b7280" />
                <Text style={styles.labelText}>City</Text>
              </View>
              <TextInput style={styles.input} value={formData.city} onChangeText={(val) => setFormData({...formData, city: val})} />
            </View>
          </Card>
          <View style={styles.actions}>
            <Button onPress={() => navigation.goBack()}>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>Save Changes</Text>
            </Button>
            <Button onPress={() => navigation.goBack()} variant="outline">
              <Text style={{color: '#1b4a5a', fontSize: 14, fontWeight: '500'}}>Cancel</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  header: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, gap: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  avatarContainer: { alignSelf: 'center', position: 'relative' },
  avatar: { width: 96, height: 96, backgroundColor: '#fff', borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 48 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, backgroundColor: '#16a34a', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  content: { padding: 16, gap: 24 },
  field: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 16 },
  fieldLast: { borderBottomWidth: 0, marginBottom: 0 },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  labelText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  input: { fontSize: 16, color: '#111827', paddingVertical: 8 },
  actions: { gap: 12 },
});
