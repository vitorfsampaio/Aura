import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '@/components/AppHeader';
import NoteItem from '@/components/NoteItem';
import EmptyNotes from '@/components/EmptyNotes';
import { Plus } from 'lucide-react-native';
import { Note } from './model';
import { LinearGradient } from 'expo-linear-gradient';

interface NotasViewProps {
  notes: Note[];
  onCreateNote: () => void;
  renderItem: ({ item }: { item: Note }) => JSX.Element;
}

const NotasView: React.FC<NotasViewProps> = ({ notes, onCreateNote, renderItem }) => (
  <LinearGradient
    colors={["#f8fafc", "#e0e7ef"]}
    style={styles.background}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <AppHeader title="Notas" />
    <FlatList
      data={notes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.notesContainer}
      ListEmptyComponent={EmptyNotes}
      showsVerticalScrollIndicator={false}
    />
    <TouchableOpacity 
      style={styles.addButton}
      onPress={onCreateNote}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#0074D9", "#00C6FB"]}
        style={styles.addButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Plus color="#FFFFFF" size={28} />
      </LinearGradient>
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  background: { flex: 1 },
  notesContainer: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  addButton: {
    position: 'absolute',
    right: 28,
    bottom: 36,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#0074D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  addButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotasView; 