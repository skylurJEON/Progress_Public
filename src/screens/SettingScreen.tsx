import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { getDataFromAppGroup, saveDataToAppGroup, refreshWidgets } from '../utils/SharedPreferences';

export default function SettingScreen() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng);
  };

  const changeBackgroundColor = async (color: string) => {
    setSelectedColor(color);
    await saveDataToAppGroup('widgetBackgroundColor', color);
    console.log('Widget background color changed to:', color);
    console.log(await getDataFromAppGroup('widgetBackgroundColor'));
    refreshWidgets();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language</Text>
      <View style={styles.radioInputs}>
        <Pressable 
          style={[
            styles.radio,
            selectedLang === 'ko' && styles.selectedRadio
          ]}
          onPress={() => changeLanguage('ko')}
        >
          <Text style={[
            styles.radioText,
            selectedLang === 'ko' && styles.selectedText
          ]}>한국어</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.radio,
            selectedLang === 'en' && styles.selectedRadio
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[
            styles.radioText,
            selectedLang === 'en' && styles.selectedText
          ]}>English</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.radio,
            selectedLang === 'ja' && styles.selectedRadio
          ]}
          onPress={() => changeLanguage('ja')}
        >
          <Text style={[
            styles.radioText,
            selectedLang === 'ja' && styles.selectedText
          ]}>日本語</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{t('widgetBackgroundColor')}</Text>
      <View style={styles.radioInputs}>
        <Pressable 
          style={[
            styles.radio,
            selectedColor === '#000000' && styles.selectedRadio
          ]}
          onPress={() => changeBackgroundColor('#000000')}
        >
          <Text style={[
            styles.radioText,
            selectedColor === '#000000' && styles.selectedText
          ]}>{t('black')}</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.radio,
            selectedColor === '#FFFFFF' && styles.selectedRadio
          ]}
          onPress={() => changeBackgroundColor('#FFFFFF')}
        >
          <Text style={[
            styles.radioText,
            selectedColor === '#FFFFFF' && styles.selectedText
          ]}>{t('white')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: '15%',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  radioInputs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(192, 192, 192, 0.3)',
    borderRadius: 8,
    padding: 4,
    width: 300,
    height: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  radio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectedRadio: {
    backgroundColor: '#FFF',
  },
  radioText: {
    fontSize: 14,
    color: 'rgba(51, 65, 85, 1)',
  },
  selectedText: {
    fontWeight: '600',
  }
});