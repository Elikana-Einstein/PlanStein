import React, { useEffect } from 'react';
import {
  ScrollView, View, Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/constants/Colors';
import { useMeStore } from '@/stores/useMeStore';
import { useAIStore } from '@/stores/useAiStore';
import { FeatureCard, FeatureCardConfig } from './components/FeatureCard';
import { DailyBriefCard } from './components/DailyBriefCard';

const C = Colors.dark;
const S = Colors.spacing;

export const AIScreen: React.FC = () => {
  const router = useRouter();

  const { stats, profile } = useMeStore();



  // ─── Feature configs ────────────────────────────────────────────────────────

  const talkFeatures: FeatureCardConfig[] = [
    {
      id:          'chat',
      title:       'Chat',
      description: 'Ask anything — tasks, ideas, advice',
      accentColor: C.primary,
      wide:        true,
      icon: (
        <Ionicons name="chatbubble-outline" size={20} color={C.primary} />
      ),
    },
  ];

  const productivityFeatures: FeatureCardConfig[] = [
    {
      id:          'coach',
      title:       'Coach',
      description: 'Weekly review from your data',
      accentColor: C.primary,
      icon: (
        <Ionicons name="person-outline" size={20} color={C.primary} />
      ),
    },
    {
      id:          'breakdown',
      title:       'Break it down',
      description: 'Turn big tasks into steps',
      accentColor: C.secondary,
      icon: (
        <Ionicons name="list-outline" size={20} color={C.secondary} />
      ),
    },
  ];

  const inboxFeatures: FeatureCardConfig[] = [
    {
      id:          'email',
      title:       'Email triage',
      description: 'AI sorts and summarises your inbox',
      accentColor: C.success,
      wide:        true,
      badge:       '3 urgent · 12 read later',
      icon: (
        <Ionicons name="mail-outline" size={20} color={C.success} />
      ),
    },
  ];

  const wellbeingFeatures: FeatureCardConfig[] = [
    {
      id:          'library',
      title:       'AI library',
      description: '5 min AI story before sleep',
      accentColor: '#b37feb',
      icon: (
        <Ionicons name="moon-outline" size={20} color="#b37feb" />
      ),
    },
    {
      id:          'focusmix',
      title:       'Focus mix',
      description: 'AI picks music for your work',
      accentColor: C.accent,
      icon: (
        <Ionicons name="musical-notes-outline" size={20} color={C.accent} />
      ),
    },
  ];

  const handleFeaturePress = (id: string) => {
    switch (id) {
      case 'chat':      router.push('/(drawer)/chat');      break;
      case 'coach':     router.push('/ai/coach');     break;
      case 'breakdown': router.push('/ai/breakdown'); break;
      case 'email':     router.push('/ai/email');     break;
      case 'library':   router.push('/books/booksScreen');   break;
      case 'focusmix':  router.push('/ai/focusmix');  break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>AI</Text>
          <Ionicons name="sparkles" size={20} color={C.primary} />
        </View>
        <Text style={styles.subheading}>Your personal AI assistant</Text>

        {/* Daily brief */}
     

        {/* Talk to AI */}
        <SectionLabel title="Talk to AI" />
        {talkFeatures.map(f => (
          <FeatureCard
            key={f.id}
            config={f}
            onPress={() => handleFeaturePress(f.id)}
          />
        ))}

        {/* Productivity */}
        <SectionLabel title="Productivity" />
        <View style={styles.grid}>
          {productivityFeatures.map(f => (
            <FeatureCard
              key={f.id}
              config={f}
              onPress={() => handleFeaturePress(f.id)}
            />
          ))}
        </View>

        {/* Inbox */}
        <SectionLabel title="Inbox" />
        {inboxFeatures.map(f => (
          <FeatureCard
            key={f.id}
            config={f}
            onPress={() => handleFeaturePress(f.id)}
          />
        ))}

        {/* Wellbeing */}
        <SectionLabel title="Wellbeing" />
        <View style={styles.grid}>
          {wellbeingFeatures.map(f => (
            <FeatureCard
              key={f.id}
              config={f}
              onPress={() => handleFeaturePress(f.id)}
            />
          ))}
        </View>

        <View style={{ height: S.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: S.md, paddingBottom: S.xl },

  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize:     11,
    color:        C.textDim,
    marginBottom: S.md,
  },

  sectionLabel: {
    fontSize:      10,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  S.sm,
    marginTop:     S.md,
  },

  grid: {
    flexDirection: 'row',
    gap:           S.sm,
    marginBottom:  S.sm,
  },
});