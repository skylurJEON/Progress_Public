import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRecoilState } from 'recoil';
import { themesState, Theme } from '../store/themeState';
import { showRewardedAd, rewarded } from '../utils/adUtils';
import { loadThemes, saveThemes } from '../utils/storage';
import LinearGradient from 'react-native-linear-gradient';
import { saveDataToAppGroup, getDataFromAppGroup, refreshWidgets } from '../utils/SharedPreferences';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { SharedPreferencesModule } = NativeModules;
type RootStackParamList = {
  HomeScreen: undefined;
  ThemeScreen: undefined;
};

export default function ThemeScreen() {
  const [themes, setThemes] = useRecoilState(themesState);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchThemes = async () => {

      console.log('SharedPreferencesModule : ', Object.keys(SharedPreferencesModule));
      const loadedThemes = await loadThemes();
      if (loadedThemes.length > 0) {
        setThemes(loadedThemes);
      }
    };

    rewarded.load();
    fetchThemes();

  }, [setThemes]);

  const handleUnlockTheme = async (themeId: string) => {
    const success = await showRewardedAd(themeId);
    if (success) {
      const updatedThemes = themes.map(theme =>
        theme.id === themeId ? { ...theme, isUnlocked: true } : theme
      );
      setThemes(updatedThemes);
      await saveThemes(updatedThemes);
     
      // 광고 시청 후 바로 테마 적용 및 홈 화면으로 이동
      await handleSelectTheme(themeId);
      //navigation.navigate('HomeScreen');
    }
   
  };

  const handleSelectTheme = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    if (!theme.isUnlocked) {
      handleUnlockTheme(themeId);
      return;
    }
    console.log('선택된 테마', themeId);
    const updatedThemes = themes.map(theme => ({
      ...theme,
      isSelected: theme.id === themeId,
    }));
    setThemes(updatedThemes);
    saveThemes(updatedThemes); // AsyncStorage에 저장

    // 선택된 테마 데이터를 App Group에 저장
    const selectedTheme = updatedThemes.find(theme => theme.id === themeId);
    if (selectedTheme) {
      try {
        await saveDataToAppGroup('selectedTheme', JSON.stringify(selectedTheme));
        await saveDataToAppGroup("colors", JSON.stringify(selectedTheme.colors.primary));
        console.log('Selected theme saved to App Group');

        await checkAppGroupData();
        refreshWidgets();

      } catch (error) {
        console.error('Failed to save theme to App Group:', error);
      }

      rewarded.load();
    }
    // 테마 적용 후 홈 화면으로 이동
    navigation.navigate('HomeScreen');
    
  };

  const checkAppGroupData = async () => {
    try {
      const themeData = await getDataFromAppGroup('selectedTheme');
      console.log('App Group에서 불러온 데이터:', themeData);
    } catch (error) {
      console.error('App Group 데이터 확인 오류:', error);
    }
  };

  const renderItem = ({ item }: { item: Theme }) => (
    <TouchableOpacity onPress={() => handleSelectTheme(item.id)}>
      <View style={styles.themeItem}>
        <View style={styles.themePreview}>
          {item.colors.primary.length > 1 ? (
            <LinearGradient
              colors={item.colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.miniProgressBar}
            />
          ) : (
            <View style={[styles.miniProgressBar, { backgroundColor: item.colors.primary[0] }]} />
          )}
        </View>
        <Text style={{ color: 'black', fontSize: 14 }}>
          {t(item.name)}</Text>
        <Text style={styles.unlockedText}>
          {item.isUnlocked ? t('themeUse') : t('themeUnlock')}
        </Text>
      </View>
    </TouchableOpacity>
    
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={themes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: '20%',
    backgroundColor: 'transparent',
  },
  listContainer: {
    paddingBottom: 20,
  },
  themeItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android
  },
  unlockButton: {
    color: '#1E90FF',
    marginTop: 5,
  },
  unlockedText: {
    marginTop: 5,
    color: 'black',
    fontWeight: '600',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8, 
  },
  themePreview: {
    width: '80%',
    height: 15,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 10,
    marginTop: '2%', 
  },
  miniProgressBar: {
    width: '90%',
    height: '90%',
    borderRadius: 15,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8, 
  },
});