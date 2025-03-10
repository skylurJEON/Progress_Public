import { NativeModules } from 'react-native';

// NativeModules에서 네이티브 모듈 불러오기
const { SharedPreferencesModule } = NativeModules;

if (!SharedPreferencesModule) {
    console.error("SharedPreferencesModule is null. Check native module setup.");
  }

// 데이터 저장 함수
export const saveDataToAppGroup = async (key: string, value: string): Promise<void> => {
  try {
    await SharedPreferencesModule.saveData(key, value);
    console.log('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// 데이터 가져오기 함수
export const getDataFromAppGroup = async (key: string): Promise<string | null> => {
  try {
    const value: string = await SharedPreferencesModule.getData(key);
    return value;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const refreshWidgets = () => {
    try {
      SharedPreferencesModule.reloadWidgetTimelines();
      console.log('Widget timelines reloaded successfully!');
    } catch (error) {
      console.error('Failed to reload widget timelines:', error);
    }
};

export const test = () => {
    try{
        SharedPreferencesModule.simpleTest();
    }catch(error){
        console.error('Failed to reload widget timelines:', error);
    }
};

// TypeScript에서 사용할 기본 내보내기
export default {
  saveDataToAppGroup,
  getDataFromAppGroup,
  refreshWidgets,
};