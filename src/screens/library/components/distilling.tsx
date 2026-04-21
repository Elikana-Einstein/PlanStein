import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type DistillStepStatus = 'done' | 'active' | 'pending';

type DistillStep = {
  id: string;
  label: string;
  status: DistillStepStatus;
};

type DistillingProps = {
  title: string;
  author: string;
  pagesLabel: string;
  steps: DistillStep[];
};

export function StatusIcon({ status }: { status: DistillStepStatus }) {
  if (status === 'done') {
    return (
      <View style={[styles.statusCircle, styles.doneCircle]}>
        <MaterialCommunityIcons name="check" size={16} color="#1CF386" />
      </View>
    );
  }

  if (status === 'active') {
    return (
      <View style={[styles.statusCircle, styles.activeCircle]}>
        <MaterialCommunityIcons name="loading" size={14} color="#6A63FF" />
      </View>
    );
  }

  return <View style={[styles.statusCircle, styles.pendingCircle]} />;
}

export default function Distilling({
  title,
  author,
  pagesLabel,
  steps,
}: DistillingProps) {
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.bookIconWrap}>
            <MaterialCommunityIcons name="text-box-outline" size={28} color="#6E67FF" />
          </View>
          <View style={styles.bookMeta}>
            <Text style={styles.bookTitle}>{title}</Text>
            <Text style={styles.bookAuthor}>{author}</Text>
            <Text style={styles.bookPages}>{pagesLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.stepsWrap}>
          {steps.map(step => (
            <View style={styles.stepRow} key={step.id}>
              <StatusIcon status={step.status} />
              <Text
                style={[
                  styles.stepText,
                  step.status === 'done' && styles.stepDone,
                  step.status === 'active' && styles.stepActive,
                  step.status === 'pending' && styles.stepPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footerWrap}>
        <Text style={styles.footerLine}>This takes about 30-60 seconds.</Text>
        <Text style={styles.footerLine}>You can close the app - we&apos;ll notify you.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D3A88',
    backgroundColor: '#070A1E',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookIconWrap: {
    width: 56,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#35429A',
    backgroundColor: '#17104A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookMeta: {
    flex: 1,
  },
  bookTitle: {
    color: '#EEF1FF',
    fontSize: 30 / 2,
    fontWeight: '700',
    marginBottom: 2,
  },
  bookAuthor: {
    color: '#7D8AB5',
    fontSize: 13,
    marginBottom: 2,
  },
  bookPages: {
    color: '#6A769C',
    fontSize: 13,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
    height: 1,
    backgroundColor: '#1B2552',
  },
  stepsWrap: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  doneCircle: {
    borderColor: '#105739',
    backgroundColor: '#062A1B',
  },
  activeCircle: {
    borderColor: '#322D86',
    backgroundColor: '#18144A',
  },
  pendingCircle: {
    borderColor: '#273058',
    backgroundColor: 'transparent',
  },
  stepText: {
    fontSize: 26 / 2,
    fontWeight: '500',
  },
  stepDone: {
    color: '#24E785',
  },
  stepActive: {
    color: '#6B67FF',
  },
  stepPending: {
    color: '#2A335C',
  },
  footerWrap: {
    marginTop: 16,
    alignItems: 'center',
    gap: 2,
  },
  footerLine: {
    color: '#57658F',
    fontSize: 13,
    textAlign: 'center',
  },
});
