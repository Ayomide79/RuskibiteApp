// screens/HelpSupportScreen.js
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { haptic } from '../utils/haptics';

export default function HelpSupportScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState('menu');
  const [message, setMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I make a reservation?',
      answer: 'Go to the Reservation tab, select your preferred date, time, and number of guests. You can also specify the occasion and any special requests.'
    },
    {
      id: '2',
      question: 'Can I modify or cancel my order?',
      answer: 'Yes, you can modify or cancel your order within 5 minutes of placing it. After that, please contact the restaurant directly.'
    },
    {
      id: '3',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, Apple Pay, Google Pay, and cash on delivery for select locations.'
    },
    {
      id: '4',
      question: 'How do I use my loyalty points?',
      answer: 'Your points are automatically applied at checkout. You can also view your points balance in your Profile.'
    },
    {
      id: '5',
      question: 'Is there a delivery fee?',
      answer: 'Yes, there is a $5.00 delivery fee for all orders. This helps us ensure fast and reliable service.'
    },
  ];

  const supportTopics = [
    { id: 'order', label: 'Order Issue', icon: 'bicycle' },
    { id: 'reservation', label: 'Reservation', icon: 'calendar' },
    { id: 'payment', label: 'Payment', icon: 'card' },
    { id: 'account', label: 'Account', icon: 'person' },
    { id: 'app', label: 'App Problem', icon: 'phone-portrait' },
    { id: 'other', label: 'Other', icon: 'help-circle' },
  ];

  const contactOptions = [
    { 
      id: 'chat', 
      label: 'Live Chat', 
      desc: 'Average response: 2 min',
      icon: 'chatbubble-ellipses',
      color: '#4CAF50',
      action: () => {
        haptic.medium();
        setActiveSection('chat');
      }
    },
    { 
      id: 'email', 
      label: 'Email Support', 
      desc: 'support@ruskibites.com',
      icon: 'mail',
      color: '#2196F3',
      action: () => {
        haptic.medium();
        Linking.openURL('mailto:support@ruskibites.com');
      }
    },
    { 
      id: 'phone', 
      label: 'Call Us', 
      desc: '1-800-RUSKIBITES',
      icon: 'call',
      color: '#FF9800',
      action: () => {
        haptic.medium();
        Linking.openURL('tel:1-800-787-5428');
      }
    },
  ];

  const sendMessage = () => {
    if (!message.trim() || !selectedTopic) {
      Alert.alert('Error', 'Please select a topic and enter your message');
      return;
    }
    haptic.success();
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We will get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => {
        setActiveSection('menu');
        setMessage('');
        setSelectedTopic(null);
      }}]
    );
  };

  if (activeSection === 'faq') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveSection('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>FAQs</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {faqs.map((faq, index) => (
            <View 
              key={faq.id} 
              style={[
                styles.faqItem,
                { backgroundColor: colors.card },
                index !== 0 && { marginTop: 12 }
              ]}
            >
              <Text style={[styles.faqQuestion, { color: colors.text }]}>
                {faq.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                {faq.answer}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (activeSection === 'chat') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setActiveSection('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Live Chat</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.chatLabel, { color: colors.textSecondary }]}>
            Select a topic:
          </Text>
          <View style={styles.topicsGrid}>
            {supportTopics.map(topic => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicButton,
                  { backgroundColor: colors.surface },
                  selectedTopic === topic.id && { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                  setSelectedTopic(topic.id);
                  haptic.light();
                }}
              >
                <Ionicons 
                  name={topic.icon} 
                  size={24} 
                  color={selectedTopic === topic.id ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.topicLabel,
                  { color: selectedTopic === topic.id ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.chatLabel, { color: colors.textSecondary, marginTop: 20 }]}>
            Describe your issue:
          </Text>
          <TextInput
            style={[styles.chatInput, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Contact Us
          </Text>
          
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.contactItem,
                index !== contactOptions.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
              ]}
              onPress={option.action}
            >
              <View style={[styles.contactIcon, { backgroundColor: option.color + '15' }]}>
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.contactDesc, { color: colors.textSecondary }]}>
                  {option.desc}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.faqButton, { backgroundColor: colors.card }]}
          onPress={() => {
            haptic.light();
            setActiveSection('faq');
          }}
        >
          <View style={[styles.faqIcon, { backgroundColor: '#9C27B0' + '15' }]}>
            <Ionicons name="help-circle" size={28} color="#9C27B0" />
          </View>
          <View style={styles.faqInfo}>
            <Text style={[styles.faqButtonTitle, { color: colors.text }]}>
              Frequently Asked Questions
            </Text>
            <Text style={[styles.faqButtonDesc, { color: colors.textSecondary }]}>
              Find answers to common questions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.textSecondary }]}>
            App Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Build</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>2026.04.12</Text>
          </View>
        </View>
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  contactDesc: { fontSize: 13 },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  faqIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  faqInfo: { flex: 1 },
  faqButtonTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  faqButtonDesc: { fontSize: 13 },
  infoSection: {
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  faqItem: {
    padding: 20,
    borderRadius: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicButton: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  topicLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  chatInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    height: 120,
    marginTop: 8,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});