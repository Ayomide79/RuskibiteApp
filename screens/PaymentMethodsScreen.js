// screens/PaymentMethodsScreen.js
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

export default function PaymentMethodsScreen({ navigation }) {
  const { colors } = useTheme();
  const [cards, setCards] = useState([
    { id: '1', type: 'visa', last4: '4242', expiry: '12/25', default: true },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/[^0-9]/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const addCard = () => {
    if (!newCardNumber || !newExpiry || !newCvv) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }
    
    const last4 = newCardNumber.slice(-4);
    const newCard = {
      id: Date.now().toString(),
      type: 'visa',
      last4,
      expiry: newExpiry,
      default: cards.length === 0,
    };
    
    setCards([...cards, newCard]);
    setShowAddForm(false);
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvv('');
    haptic.success();
  };

  const setDefaultCard = (id) => {
    setCards(cards.map(c => ({ ...c, default: c.id === id })));
    haptic.light();
  };

  const deleteCard = (id) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setCards(cards.filter(c => c.id !== id));
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cards.map(card => (
          <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.card }]}>
            <View style={styles.cardIcon}>
              <Ionicons name="card" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardType, { color: colors.text }]}>
                {card.type.toUpperCase()} •••• {card.last4}
              </Text>
              <Text style={[styles.cardExpiry, { color: colors.textSecondary }]}>
                Expires {card.expiry}
              </Text>
              {card.default && (
                <View style={[styles.defaultBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                </View>
              )}
            </View>
            <View style={styles.cardActions}>
              {!card.default && (
                <TouchableOpacity 
                  onPress={() => setDefaultCard(card.id)}
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                >
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={() => deleteCard(card.id)}
                style={[styles.actionButton, { backgroundColor: '#FFEBEE' }]}
              >
                <Ionicons name="trash-outline" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {showAddForm ? (
          <View style={[styles.addForm, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Card</Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Card Number"
              value={newCardNumber}
              onChangeText={(text) => setNewCardNumber(formatCardNumber(text))}
              keyboardType="number-pad"
              maxLength={19}
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="MM/YY"
                value={newExpiry}
                onChangeText={(text) => setNewExpiry(formatExpiry(text))}
                maxLength={5}
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={[styles.input, styles.halfInput, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="CVV"
                value={newCvv}
                onChangeText={setNewCvv}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={addCard}
              >
                <Text style={styles.saveText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addButton, { borderColor: colors.primary }]}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={[styles.addText, { color: colors.primary }]}>Add Payment Method</Text>
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
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardIcon: { marginRight: 16 },
  cardInfo: { flex: 1 },
  cardType: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardExpiry: { fontSize: 14, marginBottom: 8 },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: { fontSize: 12, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 8 },
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
  halfInput: { flex: 1 },
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