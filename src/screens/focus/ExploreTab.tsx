import { Colors } from '@/shared/constants/Colors';
import { Track } from '@/shared/types';
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useFilePicker } from './hooks/useFilePicker';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { PlayerService } from '@/services/PlayerService';
import { formatDuration } from '@/shared/utils';


const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

// ─── Source option config ─────────────────────────────────────────────────────

const SOURCES = [
  {
    id:          'device',
    label:       'My device files',
    description: 'Pick audio files from your phone',
    color:       C.primary,
  },
  {
    id:          'builtin',
    label:       'Built-in focus beats',
    description: 'Curated lo-fi, nature & ambience',
    color:       C.secondary,
  },
  {
    id:          'silence',
    label:       'Silence — no music',
    description: 'Focus with no audio playing',
    color:       C.accent,
  },
] as const;

type SourceId = typeof SOURCES[number]['id'];

// ─── Component ────────────────────────────────────────────────────────────────

export const ExploreTab: React.FC = () => {
  const [search,       setSearch]       = useState('');
  const [builtins,     setBuiltins]     = useState<Track[]>([]);
  const [loadingBuiltins, setLoadingBuiltins] = useState(false);

  const { pickSingle, pickMultiple, isPicking } = useFilePicker();
  const { setTrack, setQueue, currentTrack }    = usePlayerStore();

  const handleSourcePress = useCallback(async (id: SourceId) => {
    switch (id) {
      case 'device': {
        await pickMultiple();
        break;
      }
      case 'builtin': {
        setLoadingBuiltins(true);
        try {
          await PlayerService.seedBuiltinTracks();
          const all   = await PlayerService.getAllTracks();
          const built = all.filter(t => t.source === 'builtin');
          setBuiltins(built);
          if (built.length) {
            setQueue(built);
            setTrack(built[0]);
          }
        } finally {
          setLoadingBuiltins(false);
        }
        break;
      }
      case 'silence': {
        // Clear the player — user wants no music
        usePlayerStore.getState().clearPlayer();
        break;
      }
    }
  }, [pickMultiple]);

  const handleTrackPress = useCallback((track: Track) => {
    setTrack(track);
  }, []);

  const filteredBuiltins = builtins.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.artist ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const displayList = search.length > 0 ? filteredBuiltins : builtins;

  return (
    <FlatList
      data={displayList}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.heading}>Explore</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search songs, artists..."
              placeholderTextColor={C.textDim}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Source options */}
          <Text style={styles.sectionLabel}>Sources</Text>
          <View style={styles.sources}>
            {SOURCES.map(source => (
              <TouchableOpacity
                key={source.id}
                style={styles.sourceRow}
                onPress={() => handleSourcePress(source.id)}
                activeOpacity={0.7}
                disabled={isPicking || loadingBuiltins}
              >
                <View style={[styles.sourceDot, { backgroundColor: source.color }]} />
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceLabel}>{source.label}</Text>
                  <Text style={styles.sourceDesc}>{source.description}</Text>
                </View>
                {(isPicking || loadingBuiltins) && source.id !== 'silence' ? (
                  <ActivityIndicator size="small" color={C.primary} />
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Track list header — only show when there are results */}
          {displayList.length > 0 && (
            <Text style={styles.sectionLabel}>
              {search.length > 0 ? 'Results' : 'Built-in tracks'}
            </Text>
          )}

          {/* Empty state when search yields nothing */}
          {search.length > 0 && filteredBuiltins.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No tracks found for "{search}"</Text>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => (
        <TrackRow
          track={track => handleTrackPress(track)}
          item={item}
          isPlaying={currentTrack?.id === item.id}
        />
      )}
    />
  );
};

// ─── TrackRow ─────────────────────────────────────────────────────────────────

type TrackRowProps = {
  item:      Track;
  isPlaying: boolean;
  track:     (t: Track) => void;
};

const TrackRow: React.FC<TrackRowProps> = ({ item, isPlaying, track }) => (
  <TouchableOpacity
    style={[styles.trackRow, isPlaying && styles.trackRowActive]}
    onPress={() => track(item)}
    activeOpacity={0.7}
  >
    {/* Artwork placeholder */}
    <View style={[styles.artwork, isPlaying && styles.artworkActive]}>
      <View style={[styles.artworkDot, { backgroundColor: isPlaying ? C.primary : C.textDim }]} />
    </View>

    {/* Info */}
    <View style={styles.trackInfo}>
      <Text
        style={[styles.trackTitle, isPlaying && styles.trackTitleActive]}
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1}>
        {item.artist ?? 'Unknown'} · {formatDuration(item.duration)}
      </Text>
    </View>

    {/* Playing indicator OR play button */}
    {isPlaying ? (
      <View style={styles.playingDots}>
        <View style={[styles.playingBar, styles.bar1]} />
        <View style={[styles.playingBar, styles.bar2]} />
        <View style={[styles.playingBar, styles.bar3]} />
      </View>
    ) : (
      <Text style={styles.playBtn}>▶</Text>
    )}
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: S.md,
    paddingBottom:     S.xl,
  },

  // Header
  header: {
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },

  // Search
  searchWrap: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    paddingHorizontal: S.md,
    marginBottom:    S.md,
    height:          44,
    gap:             S.sm,
  },
  searchIcon: {
    fontSize: 18,
    color:    C.textDim,
  },
  searchInput: {
    flex:     1,
    fontSize: 13,
    color:    C.textPrimary,
  },
  clearBtn: {
    fontSize: 12,
    color:    C.textDim,
    padding:  4,
  },

  // Section label
  sectionLabel: {
    fontSize:      10,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  S.sm,
    marginTop:     S.sm,
  },

  // Sources
  sources: {
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    overflow:        'hidden',
    marginBottom:    S.sm,
  },
  sourceRow: {
    flexDirection:  'row',
    alignItems:     'center',
    padding:        S.md,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
    gap:            S.sm,
  },
  sourceDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    flexShrink:   0,
  },
  sourceInfo: { flex: 1 },
  sourceLabel: {
    fontSize:   13,
    color:      C.textMuted,
    fontWeight: '500',
  },
  sourceDesc: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color:    C.textDim,
  },

  // Track rows
  trackRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.sm,
    marginBottom:    S.sm,
    gap:             S.sm,
  },
  trackRowActive: {
    borderColor:     C.primaryDim,
    backgroundColor: C.primaryFaint,
  },
  artwork: {
    width:           40,
    height:          40,
    borderRadius:    R.sm,
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  artworkActive: {
    borderColor:     C.primaryDim,
    backgroundColor: C.primaryFaint,
  },
  artworkDot: {
    width:        12,
    height:       12,
    borderRadius: 6,
  },
  trackInfo:  { flex: 1 },
  trackTitle: {
    fontSize:   13,
    fontWeight: '500',
    color:      C.textMuted,
  },
  trackTitleActive: { color: C.primary },
  trackArtist: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 2,
  },
  playBtn: {
    fontSize: 12,
    color:    C.textDim,
    padding:  4,
  },

  // Playing animation bars
  playingDots: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    gap:           2,
    height:        16,
    paddingRight:  4,
  },
  playingBar: {
    width:           3,
    borderRadius:    1.5,
    backgroundColor: C.primary,
  },
  bar1: { height: 8  },
  bar2: { height: 14 },
  bar3: { height: 10 },

  // Empty state
  empty: {
    paddingVertical: S.xl,
    alignItems:      'center',
  },
  emptyText: {
    fontSize: 13,
    color:    C.textDim,
  },
});