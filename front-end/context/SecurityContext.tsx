import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { SecurityContact } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviarLigacaoEmergencia } from '@/utils/api';

interface SecurityContextProps {
  safetyKeyword: string;
  setSafetyKeyword: (keyword: string) => void;
  contacts: SecurityContact[];
  addContact: (contact: SecurityContact) => void;
  removeContact: (id: string) => void;
  sendLocationEnabled: boolean;
  setSendLocationEnabled: (enabled: boolean) => void;
  makeCallEnabled: boolean;
  setMakeCallEnabled: (enabled: boolean) => void;
  saveSecuritySettings: () => Promise<void>;
  authenticateForSecurityAccess: () => Promise<boolean>;
  checkForKeyword: (text: string) => void;
}

export const SecurityContext = createContext<SecurityContextProps>({
  safetyKeyword: '',
  setSafetyKeyword: () => {},
  contacts: [],
  addContact: () => {},
  removeContact: () => {},
  sendLocationEnabled: true,
  setSendLocationEnabled: () => {},
  makeCallEnabled: true,
  setMakeCallEnabled: () => {},
  saveSecuritySettings: async () => {},
  authenticateForSecurityAccess: async () => false,
  checkForKeyword: () => {},
});

interface SecurityProviderProps {
  children: React.ReactNode;
}

// Persistência: AsyncStorage no mobile, localStorage no web
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }
};

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [safetyKeyword, setSafetyKeyword] = useState('');
  const [contacts, setContacts] = useState<SecurityContact[]>([]);
  const [sendLocationEnabled, setSendLocationEnabled] = useState(true);
  const [makeCallEnabled, setMakeCallEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carrega as configurações de segurança
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const settings = await storage.getItem('securitySettings');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          setSafetyKeyword(parsedSettings.safetyKeyword || '');
          setContacts(parsedSettings.contacts || []);
          setSendLocationEnabled(
            parsedSettings.sendLocationEnabled !== undefined 
              ? parsedSettings.sendLocationEnabled 
              : true
          );
          setMakeCallEnabled(
            parsedSettings.makeCallEnabled !== undefined 
              ? parsedSettings.makeCallEnabled 
              : true
          );
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de segurança:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSecuritySettings();
  }, []);

  // Salva as configurações de segurança
  const saveSecuritySettings = useCallback(async () => {
    if (!isInitialized) return; // Don't save until initialized
    
    try {
      const settings = {
        safetyKeyword,
        contacts,
        sendLocationEnabled,
        makeCallEnabled,
      };
      await storage.setItem('securitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de segurança:', error);
    }
  }, [safetyKeyword, contacts, sendLocationEnabled, makeCallEnabled, isInitialized]);

  // Adiciona um contato de emergência
  const addContact = useCallback((contact: SecurityContact) => {
    setContacts(prev => [...prev, contact]);
  }, []);

  // Remove um contato de emergência
  const removeContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, []);

  // Função para autenticar o usuário antes de mostrar menu de segurança
  const authenticateForSecurityAccess = useCallback(async () => {
    if (Platform.OS === 'web') {
      // Na web, não temos autenticação biométrica, então apenas retornamos true
      return true;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        // Se não há hardware biométrico ou nenhuma biometria cadastrada
        Alert.alert(
          'Sem autenticação biométrica',
          'Seu dispositivo não tem suporte a autenticação biométrica ou não há nenhuma biometria cadastrada.',
          [{ text: 'OK' }]
        );
        return true; // Permite acesso mesmo sem biometria
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticar para acessar configurações de segurança',
        fallbackLabel: 'Use sua senha',
      });
      
      return result.success;
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      return false;
    }
  }, []);

  // Verifica se o texto contém a palavra-chave de segurança
  const checkForKeyword = useCallback(async (text: string) => {
    if (!safetyKeyword || safetyKeyword.length < 3) return;

    // Verifica se o texto contém a palavra-chave de segurança
    if (text.toLowerCase().includes(safetyKeyword.toLowerCase())) {
      // Executa ações de emergência
      triggerEmergencyProtocol();
    }
  }, [safetyKeyword]);

  // Protocolo de emergência
  const triggerEmergencyProtocol = useCallback(async () => {
    if (contacts.length === 0) {
      Alert.alert('Emergência', 'Nenhum contato de emergência cadastrado.');
      return;
    }

    try {
      let latitude = null;
      let longitude = null;
      let nome = 'Usuário';

      if (sendLocationEnabled) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
          }
        } catch (error) {
          console.error('Erro ao obter localização:', error);
        }
      }

      const contato = contacts[0];
      if (!contato) {
        Alert.alert('Emergência', 'Nenhum contato de emergência cadastrado.');
        return;
      }

      // Chama o backend
      try {
        await enviarLigacaoEmergencia({
          numero: contato.phone,
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          nome: contato.name || 'Usuário',
        });
        Alert.alert('Emergência', 'Ligação e SMS de emergência enviados com sucesso!');
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao acionar emergência.');
      }
    } catch (error) {
      console.error('Erro no protocolo de emergência:', error);
      Alert.alert('Erro', 'Erro inesperado ao acionar emergência.');
    }
  }, [contacts, sendLocationEnabled]);

  // Save security settings whenever any of the relevant states change
  useEffect(() => {
    if (isInitialized) {
      saveSecuritySettings();
    }
  }, [safetyKeyword, contacts, sendLocationEnabled, makeCallEnabled, isInitialized]);

  return (
    <SecurityContext.Provider
      value={{
        safetyKeyword,
        setSafetyKeyword,
        contacts,
        addContact,
        removeContact,
        sendLocationEnabled,
        setSendLocationEnabled,
        makeCallEnabled,
        setMakeCallEnabled,
        saveSecuritySettings,
        authenticateForSecurityAccess,
        checkForKeyword,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};