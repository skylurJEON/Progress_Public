import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { loadThemes, saveThemes } from './storage';
import { Theme } from '../store/themeState';

const adUnitId = 'ca-app-pub-YOUR_AD_ID';

// 광고 인스턴스 생성 및 사전 로딩
let rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['game', 'rewards'],
});

// 다음 광고를 미리 로드하는 함수
export const preloadNextAd = () => {
  rewarded = RewardedAd.createForAdRequest(adUnitId, {
    keywords: ['game', 'rewards'],
  });
  rewarded.load();
};

// 초기 광고 로드
preloadNextAd();

// 광고를 보여주는 함수
export const showRewardedAd = (themeId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const handleEarnedReward = async (reward: any) => {
      console.log('사용자가 보상을 받았습니다:', reward);
      // 테마 해금 로직
      const themes: Theme[] = await loadThemes();
      const updatedThemes = themes.map((theme) =>
        theme.id === themeId ? { ...theme, isUnlocked: true } : theme
      );
      await saveThemes(updatedThemes);
      resolve(true);
      removeListeners();
      preloadNextAd();
      rewarded.load();
    };

    const handleAdLoaded = () => {
      console.log('광고가 로드되었습니다.');
      //rewarded.show();
    };

    const removeListeners = () => {
      rewarded.removeAllListeners();
    };

    // 광고 이벤트 리스너 추가
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, handleAdLoaded);
    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, handleEarnedReward);
    
    // 광고 로드 및 표시
    rewarded.load();
    rewarded.show();
  });
};

export { rewarded };
