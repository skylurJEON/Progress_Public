import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
//import Icon from "react-native-vector-icons/Ionicons";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { progressState } from '../store/progressState';
import { themesState, Theme } from '../store/themeState';
import { getCurrentDate } from '../utils/dateUtils';
import { useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

type RootStackParamList = {
  HomeScreen: undefined;
  ThemeScreen: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [progress, setProgress] = useRecoilState(progressState);
  const [themes] = useRecoilState(themesState);
  

  const currentTheme = themes.find(theme => theme.isSelected) || {
    ...themes[0],
    //backgroundImage: require('../assets/background/sunset.png'),
  };
  
  useEffect(() => {
    //현재 테마
    const { progressPercentage } = getCurrentDate();
    setProgress(parseFloat(progressPercentage));
  }, []);

  return (
    <View style={styles.container}>
      <ProgressBar />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex : 1,
  },
  container: {
    flex: 1,
    //marginTop: '20%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  button: {
    top: '15%',
    
  },
  buttonText: {
    textAlign: 'center',
    color: "black",
    fontSize: 20,
    fontWeight: '300',

    paddingVertical: '2%', 
    paddingHorizontal: '5%', 
    backgroundColor: '#e8e8e8',
    borderRadius: 15, 
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000', 
    shadowOffset: { width: 6, height: 6 }, 
    shadowOpacity: 0.2,
    shadowRadius: 5, 
    elevation: 6, 
  },
  
});
