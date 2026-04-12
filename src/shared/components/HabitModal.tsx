import React, { useState, useRef, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity as TouchableOpacityBase,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { HabitsService } from '@/services/HabitsService';
import { formatDateForSql, generateUUID, getFormattedDate, todayDate } from '../utils';


const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;
interface habits{
  id:string,
  name:string,
  occurence:string,
  start_date:Date
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HabitModalComponent = ({openState,closeModal}:any) => {
  const [habit, setHabit] = useState<habits>({
    id: '',
    name: '',
    occurence:'',
    start_date:todayDate

  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    // Animate modal entrance
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);



  const handleClose = () => {
    // Animate out before closing
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
       setHabit({
               id: '',
                name: '',
                occurence:'',
                start_date:todayDate
            })
        closeModal(false)
    });
  };

;

  const handleSave =async () => {
        if (!habit.name.trim() || !habit.occurence.trim() || !habit.start_date) {
        Alert.alert('Missing Information', 'All fields are required', [
          { text: 'OK', onPress: () => {} }
        ]);
        return;

       

    }else{
      
        try {
            const id = generateUUID()
            habit.id = id;
            await HabitsService.addHabits(habit)

            setHabit({
               id: '',
                name: '',
                occurence:'',
                start_date:todayDate
            })
            handleClose()
        } catch (error) {
            console.log(error);
            
        }
    }
   
    // Add  save logic here
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={openState}
      onRequestClose={()=>closeModal(false)}
    >
     <View style={styles.overlay}>
        <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
              >
        
         <View style={styles.handle} />
                
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Add New Habit</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  {/* Title Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Habit Title *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="No coffee six hours before eleven"
                      placeholderTextColor={C.textDim}
                      value={habit.name}
                      onChangeText={(text) => setHabit({ ...habit, name: text })}
                      autoFocus={true}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                   
                 {/* Frequency Selector */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Habit frequency *</Text>
                      <View style={styles.frequencyContainer}>
                        {['Daily', 'Weekly', 'Monthly'].map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={[
                              styles.frequencyOption,
                              habit.occurence === option && styles.frequencyOptionActive,
                            ]}
                            onPress={() => setHabit({ ...habit, occurence: option })}
                          >
                            <Text
                              style={[
                                styles.frequencyOptionText,
                                habit.occurence === option && styles.frequencyOptionTextActive,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                     {/* Start date picker */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Start date</Text>
                        <TouchableOpacity
                          style={styles.dateButton}
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text style={[
                            styles.dateButtonText,
                            habit.start_date ? { color: C.text } : {}
                          ]}>
                            {habit.start_date
                              ? new Date(habit.start_date).toLocaleDateString('en-GB', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })
                              : 'Select a start date'}
                          </Text>
                        </TouchableOpacity>
                              
                        {showDatePicker && (
                          <DateTimePicker
                            value={habit.start_date ? new Date(habit.start_date) : new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            minimumDate={new Date()}
                            onChange={(event, date) => {
                              setShowDatePicker(Platform.OS === 'ios');
                              if (event.type === 'set' && date) {
                                setHabit({ ...habit, start_date: date });
                              }
                            }}
                          />
                        )}
                      </View>
                                            {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleClose}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleSave}
                    >
                      <Text style={styles.saveButtonText}>Save Habit</Text>
                    </TouchableOpacity>
                  </View>
                 
                </View>
         
        
        </KeyboardAvoidingView>

     </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: C.surface , // 80% opacity
  },
  modalContainer: {
    backgroundColor: C.surface,
    borderTopLeftRadius: R.lg,
    borderTopRightRadius: R.lg,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  keyboardView: {
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: C.textDim,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: S.sm,
    marginBottom: S.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingBottom: S.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    color: C.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: C.textDim,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: S.lg,
  },
  inputGroup: {
    marginBottom: S.lg,
    backgroundColor: C.surface,
    padding: S.md,
    borderRadius: R.md,
  },
  label: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: S.xs,
  },
  input: {
    backgroundColor: C.background,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    color: C.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
 
  dateButton: {
    backgroundColor: C.background,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: C.textDim,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: S.md,
    marginTop: S.lg,
  },
  button: {
    flex: 1,
    paddingVertical: S.md,
    borderRadius: R.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
  },
  cancelButtonText: {
    color: C.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: C.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  frequencyContainer: {
  flexDirection: 'row',
  backgroundColor: C.background,
  borderRadius: R.md,
  borderWidth: 1,
  borderColor: C.border,
  padding: 4,
  gap: 4,
},
frequencyOption: {
  flex: 1,
  paddingVertical: S.sm,
  borderRadius: R.sm,
  alignItems: 'center',
},
frequencyOptionActive: {
  backgroundColor: C.primary,
},
frequencyOptionText: {
  fontSize: 14,
  color: C.textDim,
},
frequencyOptionTextActive: {
  color: '#fff',
  fontWeight: '500',
},
});

export default HabitModalComponent;