import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BookService }  from '../service/BookService';
import { Colors } from '@/shared/constants/Colors';
import { Book, BookLesson } from '@/shared/types';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const BookDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [book,    setBook]    = useState<Book | null>(null);
  const [lessons, setLessons] = useState<BookLesson[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const [b, l] = await Promise.all([
        BookService.getBook(id),
        BookService.getLessons(id),
      ]);
      setBook(b);
      setLessons(l);
    };
    load();
  }, [id]);

  if (!book) return null;

  const readLabel = book.status === 'reading' && book.progress > 0
    ? 'Continue reading'
    : 'Start reading';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Book</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Cover */}
        <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
          <View style={styles.coverShine} />
          <View style={styles.coverLines}>
            <View style={styles.coverLine} />
            <View style={[styles.coverLine, { width: 30 }]} />
            <View style={[styles.coverLine, { width: 38 }]} />
          </View>
        </View>

        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author} · Distilled by AI</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <StatCell value={`${book.distilledPages}`}  label="Pages"    />
          <StatCell value={`${lessons.length}`}       label="Lessons"  />
          <StatCell value={`${book.readTimeMinutes}m`} label="Read time" />
          <StatCell value={`${book.progress}%`}       label="Progress" />
        </View>

        {/* Lessons */}
        <Text style={styles.sectionLabel}>Key lessons</Text>
        <View style={styles.lessonsCard}>
          {lessons.map((lesson, i) => (
            <View
              key={lesson.id}
              style={[styles.lessonRow, i < lessons.length - 1 && styles.lessonBorder]}
            >
              <View style={styles.lessonNum}>
                <Text style={styles.lessonNumText}>{lesson.order}</Text>
              </View>
              <Text style={styles.lessonText}>{lesson.title}</Text>
            </View>
          ))}
        </View>

        {/* Read button */}
        <TouchableOpacity
          style={styles.readBtn}
          onPress={() => router.push(`/books/${id}/read`)}
          activeOpacity={0.8}
        >
          <Text style={styles.readBtnText}>{readLabel}</Text>
        </TouchableOpacity>

        <View style={{ height: S.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCell: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statLbl}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },

  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.md, paddingVertical: S.sm },
  back:    { fontSize: 16, color: C.primary, width: 60 },
  heading: { fontSize: 17, fontWeight: '600', color: C.textPrimary },

  cover: { width: 90, height: 120, borderRadius: 12, alignSelf: 'center', marginVertical: S.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  coverShine: { position: 'absolute', top: 0, left: 0, width: 10, height: '100%', backgroundColor: 'rgba(255,255,255,0.08)' },
  coverLines: { gap: 4 },
  coverLine:  { width: 44, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 },

  title:  { fontSize: 18, fontWeight: '600', color: C.textPrimary, textAlign: 'center', letterSpacing: -0.3, paddingHorizontal: S.lg },
  author: { fontSize: 12, color: C.textDim, textAlign: 'center', marginTop: 4, marginBottom: S.md },

  stats:   { flexDirection: 'row', paddingHorizontal: S.md, gap: S.sm, marginBottom: S.md },
  stat:    { flex: 1, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: R.md, padding: S.sm, alignItems: 'center', gap: 3 },
  statVal: { fontSize: 16, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.3 },
  statLbl: { fontSize: 8, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.6 },

  sectionLabel: { fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: S.md, marginBottom: S.sm },

  lessonsCard: { backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: R.lg, overflow: 'hidden', marginHorizontal: S.md, marginBottom: S.md },
  lessonRow:   { flexDirection: 'row', alignItems: 'flex-start', padding: S.md, gap: S.sm },
  lessonBorder:{ borderBottomWidth: 0.5, borderBottomColor: C.borderFaint },
  lessonNum:   { width: 20, height: 20, borderRadius: 10, backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  lessonNumText: { fontSize: 9, color: C.primary, fontWeight: '600' },
  lessonText:  { flex: 1, fontSize: 12, color: C.textMuted, lineHeight: 18 },

  readBtn:     { backgroundColor: C.primary, borderRadius: R.lg, paddingVertical: S.md, marginHorizontal: S.md, alignItems: 'center' },
  readBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});