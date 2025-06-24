import React, { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { useSecurity } from '@/hooks/useSecurity';
import { Platform, Alert } from 'react-native';
import NotaDetalheView from './view';

const NotaDetalheScreen: React.FC = () => {
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
      setTitle('');
      setContent('');
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
    router.replace('/');
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
        router.replace('/');
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
              router.replace('/');
            } 
          },
        ]
      );
    }
  }, [id, deleteNote, router]);

  const handleAddNote = useCallback(() => {
    if (isNewNote && (title.trim() || content.trim())) {
      createNote({
        title: title.trim() || 'Nota sem título',
        content: content.trim(),
      });
      router.replace('/');
    }
  }, [isNewNote, title, content, createNote, router]);

  return (
    <NotaDetalheView
      title={title}
      content={content}
      isNewNote={isNewNote}
      onTitleChange={setTitle}
      onContentChange={handleContentChange}
      onBack={handleBackPress}
      onDelete={!isNewNote ? handleDeleteNote : undefined}
      onAddNote={isNewNote ? handleAddNote : undefined}
    />
  );
};

export default NotaDetalheScreen; 