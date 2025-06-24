import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotesProvider } from '@/context/NotesContext';
import { SecurityProvider } from '@/context/SecurityContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold
} from '@expo-google-fonts/inter';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SecurityProvider>
          <NotesProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="nota/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="seguranca/index" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </NotesProvider>
        </SecurityProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}