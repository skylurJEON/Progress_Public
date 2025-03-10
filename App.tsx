import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/Appnavigator';
import mobileAds from 'react-native-google-mobile-ads';
import { RecoilRoot } from 'recoil';
import { rewarded } from './src/utils/adUtils';
import { initializeStorage } from './src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeInitializer from './src/components/ThemeInitializer';
import './i18n.config';

export default function App() {

  useEffect(() => {
    const clearAllData = async () => {
      try {
        await AsyncStorage.clear();
        console.log('모든 데이터가 초기화되었습니다.');
      } catch (error) {
        console.error('데이터 초기화 중 오류 발생:', error);
      }
    };
    //clearAllData();

    // 광고 초기화
    const initAds = async () => {
      try {
        const adapterStatuses = await mobileAds().initialize();
        console.log('광고 초기화 완료')
        rewarded.load();
        //console.log('광고 초기화 완료', adapterStatuses);
      } catch (error) {
        console.error('광고 초기화 실패:', error);
      }
    };

    // AsyncStorage 초기화
    const initStorage = async () => {
      try {
        const storedThemes = await AsyncStorage.getItem('unlockedThemes');
        if (!storedThemes) {
          await initializeStorage();
          console.log('스토리지 초기화 완료');
        } else {
          console.log('기존 스토리지 데이터 유지');
        }
      } catch (error) {
        console.error('스토리지 초기화 실패:', error);
      }
    };

    initAds();
    initStorage();
  }, []);

  return (
    <RecoilRoot>
      <StatusBar hidden={true} />
      <ThemeInitializer />
      <AppNavigator />
    </RecoilRoot>
  );
}
