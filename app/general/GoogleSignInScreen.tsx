import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter }    from 'expo-router';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

// ─── Permission config ────────────────────────────────────────────────────────

const PERMISSIONS = [
  {
    icon:    'mail',
    title:   'Read emails',
    sub:     'To summarise and prioritise your inbox',
    color:   C.success,
    bg:      '#0a1f12',
    border:  '#0f3020',
  },
  {
    icon:    'chart',
    title:   'Analyse importance',
    sub:     'To sort urgent vs low priority',
    color:   C.primary,
    bg:      '#1a1030',
    border:  '#2a1e5a',
  },
  {
    icon:    'edit',
    title:   'Draft replies',
    sub:     'To help you write faster responses',
    color:   C.accent,
    bg:      '#2a1a08',
    border:  '#3a2510',
  },
] as const;

const TRUST_POINTS = [
  'Emails are never stored on external servers',
  'You can disconnect at any time from settings',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GoogleSignInScreen() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      //const userInfo = await GoogleSignin.signIn();
      //console.log('User Info:', userInfo);
      //const tokens = await GoogleSignin.getTokens();
      //console.log('Tokens:', tokens);
      router.replace('/ai/email');
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Top content ──────────────────────────────────────────────────── */}
      <View style={styles.top}>

        {/* Icon */}
        <View style={styles.iconWrap}>
          <MailPlusIcon />
        </View>

        <Text style={styles.title}>Connect your Gmail</Text>
        <Text style={styles.subtitle}>
          AI will read and sort your inbox by importance — so you focus on what matters.
        </Text>

        {/* Permissions list */}
        <View style={styles.permsCard}>
          {PERMISSIONS.map((p, i) => (
            <View
              key={p.title}
              style={[styles.permRow, i < PERMISSIONS.length - 1 && styles.permBorder]}
            >
              {/* Icon */}
              <View style={[styles.permIcon, { backgroundColor: p.bg, borderColor: p.border }]}>
                <PermIcon type={p.icon} color={p.color} />
              </View>

              {/* Text */}
              <View style={styles.permBody}>
                <Text style={styles.permTitle}>{p.title}</Text>
                <Text style={styles.permSub}>{p.sub}</Text>
              </View>

              {/* Checkmark */}
              <CheckIcon color={C.success} />
            </View>
          ))}
        </View>

        {/* Trust points */}
        <View style={styles.trustBlock}>
          {TRUST_POINTS.map(point => (
            <View key={point} style={styles.trustRow}>
              <View style={styles.trustDot} />
              <Text style={styles.trustText}>{point}</Text>
            </View>
          ))}
        </View>

      </View>

      {/* ── Bottom actions ────────────────────────────────────────────────── */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.allowBtn, loading && styles.allowBtnLoading]}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <View style={styles.googleG}>
                <Text style={styles.googleGText}>G</Text>
              </View>
              <Text style={styles.allowText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declineBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.declineText}>Not now</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// ─── Inline icon components ───────────────────────────────────────────────────
// Using View shapes instead of Ionicons so no extra imports needed

const MailPlusIcon = () => (
  <View style={styles.mailIconWrap}>
    <View style={styles.mailEnvelope} />
    <View style={styles.mailFlap} />
    <View style={styles.plusH} />
    <View style={styles.plusV} />
  </View>
);

type IconType = 'mail' | 'chart' | 'edit';
const PermIcon: React.FC<{ type: IconType; color: string }> = ({ type, color }) => {
  if (type === 'mail')  return <View style={[styles.piMail,  { borderColor: color }]} />;
  if (type === 'chart') return <View style={[styles.piChart, { borderColor: color }]} />;
  return <View style={[styles.piEdit, { borderColor: color }]} />;
};

const CheckIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.check, { borderColor: color }]}>
    <View style={[styles.checkmark, { borderColor: color }]} />
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: C.background,
    justifyContent:  'space-between',
    paddingHorizontal: S.lg,
    paddingBottom:   S.lg,
  },

  // Top
  top: {
    alignItems:  'center',
    paddingTop:  S.md,
  },

  // Icon
  iconWrap: {
    width:           72,
    height:          72,
    borderRadius:    22,
    backgroundColor: '#0a1f12',
    borderWidth:     1,
    borderColor:     '#0f3020',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    S.lg,
    marginTop:       S.lg,
  },
  mailIconWrap: {
    width:    36,
    height:   28,
    position: 'relative',
  },
  mailEnvelope: {
    position:        'absolute',
    width:           36,
    height:          24,
    borderRadius:    4,
    borderWidth:     1.5,
    borderColor:     C.success,
    bottom:          0,
  },
  mailFlap: {
    position:    'absolute',
    top:         0,
    left:        4,
    right:       4,
    height:      14,
    borderBottomWidth: 1.5,
    borderBottomColor: C.success,
    transform:   [{ rotate: '0deg' }],
  },
  plusH: {
    position:        'absolute',
    top:             2,
    right:           -8,
    width:           10,
    height:          1.5,
    backgroundColor: C.primary,
    borderRadius:    1,
  },
  plusV: {
    position:        'absolute',
    top:             -2,
    right:           -4,
    width:           1.5,
    height:          10,
    backgroundColor: C.primary,
    borderRadius:    1,
  },

  title: {
    fontSize:      20,
    fontWeight:    '700',
    color:         C.textPrimary,
    letterSpacing: -0.5,
    marginBottom:  S.sm,
    textAlign:     'center',
  },
  subtitle: {
    fontSize:     12,
    color:        C.textDim,
    textAlign:    'center',
    lineHeight:   18,
    maxWidth:     230,
    marginBottom: S.lg,
  },

  // Permissions
  permsCard: {
    width:           '100%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    overflow:        'hidden',
    marginBottom:    S.md,
  },
  permRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       S.md,
    gap:           S.md,
  },
  permBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
  },
  permIcon: {
    width:           32,
    height:          32,
    borderRadius:    9,
    borderWidth:     0.5,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  permBody:  { flex: 1 },
  permTitle: { fontSize: 12, fontWeight: '500', color: C.textMuted },
  permSub:   { fontSize: 10, color: C.textDim, marginTop: 1 },

  // Simple icon shapes
  piMail: {
    width:        14,
    height:       10,
    borderWidth:  1,
    borderRadius: 2,
  },
  piChart: {
    width:        14,
    height:       10,
    borderBottomWidth: 1,
    borderLeftWidth:   1,
    borderRadius: 0,
  },
  piEdit: {
    width:        12,
    height:       12,
    borderWidth:  1,
    transform:    [{ rotate: '45deg' }],
  },

  // Checkmark
  check: {
    width:        18,
    height:       18,
    borderRadius: 9,
    borderWidth:  1,
    alignItems:   'center',
    justifyContent: 'center',
  },
  checkmark: {
    width:            7,
    height:           4,
    borderLeftWidth:  1.5,
    borderBottomWidth:1.5,
    borderRadius:     0,
    transform:        [{ rotate: '-45deg' }],
    marginTop:        -2,
  },

  // Trust
  trustBlock: {
    width:      '100%',
    gap:        S.sm,
    paddingHorizontal: S.sm,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           S.sm,
  },
  trustDot: {
    width:           5,
    height:          5,
    borderRadius:    3,
    backgroundColor: C.success,
  },
  trustText: {
    fontSize: 10,
    color:    '#40605a',
  },

  // Bottom
  bottom: {
    gap: S.sm,
  },
  allowBtn: {
    backgroundColor: C.success,
    borderRadius:    R.lg,
    paddingVertical: S.md,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             S.sm,
  },
  allowBtnLoading: { opacity: 0.7 },
  googleG: {
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: '#fff',
    alignItems:      'center',
    justifyContent:  'center',
  },
  googleGText: {
    fontSize:   11,
    fontWeight: '700',
    color:      C.success,
  },
  allowText: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#fff',
  },
  declineBtn: {
    alignItems:    'center',
    paddingVertical: S.sm,
  },
  declineText: {
    fontSize: 13,
    color:    C.textDim,
  },
});