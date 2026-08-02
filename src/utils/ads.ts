
export const isExpoGo = true;

let BannerAd: any = () => null;
let RewardedAd: any = null;
let useInterstitialAd: any = () => ({ isLoaded: false, load: () => { }, show: () => { } });
let RewardedAdEventType: any = { LOADED: 'loaded', EARNED_REWARD: 'rewarded' };
let BannerAdSize: any = { ANCHORED_ADAPTIVE_BANNER: 'ADAPTIVE' };
let TestIds: any = { BANNER: 'test', INTERSTITIAL: 'test', REWARDED: 'test' };

if (!isExpoGo) {
    // Ads removed for now
}

export { BannerAd, BannerAdSize, RewardedAd, RewardedAdEventType, TestIds, useInterstitialAd };

