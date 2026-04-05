import { PlayerService } from '@/services/PlayerService';
import { Colors } from '@/shared/constants/Colors';
import { Playlist, Track } from '@/shared/types';
import { formatDuration } from '@/shared/utils';
import { usePlayerStore } from '@/stores/usePlayerStore';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StyleSheet, Alert,
  TextInput, Modal,
} from 'react-native';


const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const PLAYLIST_COLORS = [
  C.primary, C.secondary, C.accent, C.success,
];

export const LibraryTab: React.FC = () => {
  const [playlists,        setPlaylists]        = useState<Playlist[]>([]);
  const [allTracks,        setAllTracks]        = useState<Track[]>([]);
  const [activeSection,    setActiveSection]    = useState<'playlists' | 'tracks'>('playlists');
  const [showNewPlaylist,  setShowNewPlaylist]  = useState(false);
  const [newName,          setNewName]          = useState('');
  const [isLoading,        setIsLoading]        = useState(true);

  // ─── Add to playlist state ─────────────────────────────────────────────────
  const [selectedTrack,    setSelectedTrack]    = useState<Track | null>(null);
  const [showAddSheet,     setShowAddSheet]     = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);

  const { setTrack, setQueue, setPlaylist, currentTrack } = usePlayerStore();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pls, tracks] = await Promise.all([
        PlayerService.getPlaylists(),
        PlayerService.getAllTracks(),
      ]);
      setPlaylists(pls);
      setAllTracks(tracks);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handlePlaylistPress = useCallback(async (playlist: Playlist) => {
    const tracks = await PlayerService.getPlaylistTracks(playlist.id);
    if (!tracks.length) {
      Alert.alert(
        'Empty playlist',
        'This playlist has no tracks yet. Long press any track to add it.',
      );
      return;
    }
    setPlaylist(playlist);
    setQueue(tracks);
    setTrack(tracks[0]);
  }, []);

  const handleTrackPress = useCallback((track: Track) => {
    setTrack(track);
    setQueue(allTracks);
  }, [allTracks]);

  // Long press opens the "add to playlist" sheet
  const handleTrackLongPress = useCallback((track: Track) => {
    setSelectedTrack(track);
    setShowAddSheet(true);
  }, []);

  const handleAddToPlaylist = useCallback(async (playlist: Playlist) => {
    if (!selectedTrack) return;

    // Check if track already in playlist
    const alreadyIn = playlist.trackIds.includes(selectedTrack.id);
    if (alreadyIn) {
      Alert.alert('Already added', `"${selectedTrack.title}" is already in "${playlist.name}".`);
      return;
    }

    setAddingToPlaylist(playlist.id);
    try {
      await PlayerService.addTrackToPlaylist(
        playlist.id,
        selectedTrack.id,
        playlist.trackIds.length, // append to end
      );

      // Update local state so UI reflects immediately
      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlist.id
            ? { ...p, trackIds: [...p.trackIds, selectedTrack.id] }
            : p
        )
      );

      setShowAddSheet(false);
      setSelectedTrack(null);
    } finally {
      setAddingToPlaylist(null);
    }
  }, [selectedTrack]);

  const createPlaylist = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    const color = PLAYLIST_COLORS[playlists.length % PLAYLIST_COLORS.length];
    const pl    = await PlayerService.createPlaylist(name, color);
    setPlaylists(prev => [pl, ...prev]);
    setNewName('');
    setShowNewPlaylist(false);
  }, [newName, playlists.length]);

  const deletePlaylist = useCallback((id: string) => {
    Alert.alert(
      'Delete playlist',
      'This will remove the playlist but keep the tracks in your library.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Delete',
          style:   'destructive',
          onPress: async () => {
            await PlayerService.deletePlaylist(id);
            setPlaylists(prev => prev.filter(p => p.id !== id));
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Library</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => setShowNewPlaylist(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.newBtnText}>+ Playlist</Text>
        </TouchableOpacity>
      </View>

      {/* Section toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeSection === 'playlists' && styles.toggleActive]}
          onPress={() => setActiveSection('playlists')}
        >
          <Text style={[styles.toggleText, activeSection === 'playlists' && styles.toggleTextActive]}>
            Playlists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeSection === 'tracks' && styles.toggleActive]}
          onPress={() => setActiveSection('tracks')}
        >
          <Text style={[styles.toggleText, activeSection === 'tracks' && styles.toggleTextActive]}>
            All tracks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hint when on tracks tab */}
      {activeSection === 'tracks' && allTracks.length > 0 && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Long press any track to add it to a playlist
          </Text>
        </View>
      )}

      {/* Content */}
      {activeSection === 'playlists' ? (
        <FlatList
          data={playlists}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No playlists yet</Text>
                <Text style={styles.emptyHint}>Tap "+ Playlist" to create one</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <PlaylistCard
              playlist={item}
              onPress={() => handlePlaylistPress(item)}
              onLongPress={() => deletePlaylist(item.id)}
            />
          )}
        />
      ) : (
        <FlatList
          data={allTracks}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No tracks in library</Text>
                <Text style={styles.emptyHint}>Go to Explore to add tracks</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <LibraryTrackRow
              track={item}
              isPlaying={currentTrack?.id === item.id}
              onPress={() => handleTrackPress(item)}
              onLongPress={() => handleTrackLongPress(item)}
            />
          )}
        />
      )}

      {/* ── Add to playlist bottom sheet ─────────────────────────────────── */}
      <Modal
        visible={showAddSheet}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowAddSheet(false); setSelectedTrack(null); }}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => { setShowAddSheet(false); setSelectedTrack(null); }}
        >
          <View style={styles.sheet}>
            {/* Handle bar */}
            <View style={styles.sheetHandle} />

            {/* Track being added */}
            <View style={styles.sheetTrackInfo}>
              <Text style={styles.sheetLabel}>Add to playlist</Text>
              <Text style={styles.sheetTrackName} numberOfLines={1}>
                {selectedTrack?.title}
              </Text>
            </View>

            {/* No playlists yet */}
            {playlists.length === 0 ? (
              <View style={styles.sheetEmpty}>
                <Text style={styles.sheetEmptyText}>
                  No playlists yet — create one first
                </Text>
                <TouchableOpacity
                  style={styles.sheetCreateBtn}
                  onPress={() => {
                    setShowAddSheet(false);
                    setSelectedTrack(null);
                    setShowNewPlaylist(true);
                  }}
                >
                  <Text style={styles.sheetCreateBtnText}>+ Create playlist</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Playlist options */
              playlists.map(playlist => {
                const alreadyIn  = playlist.trackIds.includes(selectedTrack?.id ?? '');
                const isAdding   = addingToPlaylist === playlist.id;

                return (
                  <TouchableOpacity
                    key={playlist.id}
                    style={[
                      styles.sheetPlaylistRow,
                      alreadyIn && styles.sheetPlaylistRowDone,
                    ]}
                    onPress={() => !alreadyIn && handleAddToPlaylist(playlist)}
                    activeOpacity={alreadyIn ? 1 : 0.7}
                    disabled={isAdding}
                  >
                    {/* Color swatch */}
                    <View style={[
                      styles.sheetSwatchWrap,
                      { backgroundColor: `${playlist.color ?? C.primary}22`,
                        borderColor:      `${playlist.color ?? C.primary}44` },
                    ]}>
                      <View style={[
                        styles.sheetSwatch,
                        { backgroundColor: playlist.color ?? C.primary },
                      ]} />
                    </View>

                    {/* Name + count */}
                    <View style={styles.sheetPlaylistInfo}>
                      <Text style={styles.sheetPlaylistName}>
                        {playlist.name}
                      </Text>
                      <Text style={styles.sheetPlaylistMeta}>
                        {playlist.trackIds.length}{' '}
                        {playlist.trackIds.length === 1 ? 'track' : 'tracks'}
                      </Text>
                    </View>

                    {/* Status indicator */}
                    {isAdding ? (
                      <Text style={styles.sheetAdding}>Adding…</Text>
                    ) : alreadyIn ? (
                      <View style={styles.sheetDoneBadge}>
                        <Text style={styles.sheetDoneText}>✓ Added</Text>
                      </View>
                    ) : (
                      <View style={styles.sheetAddBtn}>
                        <Text style={styles.sheetAddBtnText}>+ Add</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}

            {/* Create new playlist shortcut */}
            {playlists.length > 0 && (
              <TouchableOpacity
                style={styles.sheetNewPlaylist}
                onPress={() => {
                  setShowAddSheet(false);
                  setSelectedTrack(null);
                  setShowNewPlaylist(true);
                }}
              >
                <Text style={styles.sheetNewPlaylistText}>
                  + Create new playlist
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── New playlist modal ───────────────────────────────────────────── */}
      <Modal
        visible={showNewPlaylist}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewPlaylist(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New playlist</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Playlist name..."
              placeholderTextColor={C.textDim}
              autoFocus
              onSubmitEditing={createPlaylist}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setShowNewPlaylist(false); setNewName(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCreate, !newName.trim() && styles.modalCreateDisabled]}
                onPress={createPlaylist}
                disabled={!newName.trim()}
              >
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// ─── PlaylistCard ─────────────────────────────────────────────────────────────

type PlaylistCardProps = {
  playlist:    Playlist;
  onPress:     () => void;
  onLongPress: () => void;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist, onPress, onLongPress,
}) => (
  <TouchableOpacity
    style={styles.playlistCard}
    onPress={onPress}
    onLongPress={onLongPress}
    activeOpacity={0.7}
  >
    <View style={[
      styles.playlistArt,
      { backgroundColor: `${playlist.color ?? C.primary}22`,
        borderColor:      `${playlist.color ?? C.primary}44` },
    ]}>
      <View style={[styles.playlistDot, { backgroundColor: playlist.color ?? C.primary }]} />
    </View>
    <View style={styles.playlistInfo}>
      <Text style={styles.playlistName} numberOfLines={1}>{playlist.name}</Text>
      <Text style={styles.playlistMeta}>
        {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'track' : 'tracks'}
      </Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

// ─── LibraryTrackRow ──────────────────────────────────────────────────────────

type LibraryTrackRowProps = {
  track:       Track;
  isPlaying:   boolean;
  onPress:     () => void;
  onLongPress: () => void;       // ← added
};

const LibraryTrackRow: React.FC<LibraryTrackRowProps> = ({
  track, isPlaying, onPress, onLongPress,
}) => (
  <TouchableOpacity
    style={[styles.trackRow, isPlaying && styles.trackRowActive]}
    onPress={onPress}
    onLongPress={onLongPress}   // ← added
    activeOpacity={0.7}
  >
    <View style={[styles.trackArt, isPlaying && styles.trackArtActive]}>
      <View style={[
        styles.trackArtDot,
        { backgroundColor: isPlaying ? C.primary : C.textDim },
      ]} />
    </View>
    <View style={styles.trackInfo}>
      <Text
        style={[styles.trackTitle, isPlaying && styles.trackTitleActive]}
        numberOfLines={1}
      >
        {track.title}
      </Text>
      <Text style={styles.trackMeta} numberOfLines={1}>
        {track.artist ?? 'Unknown'} · {formatDuration(track.duration)}
      </Text>
    </View>
    <View style={[
      styles.sourceBadge,
      track.source === 'local'
        ? styles.badgeLocal
        : track.source === 'builtin'
        ? styles.badgeBuiltin
        : styles.badgeWeb,
    ]}>
      <Text style={[
        styles.sourceBadgeText,
        track.source === 'local'
          ? { color: C.primary }
          : track.source === 'builtin'
          ? { color: C.secondary }
          : { color: C.accent },
      ]}>
        {track.source === 'local'
          ? 'Local'
          : track.source === 'builtin'
          ? 'Built-in'
          : 'Web'}
      </Text>
    </View>
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex:              1,
    paddingHorizontal: S.md,
  },
  header: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  newBtn: {
    backgroundColor:  C.primaryFaint,
    borderWidth:      0.5,
    borderColor:      C.primaryDim,
    borderRadius:     R.full,
    paddingVertical:   5,
    paddingHorizontal: 14,
  },
  newBtnText: {
    fontSize:   12,
    color:      C.primary,
    fontWeight: '500',
  },
  toggle: {
    flexDirection:   'row',
    backgroundColor: C.surfaceLight,
    borderRadius:    R.full,
    borderWidth:     0.5,
    borderColor:     C.border,
    padding:         3,
    marginBottom:    S.sm,
  },
  toggleBtn: {
    flex:            1,
    paddingVertical: 8,
    borderRadius:    R.full,
    alignItems:      'center',
  },
  toggleActive:     { backgroundColor: C.primary },
  toggleText:       { fontSize: 13, fontWeight: '500', color: C.textDim },
  toggleTextActive: { color: '#fff' },

  // Hint
  hint: {
    backgroundColor: C.surfaceLight,
    borderRadius:    R.md,
    padding:         S.sm,
    marginBottom:    S.sm,
    alignItems:      'center',
  },
  hintText: {
    fontSize: 11,
    color:    C.textDim,
  },

  listContent: { paddingBottom: S.xl },

  // Playlist card
  playlistCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.sm,
    gap:             S.md,
  },
  playlistArt: {
    width:           44,
    height:          44,
    borderRadius:    R.md,
    borderWidth:     0.5,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  playlistDot: {
    width:        14,
    height:       14,
    borderRadius: 7,
  },
  playlistInfo: { flex: 1 },
  playlistName: {
    fontSize:   14,
    fontWeight: '500',
    color:      C.textPrimary,
  },
  playlistMeta: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 3,
  },
  chevron: { fontSize: 22, color: C.textDim },

  // Track row
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
  trackArt: {
    width:           38,
    height:          38,
    borderRadius:    R.sm,
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  trackArtActive: {
    borderColor:     C.primaryDim,
    backgroundColor: C.primaryFaint,
  },
  trackArtDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  trackInfo:        { flex: 1 },
  trackTitle:       { fontSize: 13, fontWeight: '500', color: C.textMuted },
  trackTitleActive: { color: C.primary },
  trackMeta:        { fontSize: 11, color: C.textDim, marginTop: 2 },

  // Source badge
  sourceBadge: {
    paddingVertical:   3,
    paddingHorizontal: 8,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  badgeLocal:   { backgroundColor: C.primaryFaint, borderColor: C.primaryDim },
  badgeBuiltin: { backgroundColor: '#0a2420',       borderColor: '#0f3830'    },
  badgeWeb:     { backgroundColor: '#2a1a08',       borderColor: '#3a2510'    },
  sourceBadgeText: { fontSize: 9, fontWeight: '500' },

  // ── Add to playlist sheet ──────────────────────────────────────────────────
  sheetOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    borderWidth:     0.5,
    borderColor:     C.border,
    paddingHorizontal: S.md,
    paddingBottom:   40,
    paddingTop:      S.sm,
  },
  sheetHandle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: C.border,
    alignSelf:       'center',
    marginBottom:    S.md,
  },
  sheetTrackInfo: {
    marginBottom: S.md,
    paddingBottom: S.md,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
  },
  sheetLabel: {
    fontSize:      11,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom:  4,
  },
  sheetTrackName: {
    fontSize:   16,
    fontWeight: '600',
    color:      C.textPrimary,
  },
  sheetPlaylistRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: S.md,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
    gap:            S.md,
  },
  sheetPlaylistRowDone: {
    opacity: 0.5,
  },
  sheetSwatchWrap: {
    width:        40,
    height:       40,
    borderRadius: R.md,
    borderWidth:  0.5,
    alignItems:   'center',
    justifyContent: 'center',
    flexShrink:   0,
  },
  sheetSwatch: {
    width:        12,
    height:       12,
    borderRadius: 6,
  },
  sheetPlaylistInfo: { flex: 1 },
  sheetPlaylistName: {
    fontSize:   14,
    fontWeight: '500',
    color:      C.textPrimary,
  },
  sheetPlaylistMeta: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 2,
  },
  sheetAdding: {
    fontSize: 12,
    color:    C.textDim,
  },
  sheetDoneBadge: {
    backgroundColor: '#0a2420',
    borderWidth:     0.5,
    borderColor:     '#0f3830',
    borderRadius:    R.full,
    paddingVertical:   3,
    paddingHorizontal: 10,
  },
  sheetDoneText: {
    fontSize:   11,
    color:      C.secondary,
    fontWeight: '500',
  },
  sheetAddBtn: {
    backgroundColor:  C.primaryFaint,
    borderWidth:      0.5,
    borderColor:      C.primaryDim,
    borderRadius:     R.full,
    paddingVertical:   5,
    paddingHorizontal: 12,
  },
  sheetAddBtnText: {
    fontSize:   12,
    color:      C.primary,
    fontWeight: '500',
  },
  sheetEmpty: {
    paddingVertical: S.xl,
    alignItems:      'center',
    gap:             S.md,
  },
  sheetEmptyText: {
    fontSize: 13,
    color:    C.textDim,
  },
  sheetCreateBtn: {
    backgroundColor:  C.primaryFaint,
    borderWidth:      0.5,
    borderColor:      C.primaryDim,
    borderRadius:     R.full,
    paddingVertical:   8,
    paddingHorizontal: 20,
  },
  sheetCreateBtnText: {
    fontSize:   13,
    color:      C.primary,
    fontWeight: '500',
  },
  sheetNewPlaylist: {
    alignItems:    'center',
    paddingVertical: S.md,
    marginTop:     S.sm,
  },
  sheetNewPlaylistText: {
    fontSize: 13,
    color:    C.primary,
  },

  // ── New playlist modal ─────────────────────────────────────────────────────
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         S.lg,
  },
  modalCard: {
    width:           '100%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.xl,
    padding:         S.lg,
  },
  modalTitle: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    marginBottom:  S.md,
    letterSpacing: -0.3,
  },
  modalInput: {
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.md,
    fontSize:        14,
    color:           C.textPrimary,
    marginBottom:    S.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap:           S.sm,
  },
  modalCancel: {
    flex:            1,
    paddingVertical: 12,
    borderRadius:    R.full,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
  },
  modalCancelText: { fontSize: 14, color: C.textDim },
  modalCreate: {
    flex:            1,
    paddingVertical: 12,
    borderRadius:    R.full,
    backgroundColor: C.primary,
    alignItems:      'center',
  },
  modalCreateDisabled: { opacity: 0.4 },
  modalCreateText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  // Empty state
  empty: {
    paddingVertical: 60,
    alignItems:      'center',
  },
  emptyText: { fontSize: 14, color: C.textDim },
  emptyHint: { fontSize: 12, color: C.textDim, marginTop: 6, opacity: 0.7 },
});