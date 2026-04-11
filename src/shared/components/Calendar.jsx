import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import { displaydate, generateMonth, getDisplayDate, todayDate, weekdays } from '../utils'
import { Ionicons } from '@expo/vector-icons';

const C = Colors.dark
export default function Calendar() {

     const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState({ year: todayDate.getFullYear(), month: todayDate.getMonth() });

  useEffect(() => {
    setDates(generateMonth(currentDate));
  }, [currentDate]);
 const nextMonth = () => {
  setCurrentDate(prev => ({
    year: prev.month === 11 ? prev.year + 1 : prev.year,
    month: prev.month === 11 ? 0 : prev.month + 1
  }));
};

const prevMonth = () => {
  setCurrentDate(prev => ({
    year: prev.month === 0 ? prev.year - 1 : prev.year,
    month: prev.month === 0 ? 11 : prev.month - 1
  }));
};
  return (
    <View style={{margin:24,borderWidth:1,borderColor:C.border,backgroundColor:C.surface,borderRadius:10,padding:2,height:250}}>
        <View style={{marginHorizontal:"auto",flexDirection:'row',alignItems:'center',gap:10}}>
            <TouchableOpacity onPress={()=>prevMonth()}>
                <Ionicons name='chevron-back' style={{color:C.textBlue}} size={18}/>
            </TouchableOpacity>
      <Text style={{color:C.textPrimary,paddingVertical:15,fontSize:20}}>{getDisplayDate(currentDate)}</Text>
            <TouchableOpacity onPress={()=>nextMonth()}>
                <Ionicons name='chevron-forward' style={{color:C.textBlue}} size={18}/>
            </TouchableOpacity>
        </View>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-around',paddingBottom:10}}>
        {weekdays.map((name,idx)=>(
        
            <Text style={{backgroundColor:C.background,paddingHorizontal:10,borderRadius:5,color:C.textBlue,borderWidth:0.5,borderColor:C.textPrimary}} key={idx}>{name}</Text>
        ))}

      </View>
       <View style={styles.datesGrid}>
        {dates.map((day, idx) => (
          <View key={idx} style={styles.dateCell}>
            {day !== 0 && (
              <Text style={day === todayDate.getDate()? styles.dateText : styles.datetext}>
                {day}
              </Text>
            )}
          </View>
        ))}
      </View>
     
        
    </View>
  )
}

const styles = StyleSheet.create({
     datesGrid: {
    flexDirection: 'row',     // Horizontal layout
    flexWrap: 'wrap',         // Wrap to next line when full
  },
  dateCell: {
    width: '14.28%',         // Exactly 1/7th of the width (100% / 7)
    aspectRatio: 1,          // Makes it square
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: C.border,
    paddingVertical:'auto',
    
    
  },
  dateText: {
    color: 'red',
    fontSize: 14,
    backgroundColor:C.textMuted,
    paddingHorizontal:10,
    borderRadius:5,
    borderWidth:0.5,
    borderColor:C.textPrimary,
    position:'absolute'
  },

  datetext:{
    color: C.textPrimary,
    fontSize: 14,
    backgroundColor:C.background,
    paddingHorizontal:10,
    borderRadius:5,
    color:C.textBlue,
    borderWidth:0.5,
    borderColor:C.textBlue,
    position:'absolute'
  }
})