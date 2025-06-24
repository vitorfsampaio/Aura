import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSecurity } from '@/hooks/useSecurity';
import SegurancaView from './view';

const SegurancaScreen: React.FC = () => {
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
    setMakeCallEnabled,
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
      if (typeof window !== 'undefined') {
        alert('Preencha o nome e o telefone do contato.');
      } else {
        // Alert para mobile já está na view
      }
      return;
    }
    
    // Validação simplificada: telefone deve ter pelo menos 10 dígitos
    const phone = newContactPhone.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      if (typeof window !== 'undefined') {
        alert('Digite um telefone válido com DDD e número (mínimo 10 dígitos).');
      } else {
        // Alert para mobile já está na view
      }
      return;
    }
    
    const newContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: phone.startsWith('+55') ? phone : `+55${digitsOnly}`,
    };
    
    addContact(newContact);
    
    // Limpa os campos
    setNewContactName('');
    setNewContactPhone('+55');
    setShowAddContact(false);
  }, [newContactName, newContactPhone, addContact]);

  const handleRemoveContact = useCallback((id: string) => {
    removeContact(id);
  }, [removeContact]);

  return (
    <SegurancaView
      safetyKeyword={safetyKeyword}
      setSafetyKeyword={setSafetyKeyword}
      contacts={contacts}
      sendLocationEnabled={sendLocationEnabled}
      setSendLocationEnabled={setSendLocationEnabled}
      makeCallEnabled={makeCallEnabled}
      setMakeCallEnabled={setMakeCallEnabled}
      newContactName={newContactName}
      setNewContactName={setNewContactName}
      newContactPhone={newContactPhone}
      setNewContactPhone={setNewContactPhone}
      showAddContact={showAddContact}
      setShowAddContact={setShowAddContact}
      handleAddContact={handleAddContact}
      handleRemoveContact={handleRemoveContact}
      onBack={handleBackPress}
      saveSecuritySettings={saveSecuritySettings}
    />
  );
};

export default SegurancaScreen;