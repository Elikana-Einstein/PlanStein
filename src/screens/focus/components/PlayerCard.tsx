import { Colors } from '@/shared/constants/Colors';
import { usePlayerStore } from '@/stores/usePlayerStore';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

function formatSecs(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export const PlayerCard: React.FC = () => {
  const {
    currentTrack, isPlaying, position, duration,
    isShuffled, isRepeating,
    togglePlay, nextTrack, prevTrack,
    toggleShuffle, toggleRepeat,
  } = usePlayerStore();
  const { seek } = useAudioPlayer();

  const progress  = duration > 0 ? position / duration : 0;

  if (!currentTrack) {
    return (
      <View style={[styles.card, styles.empty]}>
        <Text style={styles.emptyText}>No track selected</Text>
        <Text style={styles.emptyHint}>Go to Explore to pick music</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Track info row */}
      <View style={styles.infoRow}>
        <View style={styles.artwork}>
          <View style={styles.artworkInner} />
        </View>
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist ?? 'Unknown artist'}
          </Text>
        </View>
        {/* Heart icon placeholder */}
        <TouchableOpacity style={styles.heartBtn}>
          <Text style={styles.heartIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]}>
            <View style={styles.thumb} />
          </View>
        </View>
        <View style={styles.times}>
          <Text style={styles.time}>{formatSecs(position)}</Text>
          <Text style={styles.time}>{formatSecs(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Shuffle */}
        <TouchableOpacity onPress={toggleShuffle} style={styles.sideBtn}>
          <Text style={[styles.sideBtnText, isShuffled && styles.activeText]}>
            ⇌
          </Text>
        </TouchableOpacity>

        {/* Prev */}
        <TouchableOpacity onPress={prevTrack} style={styles.skipBtn}>
          <View style={styles.skipIcon}>
            <View style={[styles.triangle, styles.triangleLeft]} />
            <View style={styles.skipBar} />
          </View>
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
          {isPlaying ? (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <View style={styles.playIcon} />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={nextTrack} style={styles.skipBtn}>
          <View style={styles.skipIcon}>
            <View style={styles.skipBar} />
            <View style={[styles.triangle, styles.triangleRight]} />
          </View>
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity onPress={toggleRepeat} style={styles.sideBtn}>
          <Text style={[styles.sideBtnText, isRepeating && styles.activeText]}>
            ↻
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width:           '100%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.sm,
  },
  empty: {
    alignItems:    'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color:    C.textMuted,
  },
  emptyHint: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 4,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           S.sm,
    marginBottom:  S.md,
  },
  artwork: {
    width:           44,
    height:          44,
    borderRadius:    R.sm,
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  artworkInner: {
    width:        16,
    height:       16,
    borderRadius: 8,
    borderWidth:  1.5,
    borderColor:  C.primary,
  },
  trackInfo: { flex: 1 },
  title: {
    fontSize:   13,
    fontWeight: '500',
    color:      C.textPrimary,
  },
  artist: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 2,
  },
  heartBtn: { padding: 4 },
  heartIcon: {
    fontSize: 18,
    color:    C.textDim,
  },

  // Progress
  progressWrap: { marginBottom: S.md },
  track: {
    height:          3,
    backgroundColor: C.borderFaint,
    borderRadius:    2,
    marginBottom:    4,
  },
  fill: {
    height:          3,
    backgroundColor: C.primary,
    borderRadius:    2,
    flexDirection:   'row',
    justifyContent:  'flex-end',
    alignItems:      'center',
  },
  thumb: {
    width:           9,
    height:          9,
    borderRadius:    5,
    backgroundColor: C.primary,
    right:           -4,
  },
  times: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 9,
    color:    C.textDim,
  },

  // Controls
  controls: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sideBtn:     { padding: 6 },
  sideBtnText: { fontSize: 18, color: C.textDim },
  activeText:  { color: C.primary },

  skipBtn:  { padding: 6 },
  skipIcon: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  skipBar:  { width: 3, height: 14, backgroundColor: C.textMuted, borderRadius: 1 },
  triangle: { width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderTopColor: 'transparent', borderBottomColor: 'transparent' },
  triangleLeft:  { borderRightWidth: 12, borderRightColor: C.textMuted },
  triangleRight: { borderLeftWidth:  12, borderLeftColor:  C.textMuted },

  playBtn: {
    width:           46,
    height:          46,
    borderRadius:    23,
    backgroundColor: C.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  playIcon: {
    width:           0,
    height:          0,
    borderTopWidth:  9,
    borderBottomWidth: 9,
    borderTopColor:  'transparent',
    borderBottomColor: 'transparent',
    borderLeftWidth: 15,
    borderLeftColor: '#fff',
    marginLeft:      3,
  },
  pauseIcon: { flexDirection: 'row', gap: 5 },
  pauseBar:  { width: 3, height: 16, backgroundColor: '#fff', borderRadius: 1.5 },
});