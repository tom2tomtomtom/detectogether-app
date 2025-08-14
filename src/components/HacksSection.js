import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const TABS = ['tips', 'marketplace', 'education'];

const moduleColor = {
  fluid: '#3B82F6',
  vitality: '#F59E0B',
  gut: '#10B981',
  mind: '#8B5CF6',
  dermal: '#EC4899',
};

const tipsData = {
  fluid: [
    { title: 'Try This', text: 'Drink water before coffee to rehydrate', icon: '💧' },
    { title: 'Consider This', text: 'Add lemon or mint for flavor', icon: '🍋' },
  ],
  vitality: [
    { title: 'Try This', text: 'Delay caffeine 90 minutes after waking', icon: '⏰' },
    { title: 'Consider This', text: 'Power nap for 20 minutes', icon: '😴' },
  ],
  gut: [
    { title: 'Try This', text: 'Chew slowly to aid digestion', icon: '🥗' },
    { title: 'Consider This', text: 'Include fiber with main meals', icon: '🌾' },
  ],
  mind: [
    { title: 'Try This', text: '20-20-20 rule for screens', icon: '👀' },
    { title: 'Consider This', text: 'Use blue light filter at night', icon: '🌙' },
  ],
  dermal: [
    { title: 'Try This', text: 'Apply SPF daily (even if cloudy)', icon: '🧴' },
    { title: 'Consider This', text: 'Monthly self skin-check', icon: '🗓️' },
  ],
};

const marketData = {
  fluid: [
    { title: 'Smart Water Bottle', desc: 'Tracks intake & reminds you', price: '$49.99' },
    { title: 'Electrolyte Mix', desc: 'Hydration boost packets', price: '$19.99' },
  ],
  vitality: [
    { title: 'Sleep Mask', desc: 'Block light, sleep deeper', price: '$14.99' },
    { title: 'Sunrise Alarm', desc: 'Gentle light wake up', price: '$39.99' },
  ],
  gut: [
    { title: 'Probiotic', desc: 'Daily gut support', price: '$24.99' },
    { title: 'Meal Prep Box', desc: 'Simple balanced meals', price: '$59.99' },
  ],
  mind: [
    { title: 'Meditation App', desc: 'Guided sessions', price: '$6.99/mo' },
    { title: 'Calm Tea', desc: 'Herbal wind-down blend', price: '$12.99' },
  ],
  dermal: [
    { title: 'SPF 50', desc: 'Light, non-greasy sunscreen', price: '$17.99' },
    { title: 'Gentle Cleanser', desc: 'Keep barrier healthy', price: '$11.99' },
  ],
};

const eduData = {
  fluid: [
    { title: 'Hydration & Focus', preview: 'Why water intake affects cognition and mood...', source: 'Health Journal' },
    { title: 'Electrolytes 101', preview: 'Understanding sodium, potassium and balance...', source: 'Wellness Daily' },
  ],
  vitality: [
    { title: 'Circadian Rhythm Basics', preview: 'Light, caffeine and energy timing explained...', source: 'Sleep Lab' },
    { title: 'Power Naps', preview: 'How short naps restore alertness without grogginess...', source: 'Neuro Notes' },
  ],
  gut: [
    { title: 'Fiber & Microbiome', preview: 'Soluble vs insoluble fiber and gut health...', source: 'Nutrition Weekly' },
    { title: 'Mind-Gut Axis', preview: 'Stress impacts digestion—what you can do...', source: 'Mind Body Review' },
  ],
  mind: [
    { title: 'Digital Eye Strain', preview: 'Reducing strain with micro-breaks and focus shifts...', source: 'Vision Today' },
    { title: 'Breathing for Calm', preview: 'Box breathing and parasympathetic activation...', source: 'Psych Guide' },
  ],
  dermal: [
    { title: 'UV & Skin', preview: 'Daily SPF and protection basics...', source: 'Derm Doc' },
    { title: 'Routine Building', preview: 'Cleanse, moisturize, protect—simple routine...', source: 'Skin School' },
  ],
};

export default function HacksSection({ moduleType = 'fluid' }) {
  const [tab, setTab] = useState('tips');
  const primary = moduleColor[moduleType] || '#7C3AED';

  const tips = tipsData[moduleType] || [];
  const products = marketData[moduleType] || [];
  const articles = eduData[moduleType] || [];

  return (
    <View style={[styles.container, { height: 400 }]}> 
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && { backgroundColor: primary }]}>
            <Text style={[styles.tabText, tab === t && { color: '#FFF' }]}>
              {t === 'tips' ? 'Tips & Tricks' : t === 'marketplace' ? 'Marketplace' : 'Education'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {tab === 'tips' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={210} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 16 }}>
          {tips.map((tip, i) => (
            <View key={i} style={[styles.tipCard, { borderColor: primary }]}> 
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      {tab === 'marketplace' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {products.map((p, i) => (
            <View key={i} style={styles.productCard}>
              <View style={styles.productImage}><Text style={{ fontSize: 28 }}>🛒</Text></View>
              <Text style={styles.productTitle}>{p.title}</Text>
              <Text style={styles.productDesc}>{p.desc}</Text>
              <Text style={styles.productPrice}>{p.price}</Text>
              <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Marketplace will be available soon.')} style={[styles.shopBtn, { backgroundColor: primary }]}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {tab === 'education' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {articles.map((a, i) => (
            <View key={i} style={styles.eduCard}>
              <Text style={styles.eduTitle}>{a.title}</Text>
              <Text numberOfLines={2} style={styles.eduPreview}>{a.preview}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.eduSource}>{a.source}</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Full article coming soon.')}> 
                  <Text style={[styles.readMore, { color: primary }]}>Read More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', marginTop: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 2 },
  tabs: { flexDirection: 'row', padding: 8, gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9' },
  tabText: { fontWeight: '700', color: '#374151' },
  tipCard: { width: 200, height: 120, borderRadius: 14, marginRight: 10, padding: 12, borderWidth: 2, backgroundColor: '#F8FAFC', justifyContent: 'space-between' },
  tipIcon: { fontSize: 22 },
  tipTitle: { fontSize: 12, fontWeight: '800', color: '#111827' },
  tipText: { fontSize: 13, color: '#374151' },
  productCard: { width: 150, height: 200, backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12, marginRight: 12, justifyContent: 'space-between' },
  productImage: { height: 70, backgroundColor: '#E5E7EB', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  productTitle: { fontWeight: '800', color: '#111827' },
  productDesc: { color: '#4B5563', fontSize: 12 },
  productPrice: { fontWeight: '700', color: '#111827' },
  shopBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 999 },
  eduCard: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12, marginBottom: 12 },
  eduTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 6 },
  eduPreview: { fontSize: 14, color: '#374151', marginBottom: 6 },
  eduSource: { fontSize: 12, color: '#6B7280' },
  readMore: { fontSize: 14, fontWeight: '800' },
});


