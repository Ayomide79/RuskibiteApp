// screens/AddressesScreen.js
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { haptic } from '../utils/haptics';

export default function AddressesScreen({ navigation }) {
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState([
    { 
      id: '1', 
      label: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      default: true 
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  const addAddress = () => {
    if (!newLabel || !newStreet || !newCity || !newState || !newZip) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }
    
    const newAddress = {
      id: Date.now().toString(),
      label: newLabel,
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      default: addresses.length === 0,
    };
    
    setAddresses([...addresses, newAddress]);
    setShowAddForm(false);
    setNewLabel('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    haptic.success();
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({ ...a, default: a.id === id })));
    haptic.light();
  };

  const deleteAddress = (id) => {
    Alert.alert(
      'Remove Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(a => a.id !== id));
            haptic.medium();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Addresses</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.map(address => (
          <View key={address.id} style={[styles.addressItem, { backgroundColor: colors.card }]}>
            <View style={styles.addressIcon}>
              <Ionicons 
                name={address.label.toLowerCase() === 'home' ? 'home' : 'business'} 
                size={28} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.addressInfo}>
              <View style={styles.labelRow}>
                <Text style={[styles.addressLabel, { color: colors.text }]}>
                  {address.label}
                </Text>
                {address.default && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                {address.street}
              </Text>
              <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                {address.city}, {address.state} {address.zip}
              </Text>
            </View>
            <View style={styles.addressActions}>
              {!address.default && (
                <TouchableOpacity 
                  onPress={() => setDefaultAddress(address.id)}
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                >
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={() => deleteAddress(address.id)}
                style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
              >
                <Ionicons name="trash-outline" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {showAddForm ? (
          <View style={[styles.addForm, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Address</Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Label (e.g., Home, Work)"
              value={newLabel}
              onChangeText={setNewLabel}
              placeholderTextColor={colors.textSecondary}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Street Address"
              value={newStreet}
              onChangeText={setNewStreet}
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flex2, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="City"
                value={newCity}
                onChangeText={setNewCity}
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={[styles.input, styles.flex1, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="State"
                value={newState}
                onChangeText={setNewState}
                maxLength={2}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="ZIP Code"
              value={newZip}
              onChangeText={setNewZip}
              keyboardType="number-pad"
              maxLength={5}
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={addAddress}
              >
                <Text style={styles.saveText}>Add Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addButton, { borderColor: colors.primary }]}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={[styles.addText, { color: colors.primary }]}>Add Address</Text>
          </TouchableOpacity>
        )}
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
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  addressIcon: { marginRight: 16 },
  addressInfo: { flex: 1 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: { fontSize: 16, fontWeight: '700', marginRight: 8 },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: { fontSize: 12, fontWeight: '700' },
  addressText: { fontSize: 14, marginBottom: 2 },
  addressActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addText: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
  addForm: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  formTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  flex2: { flex: 2 },
  flex1: { flex: 1 },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '700' },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});