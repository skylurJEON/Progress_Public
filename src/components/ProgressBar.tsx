import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRecoilValue } from 'recoil';
import { progressState } from '../store/progressState';
import { themesState } from '../store/themeState';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';
import { Animated, Easing } from 'react-native';
import { getCurrentDate } from '../utils/dateUtils';
import { useTranslation } from 'react-i18next';

const ProgressBar = () => {
  const { t } = useTranslation();

  const progress = useRecoilValue(progressState);
  const themes = useRecoilValue(themesState);
  const today = dayjs();
  const startOfYear = dayjs().startOf("year");
  //const progress = 80; //test

  // 현재 테마 가져오기
  const currentTheme = themes.find(theme => theme.isSelected) || themes[0];

  return (
    <View style={styles.wrapper}>
    <Text style={styles.percentage}>{progress}%</Text>
    
    <View style={styles.shadowContainer}>
      <View style={styles.container}>
        {currentTheme.colors.primary.length > 1 ? (
          <LinearGradient
            colors={currentTheme.colors.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progress, { width: `${progress}%` }]}
          />       
        ) : (
          <View
            style={[
              styles.progress,
              { width: `${progress}%`, backgroundColor: currentTheme.colors.primary[0] },
            ]}
          />
        )}     
      </View>
    </View>
    
    <Text style={styles.dayCount}>
      
      {t('progress')} {getCurrentDate().passedDays} {t('passedDays')}
    </Text>
  </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '80%',
    alignItems: 'center',
  },
  shadowContainer: {
    width: '100%',
    height: 20,
    borderRadius: 10,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 8, 
  },
  container: {
    width: '100%',
    height: '120%',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  progress: {
    height: '90%',
    width: '100%',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8, //android
  },
  percentage: {
    fontSize: 38,
    color: '#333',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
  },
  dayCount: {
    marginTop: '8%',
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },

});

export default ProgressBar;