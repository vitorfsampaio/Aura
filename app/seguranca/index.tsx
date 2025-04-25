import { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert,
  Platform,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSecurity } from '@/hooks/useSecurity';
import { SecurityContact } from '@/types';
import { ArrowLeft, Plus, Trash2, Phone } from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeOutUp 
} from 'react-native-reanimated';

export default function SecurityScreen() {
  const router = useRouter();
  const { 
    safetyKeyword, 
    setSafetyKeyword, 
    contacts, 
    addContact, 
    removeContact,
    saveSecuritySettings,
    sendLocationEnabled,
    setSendLocationEnabled,
    makeCallEnabled,
    setMakeCallEnabled
  } = useSecurity();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const handleBackPress = useCallback(() => {
    saveSecuritySettings();
    router.back();
  }, [router, saveSecuritySettings]);

  const handleAddContact = useCallback(() => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      if (Platform.OS === 'web') {
        alert('Preencha o nome e o telefone do contato.');
      } else {
        Alert.alert('Erro', 'Preencha o nome e o telefone do contato.');
      }
      return;
    }

    const newContact: SecurityContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim().replace(/\D/g, ''),
    };

    addContact(newContact);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  }, [newContactName, newContactPhone, addContact]);

  const handleRemoveContact = useCallback((id: string) => {
    removeContact(id);
  }, [removeContact]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#0074D9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações de Segurança</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Palavra-chave de Segurança</Text>
          <Text style={styles.sectionDescription}>
            Quando esta palavra for digitada em uma nota, o sistema de emergência será ativado silenciosamente.
          </Text>
          <TextInput
            style={styles.keywordInput}
            value={safetyKeyword}
            onChangeText={setSafetyKeyword}
            placeholder="Digite a palavra-chave"
            placeholderTextColor="#9E9E9E"
            selectionColor="#0074D9"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações de Emergência</Text>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>Enviar localização</Text>
              <Text style={styles.toggleDescription}>
                Enviar SMS com sua localização para os contatos abaixo
              </Text>
            </View>
            <Switch
              value={sendLocationEnabled}
              onValueChange={setSendLocationEnabled}
              trackColor={{ false: "#DEDEDE", true: "#A4C9F0" }}
              thumbColor={sendLocationEnabled ? "#0074D9" : "#F5F5F5"}
            />
          </View>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>Ligação automática</Text>
              <Text style={styles.toggleDescription}>
                Realizar chamada automática para o primeiro contato da lista
              </Text>
            </View>
            <Switch
              value={makeCallEnabled}
              onValueChange={setMakeCallEnabled}
              trackColor={{ false: "#DEDEDE", true: "#A4C9F0" }}
              thumbColor={makeCallEnabled ? "#0074D9" : "#F5F5F5"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contactsHeader}>
            <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
            <TouchableOpacity 
              style={styles.addContactButton}
              onPress={() => setShowAddContact(!showAddContact)}
            >
              <Plus size={20} color="#0074D9" />
            </TouchableOpacity>
          </View>
          
          {showAddContact && (
            <Animated.View 
              style={styles.addContactContainer}
              entering={FadeInDown.duration(200)}
              exiting={FadeOutUp.duration(200)}
            >
              <TextInput
                style={styles.contactInput}
                value={newContactName}
                onChangeText={setNewContactName}
                placeholder="Nome do contato"
                placeholderTextColor="#9E9E9E"
              />
              <TextInput
                style={styles.contactInput}
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                placeholder="Telefone com DDD"
                placeholderTextColor="#9E9E9E"
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={styles.saveContactButton}
                onPress={handleAddContact}
              >
                <Text style={styles.saveContactButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {contacts.length === 0 ? (
            <Text style={styles.emptyContactsText}>
              Nenhum contato adicionado. Adicione contatos para receber alertas em caso de emergência.
            </Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.contactActionButton}
                    onPress={() => handleRemoveContact(contact.id)}
                  >
                    <Trash2 size={18} color="#FF4136" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
        
        <Text style={styles.securityNote}>
          Suas informações são armazenadas apenas neste dispositivo e de forma criptografada.
        </Text>
      </ScrollView>
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
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  keywordInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 18,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addContactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  contactInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  saveContactButton: {
    height: 44,
    backgroundColor: '#0074D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveContactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContactsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  securityNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});