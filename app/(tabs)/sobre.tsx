import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import AppHeader from '@/components/AppHeader';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Sobre" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Minhas Notas</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
        
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/636237/pexels-photo-636237.jpeg' }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <Text style={styles.description}>
          Um aplicativo simples para criar e gerenciar suas anotações pessoais. 
          Organize suas ideias, listas de compras, tarefas e pensamentos em um só lugar.
        </Text>

        <Text style={styles.sectionTitle}>Funcionalidades</Text>
        <Text style={styles.bullet}>• Crie notas ilimitadas</Text>
        <Text style={styles.bullet}>• Edite e exclua anotações</Text>
        <Text style={styles.bullet}>• Interface simples e intuitiva</Text>
        <Text style={styles.bullet}>• Armazenamento local seguro</Text>
        <Text style={styles.bullet}>• Design minimalista</Text>
        
        <Text style={styles.footer}>
          © 2025 Minhas Notas. Todos os direitos reservados.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    color: '#333',
  },
  version: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    color: '#444',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    color: '#333',
  },
  bullet: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 8,
    color: '#444',
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
  },
});