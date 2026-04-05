import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/constants/Colors';
import { GoalsService } from '@/services/GoalsService';
import { generateUUID } from '@/shared/utils';

export default function AddGoalScreen() {
  // Form state
  const [goalTitle, setGoalTitle] = useState('');
  const [episodes, setEpisodes] = useState([
    { id: Date.now().toString(), title: '', subgoals: [''] }
  ]);

  // ----- Episode management -----
  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      { id: Date.now().toString(), title: '', subgoals: [''] }
    ]);
  };

  const removeEpisode = (id) => {
    if (episodes.length === 1) {
      Alert.alert('Cannot remove', 'You need at least one episode.');
      return;
    }
    setEpisodes(episodes.filter(ep => ep.id !== id));
  };

  const updateEpisodeTitle = (id, text) => {
    setEpisodes(episodes.map(ep =>
      ep.id === id ? { ...ep, title: text } : ep
    ));
  };

  // ----- Subgoal management -----
  const addSubgoal = (episodeId) => {
    setEpisodes(episodes.map(ep =>
      ep.id === episodeId
        ? { ...ep, subgoals: [...ep.subgoals, ''] }
        : ep
    ));
  };

  const removeSubgoal = (episodeId, subgoalIndex) => {
    setEpisodes(episodes.map(ep => {
      if (ep.id === episodeId) {
        const updated = [...ep.subgoals];
        updated.splice(subgoalIndex, 1);
        if (updated.length === 0) updated.push('');
        return { ...ep, subgoals: updated };
      }
      return ep;
    }));
  };

  const updateSubgoal = (episodeId, subgoalIndex, text) => {
    setEpisodes(episodes.map(ep => {
      if (ep.id === episodeId) {
        const updated = [...ep.subgoals];
        updated[subgoalIndex] = text;
        return { ...ep, subgoals: updated };
      }
      return ep;
    }));
  };

  // ----- Validation & Submit -----
  const handleSubmit = async () => {
    if (!goalTitle.trim()) {
      Alert.alert('Validation', 'Please enter a goal title.');
      return;
    }

    for (let ep of episodes) {
      if (!ep.title.trim()) {
        Alert.alert('Validation', 'All episodes must have a title (e.g., "week 1-2").');
        return;
      }
      for (let sub of ep.subgoals) {
        if (!sub.trim()) {
          Alert.alert('Validation', 'All subgoals must be filled out.');
          return;
        }
      }
    }

      

    const newGoal = {
      title: goalTitle.trim(),
      episodes: episodes.map(ep => ({
        title: ep.title.trim(),
        subgoals: ep.subgoals.map(s => s.trim())
      }))
    };
    try{
    await GoalsService.addGoal(newGoal);

    }catch(error){
      console.error('Error adding goal:', error);
      return;
    }
    console.log('New Goal:',newGoal);
    Alert.alert(
      'Success',
      'Goal added successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          className='bg-background'
        >
          <SafeAreaView style={styles.innerContainer}>
            {/* Header */}
            <Text style={styles.headerTitle}>➕ Create New Goal</Text>
            <Text style={styles.headerSubtitle}>Add episodes and subgoals to track your progress</Text>

            {/* Goal Title Input */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Goal Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Master React Native"
                placeholderTextColor="#9CA3AF"
                value={goalTitle}
                onChangeText={setGoalTitle}
              />
            </View>

        {/* Episodes List */}
        <Text style={styles.sectionTitle}>📅 Episodes</Text>
        {episodes.map((episode, idx) => (
          <View key={episode.id} className='bg-[#6b63a0a9]' style={styles.episodeCard}>
            {/* Episode Header */}
            <View style={styles.episodeHeader}>
              <Text style={styles.episodeNumber}>Episode {idx + 1}</Text>
              <TouchableOpacity onPress={() => removeEpisode(episode.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {/* Episode Title */}
            <TextInput
              style={styles.input}
              placeholder="Episode title (e.g., week 1-2)"
              placeholderTextColor="#9CA3AF"
              value={episode.title}
              onChangeText={(text) => updateEpisodeTitle(episode.id, text)}
            />

            {/* Subgoals */}
            <Text style={styles.subgoalsLabel}>Subgoals</Text>
            {episode.subgoals.map((sub, subIdx) => (
              <View key={subIdx} style={styles.subgoalRow}>
                <View style={styles.bullet}>
                  <Text style={styles.bulletText}>{subIdx + 1}</Text>
                </View>
                <TextInput
                  style={styles.subgoalInput}
                  placeholder={`Subgoal ${subIdx + 1}`}
                  placeholderTextColor="#9CA3AF"
                  value={sub}
                  onChangeText={(text) => updateSubgoal(episode.id, subIdx, text)}
                />
                <TouchableOpacity
                  onPress={() => removeSubgoal(episode.id, subIdx)}
                  style={styles.removeSubgoalBtn}
                >
                  <Text style={styles.removeSubgoalText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Subgoal Button */}
            <TouchableOpacity
              onPress={() => addSubgoal(episode.id)}
              style={styles.addSubgoalBtn}
            >
              <Text style={styles.addSubgoalText}>+ Add Subgoal</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Episode Button */}
        <TouchableOpacity onPress={addEpisode} style={styles.addEpisodeBtn}>
          <Text style={styles.addEpisodeText}>+ Add Another Episode</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
          <Text style={styles.submitText}>✨ Save Goal</Text>
        </TouchableOpacity>
      </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.dark.primary, // gray-800
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.secondary, // gray-500
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primary, // gray-700
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#6b63a0a9', // gray-50
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primary, // gray-700',
    marginBottom: 12,
  },
  episodeCard: {
    backgroundColor: '#1a1155a9',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  episodeNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.primary, // indigo-600
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.danger, // red-500
  },
  subgoalsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.secondary, // gray-600
    marginBottom: 8,
    marginTop: 8,
  },
  subgoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.card, // indigo-100
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dark.primary, // indigo-600
  },
  subgoalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#6b63a0a9',
    color: '#111827',
  },
  removeSubgoalBtn: {
    marginLeft: 8,
    padding: 8,
  },
  removeSubgoalText: {
    fontSize: 18,
    color: '#F87171', // red-400
  },
  addSubgoalBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE', // indigo-300
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#EEF2FF', // indigo-50
  },
  addSubgoalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  addEpisodeBtn: {
    backgroundColor: '#E0E7FF', // indigo-100
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  addEpisodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4338CA', // indigo-700
  },
  submitBtn: {
    backgroundColor: '#4F46E5', // indigo-600
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});