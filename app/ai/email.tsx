import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/constants/Colors';
import { EmailCard } from '@/shared/components/emailComponent';
import { PriorityCard } from '@/shared/components/priorityCard';
import { EmailItem, EmailService } from '@/services/EmailService';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;







// Email List Component
export default function EmailScreen() {
  const [emailList, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const emails = await EmailService.fetchEmails();
        setEmails(emails);
      } catch (err: any) {
        setError(err?.message || 'Failed to load inbox');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const priorityCounts = {
    Urgent: emailList.filter(e => e.priority === 'Urgent').length,
    Normal: emailList.filter(e => e.priority === 'Normal').length,
    Low: emailList.filter(e => e.priority === 'Low').length,
  };

  const handleEmailPress = (id: string) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, isRead: true } : email
    ));
  };

  const handleEmailLongPress = (id: string) => {
    console.log('Email long pressed:', id);
  };

  const priorityData: { id: number; title: 'Urgent' | 'Normal' | 'Low' }[] = [
    { id: 1, title: 'Urgent' },
    { id: 2, title: 'Normal' },
    { id: 3, title: 'Low' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={styles.loadingText}>Loading inbox...</Text>
        </View>
      ) : (
        <>
          <View style={styles.cardRow}>
            {priorityData.map((item) => (
              <PriorityCard key={item.id} title={item.title} count={priorityCounts[item.title]} />
            ))}
          </View>

          <View style={styles.analysisContainer}>
            <ActivityIndicator size={24} color={Colors.dark.primary} style={{ marginVertical: 8 }} />
            <View style={styles.analysisTextContainer}>
              <Text style={styles.analysisTitle}>Reading your Inbox</Text>
              <Text style={styles.analysisSubtitle}>
                AI is analyzing {emailList.length} emails
              </Text>
              <Text style={styles.analysisSubtitle}>
                Sorted by priority: Urgent ({priorityCounts.Urgent}), Normal ({priorityCounts.Normal}), Low ({priorityCounts.Low})
              </Text>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

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
                priority={email.priority}
                timestamp={email.timestamp}
                isRead={email.isRead}
                hasAttachment={email.hasAttachment}
                onPress={handleEmailPress}
                onLongPress={handleEmailLongPress}
              />
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
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
    paddingHorizontal: 12,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.dark.text,
    marginTop: 12,
  },
  errorBanner: {
    backgroundColor: '#3f1f1f',
    borderRadius: 12,
    marginHorizontal: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#ffb3b3',
    fontSize: 12,
    textAlign: 'center',
  },
});