import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity } from 'react-native';
import { useRecoilValue } from 'recoil';
import { themesState } from '../store/themeState';
import { useTranslation } from 'react-i18next';


import HomeScreen from '../screens/HomeScreen';
import ThemeScreen from "../screens/ThemeScreen";
import DaySelectScreen from "../screens/DaySelectScreen";
import SocialScreen from "../screens/SocialScreen";
import SettingScreen from "../screens/SettingScreen";
//import { TouchableOpacity } from 'react-native';

export type RootStackParamList = {
  HomeScreen: undefined;
  ThemeScreen: undefined;
  DaySelectScreen: undefined;
  SocialScreen: undefined;
  SettingScreen: undefined;
};

const Tab = createBottomTabNavigator();


//const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomTabBar = ({ children, onPress}: { children: any, onPress: any }) => {
  return (
    <TouchableOpacity
      style = {{
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }}
    onPress={onPress}
    >
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 35,
        paddingTop: 15,
        backgroundColor: 'rgba(92, 92, 192, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        
      }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default function AppNavigator() {

  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="HomeScreen"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          //height: 80,
        },
        tabBarLabelStyle: {
          marginBottom: 10,
        },
        //animation: 'fade',
        tabBarActiveTintColor: 'rgba(92, 92, 192, 0.7)',
        tabBarIcon: ({ color, size }) => {
          let iconName
          let iconSize = size

          if (route.name === 'HomeScreen') {
            iconName = 'home-outline'; 
          } else if (route.name === 'ThemeScreen') {
            iconName = 'color-palette-outline'; 
          } else if (route.name === 'DaySelectScreen') {
            iconName = 'calendar-outline'; 
          } else if (route.name === 'SocialScreen') {
            iconName = 'add-outline'; 
            iconSize = 32;
            color = 'white';
          } else if (route.name === 'SettingScreen') {
            iconName = 'settings-outline'; 
          }

          return <Icon name={iconName!} size={iconSize} color={color} />;
        },
      })}>

        <Tab.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{
            tabBarLabel: 'HOME',
          }}
        />
        <Tab.Screen 
          name="ThemeScreen" 
          component={ThemeScreen}
          options={{
            tabBarLabel: t('ThemeScreen'),
          }}
        />
        <Tab.Screen 
          name="SocialScreen" 
          component={SocialScreen}
          options={{
            tabBarLabel: '',
            tabBarButton: (props) => <CustomTabBar {...props} onPress={props.onPress} />,
          }}
        />
        <Tab.Screen 
          name="DaySelectScreen" 
          component={DaySelectScreen}
          options={{
            tabBarLabel: t('DaySelectScreen'),
          }}
        />  
        <Tab.Screen 
          name="SettingScreen" 
          component={SettingScreen}
          options={{
            tabBarLabel: t('SettingScreen'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}