import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SourceItem from './components/sources';
import Distilling, { StatusIcon } from './components/distilling';

type SourceCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const SOURCES: SourceCard[] = [
  { id: 'drive', title: 'Google Drive', subtitle: 'Import PDF', icon: 'google-drive' },
  { id: 'dropbox', title: 'Dropbox', subtitle: 'Import PDF', icon: 'dropbox' },
  { id: 'url', title: 'URL / Link', subtitle: 'Paste link', icon: 'link-variant' },
];

const DISTILL_STEPS = [
  { id: 'read', label: 'Reading all 426 pages', status: 'done' as const },
  { id: 'extract', label: 'Extracting key lessons', status: 'done' as const },
  { id: 'build', label: 'Building your distilled book...', status: 'active' as const },
  { id: 'shelf', label: 'Adding to your shelf', status: 'pending' as const },
];

export default function LibraryScreen() {
  const router = useRouter();

  const onUploadTap = () => {
    Alert.alert('Upload coming next', 'We can connect DocumentPicker in the next step.');
  };

  const onSourceTap = (title: string) => {
    Alert.alert(title, 'Source integration can be wired in next.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

         

          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="chevron-back" size={20} color="#6B63FF" />
            </Pressable>
            <Text style={styles.headerTitle}>Book distiller</Text>
          </View>

          <View style={styles.heroIconWrap}>
            <View style={styles.heroIconCard}>
              <MaterialCommunityIcons name="file-search-outline" size={34} color="#6B63FF" />
            </View>
          </View>

          <Text style={styles.title}>Upload a book</Text>
          <Text style={styles.subtitle}>
            AI extracts the key lessons and stories into a short distilled version you can actually
            finish.
          </Text>
         <View style={styles.distillingWrap}>
            <Distilling
              title="Becoming"
              author="Michelle Obama"
              pagesLabel="426 pages - uploaded"
              steps={DISTILL_STEPS}
            />
          </View>

          <Pressable style={styles.uploadCard} onPress={onUploadTap}>
            <View style={styles.uploadMiniIcon}>
              <MaterialCommunityIcons name="upload" size={18} color="#5F66FF" />
            </View>
            <Text style={styles.uploadText}>Tap to upload PDF</Text>
            <Text style={styles.uploadHint}>Up to 50MB - PDF only</Text>
          </Pressable>

          <View style={styles.sourcesRow}>
            {SOURCES.map(source => (
                <View style={styles.sourceCard} key={source.id}>
              <SourceItem
                title={source.title}
                subtitle={source.subtitle}
                icon={source.icon}
                onSourceTap={onSourceTap}
              />

                </View>
            ))}
          </View>

          <Text style={styles.footerNote}>
            Books are processed by AI and stored only on your device
          </Text>

         
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050814',
  },
  scrollContent: {
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  topLabel: {
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#1E2E63',
    marginBottom: 8,
  },
  shell: {
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#1B2150',
    backgroundColor: '#040716',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTime: {
    color: '#7A86AC',
    fontSize: 13,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#4F5988',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#F3F6FF',
    fontSize: 34 / 2,
    fontWeight: '700',
  },
  heroIconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIconCard: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#201252',
    borderWidth: 1,
    borderColor: '#41308C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34 / 2,
    color: '#EEF2FF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5E6A8D',
    textAlign: 'center',
    fontSize: 26 / 2,
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  uploadCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D3C83',
    borderStyle: 'dashed',
    backgroundColor: '#0C1130',
    alignItems: 'center',
    paddingVertical: 22,
    marginBottom: 14,
  },
  uploadMiniIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1A1451',
    borderWidth: 1,
    borderColor: '#3D2F8F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadText: {
    color: '#5966FF',
    fontWeight: '700',
    fontSize: 22 / 2,
    marginBottom: 6,
  },
  uploadHint: {
    color: '#495A87',
    fontSize: 10.5,
  },
   sourcesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

   footerNote: {
    textAlign: 'center',
    color: '#354067',
    fontSize: 11,
  },
   sourceCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#273160',
    backgroundColor: '#0A0F29',
    paddingVertical: 10,
    
    minHeight: 106,
  },
  distillingWrap: {
    marginVertical: 14,
  },
});
