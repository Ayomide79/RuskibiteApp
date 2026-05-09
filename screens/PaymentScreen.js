import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { haptic } from '../utils/haptics';
import { CommonActions } from '@react-navigation/native';

export default function PaymentScreen({ navigation }) {
  const { colors } = useTheme();
  const { cart, getTotal, placeOrder } = useCart();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Credit Card', icon: 'card-outline' },
    { id: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
    { id: 'google', label: 'Google Pay', icon: 'logo-google' },
  ];


const handlePayment = async () => {
  if (selectedMethod === 'card' && (!cardNumber || !expiry || !cvv)) {
    Alert.alert('Error', 'Please fill in all card details');
    return;
  }

  setProcessing(true);
  haptic.medium();
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const order = await placeOrder(selectedMethod);
  setProcessing(false);
  haptic.success();
  
  Alert.alert(
    'Payment Successful!',
    `Your order #${order.id.slice(-6)} has been placed.`,
    [
      { 
        text: 'View Orders', 
        onPress: () => {
          // Reset to MainApp and navigate to Profile
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { 
                  name: 'MainApp',
                  state: {
                    routes: [{ name: 'Profile' }],
                    index: 0
                  }
                }
              ],
            })
          );
        }
      },
      { 
        text: 'Continue', 
        onPress: () => {
          // Reset to MainApp and navigate to Home
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { 
                  name: 'MainApp',
                  state: {
                    routes: [{ name: 'Home' }],
                    index: 0
                  }
                }
              ],
            })
          );
        }
      }
    ]
  );
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={[styles.summaryItemText, { color: colors.textSecondary }]}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={[styles.summaryItemPrice, { color: colors.text }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTotal, { color: colors.text }]}>Total</Text>
            <Text style={[styles.summaryTotalPrice, { color: colors.primary }]}>
              ${(getTotal() + 5).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              { backgroundColor: colors.card },
              selectedMethod === method.id && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => {
              setSelectedMethod(method.id);
              haptic.light();
            }}
          >
            <Ionicons name={method.icon} size={28} color={colors.primary} />
            <Text style={[styles.methodLabel, { color: colors.text }]}>{method.label}</Text>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {selectedMethod === 'card' && (
          <View style={[styles.cardForm, { backgroundColor: colors.card }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={19}
            />
            
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expiry</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary}
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CVV</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="123"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: colors.primary },
            processing && { opacity: 0.7 }
          ]}
          onPress={handlePayment}
          disabled={processing}
        >
          <Text style={styles.payButtonText}>
            {processing ? 'Processing...' : `Pay $${(getTotal() + 5).toFixed(2)}`}
          </Text>
          {!processing && <Ionicons name="lock-closed" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemText: {
    fontSize: 14,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryTotalPrice: {
    fontSize: 24,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  methodLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  cardForm: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 100,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    paddingBottom: 40,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});