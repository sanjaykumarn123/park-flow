import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ParkingMapScreen from './screens/ParkingMapScreen';
import BookingScreen from './screens/BookingScreen';
import PaymentScreen from './screens/PaymentScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title: 'ParkFlow'}}
        />
        <Stack.Screen 
          name="ParkingMap" 
          component={ParkingMapScreen} 
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
