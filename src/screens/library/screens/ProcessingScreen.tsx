import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { useBooksStore } from '../store/useBooksStore';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const STEPS = [
  { key: 'reading',    label: 'Reading all pages'         },
  { key: 'extracting', label: 'Extracting key lessons'    },
  { key: 'distilling', label: 'Building distilled book'   },
  { key: 'saving',     label: 'Adding to your shelf'      },
] as const;

type StepKey = typeof STEPS[number]['key'];

const ORDER: StepKey[] = ['reading', 'extracting', 'distilling', 'saving'];

export const ProcessingScreen: React.FC = () => {
  const router = useRouter();
  const { processingStep, books, processingBookId } = useBooksStore();

  const book = books.find(b => b.id === processingBookId);

  // Navigate away when done
  useEffect(() => {
    if (processingStep === 'done') {
      router.replace('/books/booksScreen');
    }
  }, [processingStep]);

  const currentIdx = ORDER.indexOf(processingStep as StepKey);

  const getStepStatus = (key: StepKey) => {
    const idx = ORDER.indexOf(key);
    if (idx < currentIdx)  return 'done';
    if (idx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.heading}>Distilling book</Text>

        {/* Book info */}
        <View style={styles.card}>
          <View style={styles.bookRow}>
            <View style={[styles.cover, { backgroundColor: book?.coverColor ?? '#1a1030' }]}>
              <View style={styles.coverLines}>
                <View style={styles.coverLine} />
                <View style={[styles.coverLine, { width: 18 }]} />
                <View style={[styles.coverLine, { width: 22 }]} />
              </View>
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book?.title ?? 'Processing...'}</Text>
              <Text style={styles.bookAuthor}>{book?.author ?? ''}</Text>
              {book && (
                <Text style={styles.bookPages}>{book.originalPages} pages · uploaded</Text>
              )}
            </View>
          </View>

          {/* Animated progress bar */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          {/* Steps */}
          <View style={styles.steps}>
            {STEPS.map(step => {
              const status = getStepStatus(step.key);
              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={[
                    styles.stepIcon,
                    status === 'done'   && styles.stepDone,
                    status === 'active' && styles.stepActive,
                    status === 'pending' && styles.stepPending,
                  ]}>
                    {status === 'done' ? (
                      <Text style={styles.stepCheck}>✓</Text>
                    ) : status === 'active' ? (
                      <ActivityIndicator size="small" color={C.primary} />
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                  </View>
                  <Text style={[
                    styles.stepText,
                    status === 'done'    && styles.stepTextDone,
                    status === 'active'  && styles.stepTextActive,
                    status === 'pending' && styles.stepTextPending,
                  ]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.hint}>
          This takes about 30–60 seconds.{'\n'}You can close the app — we'll notify you.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.background },
  content: { flex: 1, padding: S.md, justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.5, marginBottom: S.lg, textAlign: 'center' },

  card: { backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.primaryDim, borderRadius: R.xl, padding: S.md, marginBottom: S.lg },

  bookRow:  { flexDirection: 'row', alignItems: 'center', gap: S.md, marginBottom: S.md },
  cover:    { width: 44, height: 58, borderRadius: 6, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverLines: { gap: 3 },
  coverLine:  { width: 26, height: 1.5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 },
  bookInfo:  { flex: 1 },
  bookTitle: { fontSize: 14, fontWeight: '500', color: C.textPrimary },
  bookAuthor: { fontSize: 11, color: C.textDim, marginTop: 2 },
  bookPages:  { fontSize: 10, color: C.textDim, marginTop: 4 },

  progressTrack: { height: 3, backgroundColor: C.borderFaint, borderRadius: 2, marginBottom: S.md, overflow: 'hidden' },
  progressFill:  { height: 3, width: '60%', backgroundColor: C.primary, borderRadius: 2 },

  steps:    { gap: S.sm },
  stepRow:  { flexDirection: 'row', alignItems: 'center', gap: S.md },
  stepIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stepDone:    { backgroundColor: '#0a1f12', borderWidth: 0.5, borderColor: '#0f3020' },
  stepActive:  { backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim },
  stepPending: { backgroundColor: C.surfaceLight, borderWidth: 0.5, borderColor: C.border, opacity: 0.4 },
  stepCheck:   { fontSize: 12, color: C.success },
  stepDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: C.textDim },
  stepText:        { fontSize: 12 },
  stepTextDone:    { color: C.success },
  stepTextActive:  { color: C.primary },
  stepTextPending: { color: C.textDim, opacity: 0.5 },

  hint: { fontSize: 12, color: C.textDim, textAlign: 'center', lineHeight: 18 },
});