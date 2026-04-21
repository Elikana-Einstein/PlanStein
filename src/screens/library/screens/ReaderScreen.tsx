import React from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookReader } from '../hooks/useBookReader';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const ReaderScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    activePage,
    currentPage,
    totalPages,
    progress,
    isLoading,
    nextPage,
    prevPage,
  } = useBookReader(id ?? '');

  if (isLoading || !activePage) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {activePage.chapterTitle}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Page / chapter indicator */}
      <View style={styles.pageIndicator}>
        <Text style={styles.pageNum}>Page {currentPage} of {totalPages}</Text>
        <View style={styles.chapterPill}>
          <Text style={styles.chapterText}>{activePage.chapterTitle}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentCard}>
          <Text style={styles.lessonTitle}>{activePage.lessonTitle}</Text>
          <Text style={styles.bodyText}>{activePage.content}</Text>

          {activePage.highlight ? (
            <View style={styles.highlight}>
              <Text style={styles.highlightText}>"{activePage.highlight}"</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, currentPage <= 1 && styles.navBtnDisabled]}
          onPress={prevPage}
          disabled={currentPage <= 1}
          activeOpacity={0.7}
        >
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>

        {/* Dot indicators */}
        <View style={styles.dots}>
          {Array.from({ length: Math.min(totalPages, 8) }).map((_, i) => {
            const pageIdx = i + 1;
            const isActive = pageIdx === currentPage;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {}}
                style={[styles.dot, isActive && styles.dotActive]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.navBtn, currentPage >= totalPages && styles.navBtnDisabled]}
          onPress={nextPage}
          disabled={currentPage >= totalPages}
          activeOpacity={0.7}
        >
          <Text style={[styles.navArrow, { color: currentPage < totalPages ? C.textMuted : C.textDim }]}>›</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: C.textDim },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.md, paddingVertical: S.sm },
  back:   { fontSize: 24, color: C.primary, width: 32 },
  bookTitle: { flex: 1, fontSize: 13, color: C.textDim, textAlign: 'center' },

  progressTrack: { height: 2, backgroundColor: C.borderFaint, marginHorizontal: S.md, borderRadius: 1 },
  progressFill:  { height: 2, backgroundColor: C.primary, borderRadius: 1 },

  pageIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.md, paddingVertical: S.sm },
  pageNum:       { fontSize: 11, color: C.textDim },
  chapterPill:   { backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim, borderRadius: R.full, paddingVertical: 3, paddingHorizontal: S.sm },
  chapterText:   { fontSize: 10, color: C.primary },

  scrollArea:    { flex: 1 },
  scrollContent: { padding: S.md },
  contentCard:   { backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: R.lg, padding: S.md },
  lessonTitle:   { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: S.md, letterSpacing: -0.2 },
  bodyText:      { fontSize: 13, color: C.textMuted, lineHeight: 22 },
  highlight:     { backgroundColor: C.primaryFaint, borderLeftWidth: 2, borderLeftColor: C.primary, paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: 4, marginVertical: S.md },
  highlightText: { fontSize: 12, color: '#c0b0ff', fontStyle: 'italic', lineHeight: 19 },

  nav:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.md, paddingVertical: S.sm },
  navBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  navBtnDisabled:{ opacity: 0.3 },
  navArrow:      { fontSize: 22, color: C.textMuted },
  dots:          { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot:           { width: 5, height: 5, borderRadius: 3, backgroundColor: C.borderFaint },
  dotActive:     { width: 14, height: 5, borderRadius: 3, backgroundColor: C.primary },
});