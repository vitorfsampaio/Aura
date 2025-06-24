import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import NoteItem from '@/components/NoteItem';
import NotasView from './view';

const NotasScreen: React.FC = () => {
  const { notes } = useNotes();
  const router = useRouter();

  const handleCreateNote = useCallback(() => {
    router.push('/nota/nova');
  }, [router]);

  const renderItem = useCallback(({ item }) => {
    return <NoteItem note={item} />;
  }, []);

  return (
    <NotasView
      notes={notes}
      onCreateNote={handleCreateNote}
      renderItem={renderItem}
    />
  );
};

export default NotasScreen; 