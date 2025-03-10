import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../store/themeState';
import { saveDataToAppGroup } from './SharedPreferences';
import { themes } from '../data/themes';

const THEME_STORAGE_KEY = 'unlockedThemes';

export const initializeStorage = async () => {
  try {
    const storedThemes = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (storedThemes === null) {
      // 초기 상태 설정
      const initialThemes: Theme[] = themes;
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(initialThemes));

      // App Group에 초기 선택된 테마 저장
      const defaultTheme = initialThemes.find(theme => theme.isSelected);
      if (defaultTheme) {
        await saveDataToAppGroup('selectedTheme', JSON.stringify(defaultTheme));
        await saveDataToAppGroup('colors', JSON.stringify(defaultTheme.colors.primary));
        console.log('초기 테마가 App Group에 저장되었습니다.');
      }

      await saveDataToAppGroup('widgetBackgroundColor', '#000000');
    }
  } catch (error) {
    console.error('스토리지 초기화 실패:', error);
  }
};

export const loadThemes = async (): Promise<Theme[]> => {
  try {
    const storedThemes = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return storedThemes ? JSON.parse(storedThemes) : [];
  } catch (error) {
    console.error('테마 로드 중 오류 발생:', error);
    return [];
  }
};

export const saveThemes = async (themes: Theme[]) => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themes));

    // App Group에 선택된 테마 저장
    const selectedTheme = themes.find(theme => theme.isSelected);
    if (selectedTheme) {
      await saveDataToAppGroup('selectedTheme', JSON.stringify(selectedTheme));
      await saveDataToAppGroup('colors', JSON.stringify(selectedTheme.colors.primary));
      console.log('Saved colors:', JSON.stringify(selectedTheme.colors.primary));
      console.log('선택된 테마가 App Group에 저장되었습니다.');
    }
  } catch (error) {
    console.error('테마 저장 중 오류 발생:', error);
  }
};