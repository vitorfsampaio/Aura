import React, { useRef, useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSecurity } from '@/hooks/useSecurity';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const { authenticateForSecurityAccess } = useSecurity();
  const clickTimestamps = useRef<number[]>([]);
  const [taps, setTaps] = useState(0);

  const handleTitlePress = useCallback(() => {
    const now = Date.now();
    
    clickTimestamps.current.push(now);
    if (clickTimestamps.current.length > 5) {
      clickTimestamps.current.shift();
    }
    
    if (clickTimestamps.current.length === 5) {
      const firstClick = clickTimestamps.current[0];
      const timeSpan = now - firstClick;
      
      if (timeSpan < 3000) {
        // Reseta os cliques
        clickTimestamps.current = [];
        setTaps(0);
        
        authenticateForSecurityAccess().then((success) => {
          if (success) {
            router.push('/seguranca');
          }
        });
      }
    }
    
    setTaps((prev) => {
      if (prev < 4) {
        return prev + 1;
      }
      return 0;
    });
    
    setTimeout(() => {
      const latestClick = clickTimestamps.current[clickTimestamps.current.length - 1];
      const elapsed = Date.now() - latestClick;
      if (elapsed > 3000) {
        clickTimestamps.current = [];
        setTaps(0);
      }
    }, 3000);
  }, [authenticateForSecurityAccess, router]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handleTitlePress} 
        activeOpacity={0.9}
        style={styles.titleContainer}
      >
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333333',
  },
  tapIndicator: {
    fontSize: 12,
    marginLeft: 8,
    color: '#AFAFAF',
  },
});