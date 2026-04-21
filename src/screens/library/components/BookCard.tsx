import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

interface book{
    title:string
    author:string
    cover:string
    color:string
}

export default function BookCard({ title, author, cover, color }:book)  {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Image source={{ uri: cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // white text for contrast
  },
  author: {
    fontSize: 14,
    color: '#eee',
  },
})
