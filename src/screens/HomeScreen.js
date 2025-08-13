import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Modal 
} from 'react-native';
import Vista from '../components/Vista';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const user = useStore((state) => state.user);
  const pet = useStore((state) => state.pet);
  const healthLogs = useStore((state) => state.healthLogs);
  const achievements = useStore((s) => s.achievements);
  const setAchievements = useStore((set) => (payload) => set((state) => ({ achievements: { ...state.achievements, ...payload } })));

  const routes = {
    hydration: { route: 'FluidFlow', title: 'Hydration', icon: 'water', color: '#3B82F6' },
    energy: { route: 'Vitality', title: 'Energy', icon: 'flash', color: '#F59E0B' },
    gut: { route: 'Gut', title: 'Gut', icon: 'nutrition', color: '#10B981' },
    headVision: { route: 'MindRadar', title: "Mind's Radar", icon: 'eye', color: '#8B5CF6' },
    skin: { route: 'DermalMap', title: 'Skin', icon: 'body', color: '#EC4899' },
  };

  const getLastStatus = (key) => {
    const logs = healthLogs[key] || [];
    // Prefer status-like entries, else fall back to most recent meaningful log
    const statusLog = [...logs].reverse().find((l) => l.type === 'status');
    if (statusLog) return statusLog.label || '—';
    if (key === 'hydration') {
      const colorLog = [...logs].reverse().find((l) => l.type === 'color');
      if (colorLog) return colorLog.label;
      const intakeLog = [...logs].reverse().find((l) => l.type === 'intake');
      if (intakeLog) return `${intakeLog.amount}oz`;
    }
    if (key === 'energy') {
      const brewLog = [...logs].reverse().find((l) => l.type === 'brew');
      if (brewLog) return brewLog.caffeinated ? 'Caffeinated' : 'Caffeine free';
    }
    if (key === 'gut') {
      const mealLog = [...logs].reverse().find((l) => l.type === 'meal');
      if (mealLog) return mealLog.timing;
    }
    if (key === 'headVision') {
      const checkinLog = [...logs].reverse().find((l) => l.type === 'checkin');
      if (checkinLog) return checkinLog.time;
    }
    if (key === 'skin') {
      const obsLog = [...logs].reverse().find((l) => l.type === 'observation');
      if (obsLog) return obsLog.condition || obsLog.area || obsLog.time;
    }
    return '—';
  };

  const hasLogToday = (key) => {
    const logs = healthLogs[key] || [];
    const today = new Date().toDateString();
    return logs.some((l) => new Date(l.timestamp).toDateString() === today);
  };

  const getRecentActivity = () => {
    const items = [];
    Object.keys(routes).forEach((key) => {
      (healthLogs[key] || []).forEach((log) => items.push({ ...log, key }));
    });
    return items
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  const getAreaCountLoggedToday = () => {
    return Object.keys(routes).reduce((acc, key) => acc + (hasLogToday(key) ? 1 : 0), 0);
  };

  const getMotivation = () => {
    const count = getAreaCountLoggedToday();
    if (count >= 5) return 'Amazing streak! All areas logged today.';
    if (count >= 3) return 'Great momentum. A couple more to complete the set!';
    if (count >= 1) return 'Nice start. Keep building your day.';
    return "Let's begin with one quick check-in.";
  };

  const attentionAreas = Object.keys(routes).filter((key) => !hasLogToday(key));

  const recent = getRecentActivity();

  const renderRecentItemText = (log) => {
    switch (log.key) {
      case 'hydration':
        if (log.type === 'intake') return `Hydration • +${log.amount}oz`;
        if (log.type === 'color') return `Hydration • ${log.label}`;
        return 'Hydration update';
      case 'energy':
        if (log.type === 'status') return `Energy • ${log.label}`;
        if (log.type === 'brew') return `Brew • ${log.caffeinated ? 'Caffeinated' : 'Caffeine free'}${log.feeling ? ' • ' + log.feeling : ''}`;
        return 'Energy update';
      case 'gut':
        if (log.type === 'status') return `Gut • ${log.label}`;
        if (log.type === 'meal') return `Meal • ${log.timing}${log.feeling ? ' • ' + log.feeling : ''}`;
        return 'Gut update';
      case 'headVision':
        if (log.type === 'status') return `Mind • ${log.label}`;
        if (log.type === 'checkin') return `Mind • ${log.time}${log.feeling ? ' • ' + log.feeling : ''}`;
        return 'Mind update';
      case 'skin':
        if (log.type === 'status') return `Skin • ${log.label}`;
        if (log.type === 'observation') return `Skin • ${log.time || ''}${log.area ? ' • ' + log.area : ''}${log.condition ? ' • ' + log.condition : ''}`;
        return 'Skin update';
      default:
        return 'Activity';
    }
  };

  const overallHealthScore = Math.round((pet.health + pet.energy + pet.happiness) / 3);

  const toastId = achievements?.toasts?.[0];
  const unlockedMap = Object.fromEntries((achievements?.unlockedIds || []).map((id) => [id, true]));
  const unlockedTitle = toastId ? (require('../utils/achievements').ALL_ACHIEVEMENTS.find((a) => a.id === toastId)?.title || 'Achievement') : '';

  const clearToast = () => {
    setAchievements({ toasts: (achievements.toasts || []).slice(1) });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Vista tabName="home" healthScore={overallHealthScore} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome + Pet State */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back{user.name ? `, ${user.name}` : ''}!
          </Text>
          <Text style={styles.petStatus}>
            {getMotivation()}
          </Text>
        </View>

        {/* Today's Health Snapshot */}
        <View style={styles.statsContainer}>
          {[
            { key: 'hydration', label: 'Hydration' },
            { key: 'energy', label: 'Energy' },
            { key: 'gut', label: 'Gut' },
            { key: 'headVision', label: 'Mind' },
            { key: 'skin', label: 'Skin' },
          ].map((item) => (
            <View key={item.key} style={styles.statItem}>
              <Icon name={routes[item.key].icon} size={24} color={routes[item.key].color} />
              <Text style={styles.statValue}>{getLastStatus(item.key)}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.moduleSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {Object.keys(routes).map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.quickActionButton, { borderColor: routes[key].color, backgroundColor: routes[key].color + '15' }]}
                onPress={() => navigation.navigate(routes[key].route)}
              >
                <Icon name={routes[key].icon} size={20} color={routes[key].color} />
                <Text style={[styles.quickActionText, { color: routes[key].color }]}>
                  {routes[key].title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Daily Goal</Text>
          <Text style={styles.descriptionText}>
            Log all 5 areas today! Progress: {getAreaCountLoggedToday()}/5
          </Text>
        </View>

        {/* Recent Activity */}
        <View style={styles.moduleSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recent.length === 0 ? (
            <Text style={styles.sectionSubtitle}>No activity yet. Start with a quick action above.</Text>
          ) : (
            recent.map((log, idx) => (
              <View key={idx} style={styles.activityItem}>
                <Icon name={routes[log.key].icon} size={20} color={routes[log.key].color} />
                <Text style={styles.activityText}>{renderRecentItemText(log)}</Text>
                <Text style={styles.activityTime}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            ))
          )}
        </View>

        {/* Needs Attention */}
        <View style={styles.moduleSection}>
          <Text style={styles.sectionTitle}>Needs Attention</Text>
          {attentionAreas.length === 0 ? (
            <Text style={styles.sectionSubtitle}>All set for today. Great job!</Text>
          ) : (
            <View style={styles.attentionWrap}>
              {attentionAreas.map((key) => (
                <TouchableOpacity key={key} style={styles.attentionTag} onPress={() => navigation.navigate(routes[key].route)}>
                  <Icon name={routes[key].icon} size={16} color={routes[key].color} />
                  <Text style={[styles.attentionTagText, { color: routes[key].color }]}>{routes[key].title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Achievement Modal */}
      <Modal visible={!!toastId} transparent animationType="fade" onRequestClose={clearToast}>
        <View style={styles.toastOverlay}>
          <View style={styles.toastCard}>
            <Text style={styles.toastEmoji}>🎉✨🎊</Text>
            <Text style={styles.toastTitle}>Achievement Unlocked!</Text>
            <Text style={styles.toastSubtitle}>{unlockedTitle}</Text>
            <TouchableOpacity style={[styles.quickActionButton, { borderColor: '#F59E0B', backgroundColor: '#F59E0B15', paddingHorizontal: 20 }]} onPress={clearToast}>
              <Icon name="trophy" size={20} color="#F59E0B" />
              <Text style={[styles.quickActionText, { color: '#F59E0B' }]}>Nice!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  petStatus: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  descriptionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#3730A3',
    lineHeight: 20,
  },  modulesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  moduleSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  activityText: {
    flex: 1,
    marginLeft: 10,
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  attentionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  attentionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  attentionTagText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  toastOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  toastEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  toastSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
});

export default HomeScreen;