import * as DocumentPicker from 'expo-document-picker';
import { Track } from '../shared/types/index';
import { generateId } from '@/shared/utils';

export const ExploreService = {

  // Pick audio files from device storage
  pickFromDevice: async (): Promise<Track | null> => {
    const result = await DocumentPicker.getDocumentAsync({
      type:   ['audio/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return null;

    const asset = result.assets[0];
    return {
      id:       generateId(),
      title:    asset.name.replace(/\.[^/.]+$/, ''), // strip extension
      uri:      asset.uri,
      duration: 0,          // expo-av will read actual duration on load
      source:   'local',
    };
  },

  // Pick multiple files at once
  pickMultipleFromDevice: async (): Promise<Track[]> => {
    const result = await DocumentPicker.getDocumentAsync({
      type:     ['audio/*'],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return [];

    return result.assets.map(asset => ({
      id:       generateId(),
      title:    asset.name.replace(/\.[^/.]+$/, ''),
      uri:      asset.uri,
      duration: 0,
      source:   'local' as const,
    }));
  },
};