import { View, Text } from 'react-native'
import React from 'react'


 function QuickComponent ({text}){
    return (
        <View className='border border-[#3a3c3d] items-center rounded-full flex flex-row gap-2 px-2' >
        
            <Text className='bg-blue-600 w-2 h-2 rounded-full'></Text>
          
            <Text className='text-primary'>{text}</Text>
        </View>
    )

}

export default function Quickchat() {
  return (
    <View style={{rowGap:10}}>
        <View className=' flex-row flex-wrap gap-2 py-4'>
        <QuickComponent  text={"Review my week"}/>
        <QuickComponent text={"12d streak"}/>
        <QuickComponent text={"3 goals active"}/>
        </View>

        <View className=' flex-row flex-wrap gap-3'>

        <QuickComponent text={"5 tasks today"}/>
        <QuickComponent text={"Plan my day"}/>
        <QuickComponent text={"I am feeling stuck"}/>

        </View>
       

    </View>
  )
}