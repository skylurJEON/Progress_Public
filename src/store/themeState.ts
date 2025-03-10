import { atom } from 'recoil';
import { saveDataToAppGroup } from '../utils/SharedPreferences';
import { themes } from '../data/themes';

export interface Theme {
  id: string;
  name: string;
  isUnlocked: boolean;
  colors: {
    primary: string[];
    
  };
  isSelected: boolean;
  //backgroundImage?: string;
}

const themesStateKey = 'themesState'+Date.now();

export const themesState = atom<Theme[]>({
  key: themesStateKey,
  default: themes,
});

export const saveSelectedThemeToAppGroup = async (selectedTheme: Theme) => {
    try {
        // App Group에 전체 테마 데이터 저장
        await saveDataToAppGroup('selectedTheme', JSON.stringify(selectedTheme));

        // App Group에 primary 색상 배열만 저장
        await saveDataToAppGroup('colors', JSON.stringify(selectedTheme.colors.primary));

        console.log('Selected theme and colors saved to App Group');
    } catch (error) {
        console.error('Failed to save theme to App Group:', error);
    }
};