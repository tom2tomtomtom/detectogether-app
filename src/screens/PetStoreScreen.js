import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { storeItems } from '../utils/storeItems';
import StoreItemCard from '../components/StoreItemCard';

const TABS = ['accessories', 'colors', 'effects'];

export default function PetStoreScreen() {
  const pet = useStore((s) => s.pet);
  const [tab, setTab] = useState('accessories');
  const items = storeItems[tab] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Store</Text>
        <View style={styles.balance}><Text style={styles.coin}>🪙</Text><Text style={styles.balanceText}>{pet.careCredits || 0}</Text></View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t[0].toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {items.map((it) => (
          <StoreItemCard key={it.id} type={tab} item={it} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#2F3E46' },
  balance: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#E3F2FD', borderRadius: 999 },
  coin: { fontSize: 16 },
  balanceText: { marginLeft: 6, fontSize: 16, fontWeight: '700', color: '#1B5E20' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 6, gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#E5E7EB' },
  tabActive: { backgroundColor: '#7C3AED' },
  tabText: { color: '#374151', fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  grid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
});


