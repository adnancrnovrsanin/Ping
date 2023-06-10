import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import AppNavigator from './navigation/AppNavigator';
import MainNavigator from './navigation/MainNavigator';
import AuthScreen from './screens/AuthScreen';
import OtpScreen from './screens/OtpScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage.clear();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (
      async () => {
        try {
          await Font.loadAsync({
            "black": require("./assets/fonts/Roboto-Black.ttf"),
            "blackItalic": require("./assets/fonts/Roboto-BlackItalic.ttf"),
            "bold": require("./assets/fonts/Roboto-Bold.ttf"),
            "boldItalic": require("./assets/fonts/Roboto-BoldItalic.ttf"),
            "italic": require("./assets/fonts/Roboto-Italic.ttf"),
            "light": require("./assets/fonts/Roboto-Light.ttf"),
            "lightItalic": require("./assets/fonts/Roboto-LightItalic.ttf"),
            "medium": require("./assets/fonts/Roboto-Medium.ttf"),
            "mediumItalic": require("./assets/fonts/Roboto-MediumItalic.ttf"),
            "regular": require("./assets/fonts/Roboto-Regular.ttf"),
            "thin": require("./assets/fonts/Roboto-Thin.ttf"),
            "thinItalic": require("./assets/fonts/Roboto-ThinItalic.ttf"),
          });
        } catch (error) {
          console.log(error);
        } finally {
          setFontsLoaded(true);
        }
      }
    )();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded)
      await SplashScreen.hideAsync();
    
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayout}>
        <StatusBar 
          style='light' 
          backgroundColor='transparent'
        />
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
