import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/constants/Colors';


const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  focusMinutes: number;
};

export const FocusPrompt: React.FC<Props> = ({ focusMinutes }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Icon */}
      <View style={styles.iconWrap}>
        <Ionicons name="radio-button-on-outline" size={20} color={C.primary} />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>Ready to focus?</Text>
        <Text style={styles.subtitle}>
          Last session: {focusMinutes} min yesterday
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/focus')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  C.surface,
    borderWidth:      0.5,
    borderColor:      C.border,
    borderRadius:     R.lg,
    paddingHorizontal: S.md,
    paddingVertical:  S.md,
    marginHorizontal: S.md,
    marginVertical:   S.sm,
    gap:              12,
  },
  iconWrap: {
    width:           44,
    height:          44,
    borderRadius:    R.md,
    backgroundColor: C.primaryFaint,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    alignItems:      'center',
    justifyContent:  'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize:    14,
    fontWeight:  '500',
    color:       C.textPrimary,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize:   12,
    color:      C.textMuted,
    marginTop:  3,
  },
  button: {
    backgroundColor: C.primaryFaint,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    borderRadius:    R.full,
    paddingVertical:   7,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize:   12,
    fontWeight: '500',
    color:      C.primary,
  },
});