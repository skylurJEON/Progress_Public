import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { progressState } from '../store/progressState';
import { themesState, Theme } from '../store/themeState';
import { getCurrentDate } from '../utils/dateUtils';
import { useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import React, { useRef, useCallback } from 'react';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';

export default function SocialScreen() {
  const [progress, setProgress] = useRecoilState(progressState);
  const [themes] = useRecoilState(themesState);
  const viewShotRef = useRef(null);

  const currentTheme = themes.find(theme => theme.isSelected) || {
    ...themes[0],
    backgroundImage: require('../assets/background/sunset.png'),
  };

  const captureAndShareScreenshot = async () => {
    if (viewShotRef.current) {  
      try {
        const uri = await captureRef(viewShotRef);
        await Share.open({
        url: uri,
        title: 'Share Progress',
        //message: '',
      });
    } catch (error) {
      if (String(error).includes('User did not share')) {
        return;
      }
      console.error('Error sharing screenshot: ', error);
    }
  } else {
    console.error('ViewShot ref is not initialized');
  }
};
  

  useEffect(() => {
    const { progressPercentage } = getCurrentDate();
    setProgress(parseFloat(progressPercentage));
  }, []);

  // 화면에 포커스될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      // progress 값 업데이트
      const { progressPercentage } = getCurrentDate();
      setProgress(parseFloat(progressPercentage));

      // 약간의 지연 후 스크린샷 캡처
      const timer = setTimeout(() => {
        captureAndShareScreenshot();
      }, 1000);
      // cleanup 함수
      return () => clearTimeout(timer);
    }, []) // 빈 의존성 배열
  );


  return (
    <View style={styles.container}>
      <ViewShot 
        ref={viewShotRef} 
        options={{ format: 'png', quality: 0.9, width: 600, height: 600, result: 'data-uri' }}
        style={styles.viewShotContainer}
      >
        
        <ProgressBar />
      </ViewShot>
    
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  viewShotContainer: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  
  shareButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
  },
      
      
});
