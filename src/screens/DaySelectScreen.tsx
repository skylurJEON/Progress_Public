import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function DaySelectScreen() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('updateSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
  },
});