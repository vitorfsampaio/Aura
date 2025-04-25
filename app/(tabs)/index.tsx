import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useNotes } from '@/hooks/useNotes';
import NoteItem from '@/components/NoteItem';
import AppHeader from '@/components/AppHeader';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import EmptyNotes from '@/components/EmptyNotes';

export default function NotesScreen() {
  const { notes } = useNotes();
  const router = useRouter();

  const handleCreateNote = useCallback(() => {
    router.push('/nota/nova');
  }, [router]);

  const renderItem = useCallback(({ item }) => {
    return <NoteItem note={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Notas" />
      
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesContainer}
        ListEmptyComponent={EmptyNotes}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleCreateNote}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  notesContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0074D9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});