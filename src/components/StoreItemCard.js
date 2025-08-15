import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';

export default function StoreItemCard({ type, item, width = 150, height = 180 }) {
  const pet = useStore((s) => s.pet);
  const purchaseItem = useStore((s) => s.purchaseItem);
  const equipItem = useStore((s) => s.equipItem);

  const unlocked = new Set(((pet.customization?.unlockedItems || {})[type] || []));
  const equippedKey = type === 'colors' ? 'color' : type === 'accessories' ? 'accessory' : type.slice(0, -1);
  const isOwned = unlocked.has(item.id) || (type === 'colors' && item.id === 'default');
  const isEquipped = (pet.customization?.equippedItems || {})[equippedKey] === item.id;
  const canAfford = (pet.careCredits || 0) >= (item.cost || 0);

  const onPress = () => {
    if (isOwned) {
      equipItem(type, item.id);
    } else if (canAfford) {
      purchaseItem(type, item.id, item.cost || 0);
    }
  };

  const cta = isOwned ? (isEquipped ? 'Unequip' : 'Equip') : canAfford ? 'Buy' : `Need ${item.cost - (pet.careCredits || 0)}`;
  const ctaStyle = isOwned ? (isEquipped ? styles.ctaOwned : styles.ctaEquipped) : canAfford ? styles.ctaBuy : styles.ctaNeed;

  return (
    <View style={[styles.card, { width, height }]}> 
      <View style={styles.preview}> 
        <Text style={{ fontSize: 40 }}>{item.icon || '🐾'}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>🪙 {item.cost}</Text>
      <TouchableOpacity onPress={onPress} style={[styles.cta, ctaStyle]} activeOpacity={0.9}>
        <Text style={styles.ctaText}>{cta}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  preview: { height: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7FA', borderRadius: 10 },
  name: { marginTop: 8, fontWeight: '700', color: '#333' },
  price: { color: '#555', fontSize: 12 },
  cta: { marginTop: 6, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  ctaText: { color: '#FFF', fontWeight: '700' },
  ctaBuy: { backgroundColor: '#2E7D32' },
  ctaNeed: { backgroundColor: '#9CA3AF' },
  ctaOwned: { backgroundColor: '#2563EB' },
  ctaEquipped: { backgroundColor: '#7C3AED' },
});


