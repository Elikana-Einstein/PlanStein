import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../constants/Colors';
const C = Colors.dark
export default function HabitsCard({item}) {

  return (
    <View style={{backgroundColor:C.surface,borderWidth:0.5,borderColor:C.border,borderRadius:10,padding:10,flexDirection:'row',justifyContent:'space-between'}}>
      <Text style={{color:C.success}}>{item.name}</Text>
      <TouchableOpacity style={{flexDirection:'row',gap:5}}>
        <Text style={{padding:2,backgroundColor:C.surfaceLight,borderRadius:5,borderWidth:0.1,borderColor:C.textPrimary}}>Pending</Text>
        <Ionicons name='checkbox' color={'red'}/>
      </TouchableOpacity>
    </View>
  )
}