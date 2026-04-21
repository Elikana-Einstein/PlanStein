import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Ionicons }     from '@expo/vector-icons';
import { useBooksStore } from '../store/useBooksStore';
import { BookCover }    from '../components/BookCover';
import { Colors } from '@/shared/constants/Colors';
import { Book } from '@/shared/types';
import { RecommendationCard } from '../components/RecommendationCard.tsx';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type ShelfFilter = 'all' | 'reading' | 'finished';

export const BookshelfScreen: React.FC = () => {
  const router = useRouter();
  const {
    books, recommendations,
    loadBooks, loadRecommendations, deleteBook,
  } = useBooksStore();

  const [filter, setFilter] = useState<ShelfFilter>('all');

  useEffect(() => {
    loadBooks();
    loadRecommendations();
  }, []);

  const filteredBooks = books.filter(b => {
    if (filter === 'all')      return b.status !== 'processing';
    if (filter === 'reading')  return b.status === 'reading';
    if (filter === 'finished') return b.status === 'finished';
    return true;
  });

  const processingBooks = books.filter(b => b.status === 'processing');

  const handleBookPress = (book: Book) => {
    if (book.status === 'processing') return;
    router.push(`/books/${book.id}`);
  };

  const handleBookLongPress = (book: Book) => {
    Alert.alert(
      book.title,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Delete',
          style:   'destructive',
          onPress: () => deleteBook(book.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>My shelf</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/books/upload')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Processing banner */}
        {processingBooks.length > 0 && (
          <TouchableOpacity
            style={styles.processingBanner}
            onPress={() => router.push('/books/processing')}
          >
            <View style={styles.processingDot} />
            <Text style={styles.processingText}>
              Distilling "{processingBooks[0].title}"...
            </Text>
            <Ionicons name="chevron-forward" size={14} color={C.primary} />
          </TouchableOpacity>
        )}

        {/* Filter tabs */}
        <View style={styles.tabs}>
          {(['all', 'reading', 'finished'] as ShelfFilter[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.tab, filter === f && styles.tabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Books grid */}
        {filteredBooks.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={40} color={C.textDim} />
            <Text style={styles.emptyText}>No books here yet</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/books/upload')}
            >
              <Text style={styles.emptyBtnText}>Upload your first book</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredBooks.map(book => (
              <BookCover
                key={book.id}
                book={book}
                onPress={() => handleBookPress(book)}
              />
            ))}
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <>
            <Text style={styles.recLabel}>Recommended for you</Text>
            <View style={styles.recRow}>
              {recommendations.slice(0, 3).map(rec => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onPress={() => {}}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: S.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.md, paddingVertical: S.sm },
  heading: { fontSize: 22, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.5 },
  addBtn:  { width: 32, height: 32, borderRadius: 10, backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },

  processingBanner: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim, borderRadius: R.md, marginHorizontal: S.md, padding: S.sm, marginBottom: S.sm },
  processingDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary },
  processingText:   { flex: 1, fontSize: 12, color: C.primary },

  tabs: { flexDirection: 'row', gap: S.sm, paddingHorizontal: S.md, marginBottom: S.md },
  tab:           { paddingVertical: 5, paddingHorizontal: S.md, borderRadius: R.full, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.surface },
  tabActive:     { backgroundColor: C.primaryFaint, borderColor: C.primaryDim },
  tabText:       { fontSize: 11, color: C.textDim },
  tabTextActive: { color: C.primary },

  grid:  { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.md, gap: S.md, marginBottom: S.lg },
  empty: { alignItems: 'center', paddingVertical: 60, gap: S.md },
  emptyText: { fontSize: 14, color: C.textDim },
  emptyBtn:  { backgroundColor: C.primaryFaint, borderWidth: 0.5, borderColor: C.primaryDim, borderRadius: R.full, paddingVertical: S.sm, paddingHorizontal: S.lg },
  emptyBtnText: { fontSize: 13, color: C.primary, fontWeight: '500' },

  recLabel: { fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: S.md, marginBottom: S.sm },
  recRow:   { flexDirection: 'row', paddingHorizontal: S.md, gap: S.sm },
});