import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-Italic': require('../assets/fonts/JetBrainsMono-Italic.ttf'),
    'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
  });
  
  if (!fontsLoaded) {
      return null; // ou SplashScreen
    }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E6E6E6" }} edges={['top']}>
      <Stack >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false, 
            statusBarStyle: 'dark'
          }} 
        />
      </Stack>
    </SafeAreaView>
    
  )
}
