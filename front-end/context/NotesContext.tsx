import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, PartialNote } from '../types';

interface NotesContextProps {
  notes: Note[];
  getNoteById: (id: string) => Note | undefined;
  createNote: (noteData: PartialNote) => Note;
  updateNote: (id: string, noteData: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextProps>({
  notes: [],
  getNoteById: () => undefined,
  createNote: () => ({ id: '', title: '', content: '', createdAt: new Date(), updatedAt: new Date() }),
  updateNote: () => {},
  deleteNote: () => {},
});

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          // Converte as strings de data para objetos Date
          const notesWithDateObjects = parsedNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          setNotes(notesWithDateObjects);
        }
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Erro ao salvar notas:', error);
      }
    };

    if (notes.length > 0) {
      saveNotes();
    }
  }, [notes]);

  const getNoteById = useCallback((id: string) => {
    return notes.find(note => note.id === id);
  }, [notes]);

  const createNote = useCallback((noteData: PartialNote): Note => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title || 'Nota sem título',
      content: noteData.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, noteData: Partial<Note>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? {
              ...note,
              ...noteData,
              updatedAt: new Date(),
            }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        getNoteById,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};