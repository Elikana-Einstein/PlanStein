import React, { useState, useRef, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasksStore } from '@/stores/tasksStore';
import { generateUUID } from '../utils';
import { TasksService } from '@/services/TasksService';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ModalComponent = () => {
  const toggleModal = useTasksStore((state) => state.toggleModal);
  const [tasks, setTasks] = useState({
    title: '',
    due_date: '',
    tag:''
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const {loadAllTasks} = useTasksStore();


  const handleClose = () => {
    // Animate out before closing
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      toggleModal();
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setTasks({
        ...tasks,
        due_date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      });
    }
  };

  const handleSave =async () => {
   if (!tasks.due_date.trim() || !tasks.title.trim()) {
    Alert.alert('Missing Information', 'All fields are required', [
      { text: 'OK', onPress: () => {} }
    ]);
      return;
    }
    try {
        const id = generateUUID();
        await TasksService.addTask(id,tasks.title,tasks.tag,tasks.due_date)
        loadAllTasks();
    } catch (error) {
        console.log(error);
        
    }
    console.log('Saving task:', tasks);
    // Add your save logic here
    handleClose();
  };
const openModal = useTasksStore((state) => state.openModal);
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={openModal}
      onRequestClose={handleClose}
    >
     <View style={styles.overlay}>
        <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
              >
        
         <View style={styles.handle} />
                
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Add New Task</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  {/* Title Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Task Title *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="What needs to be done?"
                      placeholderTextColor={C.textDim}
                      value={tasks.title}
                      onChangeText={(text) => setTasks({ ...tasks, title: text })}
                      autoFocus={true}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                    {/* Due Date Picker */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Due Date</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.dateButtonText}>
                        {tasks.due_date || 'Select a date'}
                      </Text>
                    </TouchableOpacity>
                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                      />
                    )}
                  </View>
                   {/* Tag Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Task tag </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="work || dev || personal?"
                      placeholderTextColor={C.textDim}
                      value={tasks.tag}
                      onChangeText={(text) => setTasks({ ...tasks, tag: text })}
                      autoFocus={true}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
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
                      <Text style={styles.saveButtonText}>Save Task</Text>
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
});

export default ModalComponent;