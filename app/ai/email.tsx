import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/shared/constants/Colors'
import { emails } from '@/shared/utils/dummy';
import { EmailCard } from '@/shared/components/emailComponent';
import { PriorityCard } from '@/shared/components/priorityCard';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;







// Email List Component with sample data
export default function EmailScreen() {
  const [emailList, setEmails] = useState(emails);

  useEffect(()=>{
    router.replace('/general/GoogleSignInScreen')
  },[])

  const priorityCounts = {
    Urgent: emails.filter(e => e.priority === 'Urgent').length,
    Normal: emails.filter(e => e.priority === 'Normal').length,
    Low: emails.filter(e => e.priority === 'Low').length
  };

  const handleEmailPress = (id: string | number) => {
    console.log('Email pressed:', id);
    // Mark as read
    setEmails((prev: typeof emails) => prev.map((email: typeof emails[0]) => 
      email.id === id ? { ...email, isRead: true } : email
    ));
    // Navigate to email detail screen
  };

  const handleEmailLongPress = (id: string | number) => {
    console.log('Email long pressed:', id);
    // Show options menu (delete, archive, etc.)
  };

  const priorityData: { id: number; title: 'Urgent' | 'Normal' | 'Low' }[] = [
    { id: 1, title: 'Urgent' }, 
    { id: 2, title: 'Normal' }, 
    { id: 3, title: 'Low' }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Priority Cards */}
      <View style={styles.cardRow}>
        {priorityData.map((item) => (
          <PriorityCard key={item.id} title={item.title} count={priorityCounts[item.title]} />
        ))}
      </View>
      
      {/* AI Analysis Status */}
      <View style={styles.analysisContainer}>
        <ActivityIndicator size={34} color={Colors.dark.primary} style={{ marginVertical: 8 }} />
        <View style={styles.analysisTextContainer}>
          <Text style={styles.analysisTitle}>Reading your Inbox</Text>
          <Text style={styles.analysisSubtitle}>
            AI is analyzing {emails.length} emails
          </Text>
          <Text style={styles.analysisSubtitle}>
            Sorted by priority: Urgent ({priorityCounts.Urgent}), 
            Normal ({priorityCounts.Normal}), 
            Low ({priorityCounts.Low})
          </Text>
        </View>
      </View>

      {/* Email List */}
      <View style={styles.emailList}>
        <Text style={styles.sectionTitle}>Your Emails</Text>
        {emailList.map((email) => (
          <EmailCard
            key={email.id}
            id={String(email.id)}
            sender={email.sender}
            senderEmail={email.senderEmail}
            subject={email.subject}
            preview={email.preview}
            priority={email.priority as 'Urgent' | 'Normal' | 'Low'}
            timestamp={email.timestamp}
            isRead={email.isRead}
            hasAttachment={email.hasAttachment}
            onPress={handleEmailPress}
            onLongPress={handleEmailLongPress}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background
  },
  cardRow: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20
  },
  analysisContainer: {
    borderWidth: 0.5,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 20
  },
  analysisTextContainer: {
    alignItems: 'center',
    paddingBottom: 16
  },
  analysisTitle: {
    color: Colors.dark.text,
    fontFamily: 'Inter-Bold',
    marginVertical: 20,
    fontSize: 16
  },
  analysisSubtitle: {
    color: Colors.dark.text,
    fontWeight: '300',
    marginBottom: 4
  },
  emailList: {
    flex: 1,
    paddingHorizontal: 12
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4
  },
 
  
});