import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { useSecurity } from '@/hooks/useSecurity';
import { Note } from '@/types';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNoteById, updateNote, deleteNote, createNote } = useNotes();
  const { checkForKeyword } = useSecurity();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNewNote, setIsNewNote] = useState(false);

  useEffect(() => {
    if (id === 'nova') {
      setIsNewNote(true);
      return;
    }

    const note = getNoteById(id as string);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [id, getNoteById]);

  const handleBackPress = useCallback(() => {
    saveNote();
    router.back();
  }, [router, title, content]);

  const saveNote = useCallback(() => {
    if (isNewNote) {
      if (title.trim() || content.trim()) {
        createNote({
          title: title.trim() || 'Nota sem título',
          content: content.trim(),
        });
      }
    } else if (id) {
      updateNote(id as string, {
        title: title.trim() || 'Nota sem título',
        content: content.trim(),
      });
    }
  }, [isNewNote, id, title, content, createNote, updateNote]);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    checkForKeyword(text);
  }, [checkForKeyword]);

  const handleDeleteNote = useCallback(() => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente excluir esta nota?')) {
        deleteNote(id as string);
        router.back();
      }
    } else {
      Alert.alert(
        'Excluir Nota',
        'Deseja realmente excluir esta nota?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Excluir', 
            style: 'destructive',
            onPress: () => {
              deleteNote(id as string);
              router.back();
            } 
          },
        ]
      );
    }
  }, [id, deleteNote, router]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#0074D9" />
        </TouchableOpacity>
        
        {!isNewNote && (
          <TouchableOpacity onPress={handleDeleteNote} style={styles.deleteButton}>
            <Trash2 size={22} color="#FF4136" />
          </TouchableOpacity>
        )}
      </View>
      
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        placeholderTextColor="#9E9E9E"
        selectionColor="#0074D9"
        autoFocus={isNewNote}
      />
      
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={handleContentChange}
        placeholder="Escreva aqui..."
        placeholderTextColor="#9E9E9E"
        selectionColor="#0074D9"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#333333',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    padding: 16,
    color: '#333333',
  },
});