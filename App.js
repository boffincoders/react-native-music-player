import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import PlayerScreen from './src/screens/PlayerScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/splashScreen';
import PlayList from './src/screens/playList';
export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030303" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="splash" component={SplashScreen}></Stack.Screen>
          <Stack.Screen
            name="playground"
            component={PlayerScreen}></Stack.Screen>
          <Stack.Screen name="playList" component={PlayList}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
    // alignItems: 'center',
    justifyContent: 'center',
  },
});
