import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/shared/constants/Colors'
import Calendar from '@/shared/components/Calendar'
import { Ionicons } from '@expo/vector-icons';
import { HabitCard } from '@/screens/home/components/HabitsMiniGrid'
import { mockHabits } from '@/shared/utils/dummy'
import { returnIdx } from '@/shared/utils'
import HabitModalComponent from '@/shared/components/HabitModal'
import { useHabitData } from '@/hooks/useHabitData'

const C = Colors.dark

export default function HabitsScreen() {
    const buttons = ['All', 'Daily', 'Weekly', 'Monthly']
    const [active, setActive] = useState('All')
    const [habits, setHabits] = useState([])
    const {setFilter,filteredHabits}= useHabitData();
    const filter = useHabitData().filter
    const [openModal,setOpenModal]=useState(false)
    const handleToggle = (habitId) => {
        return
    };

    const habitColors = [
        "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336",
    ]

    return (
        <SafeAreaView style={{ backgroundColor: C.background, flex: 1 }}>
            <Text style={{ color: C.primary, marginHorizontal: 'auto', marginVertical: 16 }}>
                Your Habit streaks
            </Text>
            
            <View>
                <Calendar />
            </View>
            
            <View style={styles.filterContainer}>
                {buttons.map((name, idx) => (
                    <TouchableOpacity 
                        onPress={() => {setActive(name),setFilter(name)}} 
                        key={idx} 
                        style={active == name ? styles.activeCont : styles.inactiveCont}
                    >
                        <Text style={{ 
                            color: active == name ? C.background : C.textPrimary,
                        }}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Grid Layout FlatList */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={filteredHabits}
                    numColumns={2}
                    renderItem={({ item, index }) => (
                        <View style={styles.cardContainer}>
                            <HabitCard 
                                habit={item}
                                accentColor={habitColors[returnIdx(habits, index, habitColors.length)]}
                                onToggle={handleToggle}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}  // ← ADD THIS LINE
                />
            </View>
            <View>
                <HabitModalComponent openState={openModal} closeModal={setOpenModal}/>
            </View>
            
            <TouchableOpacity onPress={()=>setOpenModal(true)} style={styles.addBtn}>
                <Ionicons name='add' size={24} color={C.textBlue} /> 
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        backgroundColor: C.surface,
        borderRadius: 40,
        marginHorizontal: 10,
        height: 40,
        alignItems: 'center',
        marginVertical: 12
    },
    activeCont: {
        backgroundColor: C.textBlue,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inactiveCont: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtn: {
        position: 'absolute',
        bottom: 60,
        right: 60,
        backgroundColor: C.surface,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: C.border
    },
    listContent: {
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },
    cardContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
})