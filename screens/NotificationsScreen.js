// screens/NotificationsScreen.js
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { haptic } from '../utils/haptics';

export default function NotificationsScreen({ navigation }) {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: true,
    reservations: true,
    newMenuItems: false,
    appUpdates: true,
    emailNotifications: false,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    haptic.light();
  };

  const notificationOptions = [
    { key: 'orderUpdates', label: 'Order Updates', icon: 'bicycle', desc: 'Status changes for your deliveries' },
    { key: 'reservations', label: 'Reservations', icon: 'calendar', desc: 'Reminders and confirmations' },
    { key: 'promotions', label: 'Promotions & Offers', icon: 'gift', desc: 'Special deals and discounts' },
    { key: 'newMenuItems', label: 'New Menu Items', icon: 'restaurant', desc: 'When we add dishes you might like' },
    { key: 'appUpdates', label: 'App Updates', icon: 'download', desc: 'New features and improvements' },
    { key: 'emailNotifications', label: 'Email Notifications', icon: 'mail', desc: 'Receive updates via email' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Push Notifications
          </Text>
          
          {notificationOptions.map((option, index) => (
            <View 
              key={option.key} 
              style={[
                styles.settingItem,
                index !== notificationOptions.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
              ]}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={option.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                  {option.desc}
                </Text>
              </View>
              <Switch
                value={settings[option.key]}
                onValueChange={() => toggleSetting(option.key)}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={settings[option.key] ? colors.primary : colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.testButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            haptic.success();
            // In real app, this would trigger a test notification
          }}
        >
          <Ionicons name="notifications" size={20} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  content: { flex: 1, padding: 20 },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: { marginRight: 16 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  settingDesc: { fontSize: 13 },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});