import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Note } from '../types';
import { getRelativeTime } from '../utils/dateUtils';

interface NoteItemProps {
  note: Note;
  index?: number;
}

const pastelColors = [
  '#E3F0FF', // azul claro
  '#FFF6E3', // amarelo claro
  '#E3FFF3', // verde claro
  '#F3E3FF', // lilás claro
  '#FFE3E3', // rosa claro
];

export default function NoteItem({ note, index = 0 }: NoteItemProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/nota/${note.id}`);
  }, [router, note.id]);

  const colorIndex = index % pastelColors.length;
  const cardColor = pastelColors[colorIndex];
  const barColor = ['#0074D9', '#FFB300', '#00C6A2', '#A259FF', '#FF6B81'][colorIndex];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: cardColor }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={[styles.colorBar, { backgroundColor: barColor }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>{note.content}</Text>
        <Text style={styles.date}>{getRelativeTime(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    alignItems: 'stretch',
  },
  colorBar: {
    width: 6,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  preview: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});