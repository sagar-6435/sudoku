import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let BannerAd: any = () => null;
let RewardedAd: any = null;
let useInterstitialAd: any = () => ({ isLoaded: false, load: () => { }, show: () => { } });
let RewardedAdEventType: any = { LOADED: 'loaded', EARNED_REWARD: 'rewarded' };
let BannerAdSize: any = { ANCHORED_ADAPTIVE_BANNER: 'ADAPTIVE' };
let TestIds: any = { BANNER: 'test', INTERSTITIAL: 'test', REWARDED: 'test' };

if (!isExpoGo) {
    try {
        const ads = require('react-native-google-mobile-ads');
        BannerAd = ads.BannerAd;
        RewardedAd = ads.RewardedAd;
        useInterstitialAd = ads.useInterstitialAd;
        RewardedAdEventType = ads.RewardedAdEventType;
        BannerAdSize = ads.BannerAdSize;
        TestIds = ads.TestIds;
    } catch (e) {
        console.error("Admob native not found");
    }
}

export { BannerAd, BannerAdSize, RewardedAd, RewardedAdEventType, TestIds, useInterstitialAd };

