// screens/tabs/ReservationScreen.js (Updated)
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { useReservations } from '../../context/ReservationContext';
import { haptic } from '../../utils/haptics';

const RESERVATION_IMAGE = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80';

export default function ReservationScreen({ navigation }) {
  const { colors } = useTheme();
  const { addReservation } = useReservations();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState('19:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('dinner');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const occasions = [
    { id: 'dinner', label: 'Dinner', icon: 'moon' },
    { id: 'lunch', label: 'Lunch', icon: 'sunny' },
    { id: 'brunch', label: 'Brunch', icon: 'cafe' },
    { id: 'special', label: 'Special', icon: 'sparkles' },
  ];

  const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter your name and phone number');
      return;
    }

    setSubmitting(true);
    haptic.medium();

    const reservationData = {
      occasion,
      date: date.toISOString(),
      time,
      guests,
      name: name.trim(),
      phone: phone.trim(),
      specialRequests: specialRequests.trim(),
    };

    try {
      const newReservation = await addReservation(reservationData);
      
      haptic.success();
      Alert.alert(
        'Reservation Confirmed!',
        `Your table for ${guests} on ${date.toLocaleDateString()} at ${time} has been reserved. Reservation #${newReservation.id.slice(-6)}`,
        [
          { 
            text: 'View Reservations', 
            onPress: () => {
              // Reset form
              setName('');
              setPhone('');
              setSpecialRequests('');
              setGuests(2);
              setTime('19:00');
              setOccasion('dinner');
              setDate(new Date());
              // Navigate to profile reservations
              navigation.navigate('Profile');
            }
          },
          { 
            text: 'Make Another', 
            onPress: () => {
              // Reset form
              setName('');
              setPhone('');
              setSpecialRequests('');
              setGuests(2);
              setTime('19:00');
              setOccasion('dinner');
              setDate(new Date());
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: RESERVATION_IMAGE }} style={styles.headerImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageTitle}>Book a Table</Text>
          <Text style={styles.imageSubtitle}>Reserve your perfect dining experience</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Occasion</Text>
        <View style={styles.occasionGrid}>
          {occasions.map((occ) => (
            <TouchableOpacity
              key={occ.id}
              style={[
                styles.occasionCard,
                { backgroundColor: colors.surface },
                occasion === occ.id && { backgroundColor: colors.primary }
              ]}
              onPress={() => {
                setOccasion(occ.id);
                haptic.light();
              }}
            >
              <Ionicons 
                name={occ.icon} 
                size={24} 
                color={occasion === occ.id ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text style={[
                styles.occasionText,
                { color: occasion === occ.id ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {occ.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
        <TouchableOpacity 
          style={[styles.dateButton, { backgroundColor: colors.surface }]}
          onPress={() => {
            setShowDatePicker(true);
            haptic.light();
          }}
        >
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time</Text>
        <View style={styles.timeGrid}>
          {times.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeButton,
                { backgroundColor: colors.surface },
                time === t && { backgroundColor: colors.primary }
              ]}
              onPress={() => {
                setTime(t);
                haptic.light();
              }}
            >
              <Text style={[
                styles.timeText,
                { color: time === t ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Number of Guests</Text>
        <View style={styles.guestsContainer}>
          <TouchableOpacity 
            style={[styles.guestButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => {
              setGuests(Math.max(1, guests - 1));
              haptic.light();
            }}
          >
            <Ionicons name="remove" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.guestCount}>
            <Text style={[styles.guestNumber, { color: colors.primary }]}>{guests}</Text>
            <Text style={[styles.guestLabel, { color: colors.textSecondary }]}>guests</Text>
          </View>
          <TouchableOpacity 
            style={[styles.guestButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => {
              setGuests(Math.min(20, guests + 1));
              haptic.light();
            }}
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Details</Text>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Special Requests (Optional)</Text>
        <View style={[styles.textAreaContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            placeholder="Any dietary restrictions or special occasions?"
            multiline
            numberOfLines={4}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.confirmButton, 
          { backgroundColor: colors.primary },
          submitting && { opacity: 0.7 }
        ]}
        onPress={handleConfirm}
        disabled={submitting}
      >
        <Text style={styles.confirmText}>
          {submitting ? 'Confirming...' : 'Confirm Reservation'}
        </Text>
        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  imageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  imageSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  occasionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  occasionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  occasionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  guestButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  guestCount: {
    alignItems: 'center',
    minWidth: 80,
  },
  guestNumber: {
    fontSize: 36,
    fontWeight: '800',
  },
  guestLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  textAreaContainer: {
    borderRadius: 12,
    padding: 16,
  },
  textArea: {
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  confirmButton: {
    flexDirection: 'row',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});