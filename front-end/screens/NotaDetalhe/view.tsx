import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Plus } from 'lucide-react-native';
import { Note } from './model';

interface NotaDetalheViewProps {
  title: string;
  content: string;
  isNewNote: boolean;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onBack: () => void;
  onDelete?: () => void;
  onAddNote?: () => void;
}

const NotaDetalheView: React.FC<NotaDetalheViewProps> = ({
  title,
  content,
  isNewNote,
  onTitleChange,
  onContentChange,
  onBack,
  onDelete,
  onAddNote,
}) => (
  <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={28} color="#0074D9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNewNote ? 'Nova Nota' : 'Editar Nota'}</Text>
        {isNewNote ? (
          <TouchableOpacity
            onPress={onAddNote}
            style={styles.addButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Plus size={26} color="#fff" />
          </TouchableOpacity>
        ) : (
          onDelete ? (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Trash2 size={22} color="#FF4136" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )
        )}
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={onTitleChange}
          placeholder="Título da nota"
          placeholderTextColor="#9E9E9E"
          selectionColor="#0074D9"
          autoFocus={isNewNote}
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={onContentChange}
          placeholder={isNewNote ? "Digite sua nota..." : "Edite sua nota..."}
          placeholderTextColor="#9E9E9E"
          selectionColor="#0074D9"
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F9F9F9',
  },
  backButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#0074D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0074D9',
    flex: 1,
    textAlign: 'center',
    marginLeft: -32, // para centralizar visualmente
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F5F8FA',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
});

export default NotaDetalheView; 