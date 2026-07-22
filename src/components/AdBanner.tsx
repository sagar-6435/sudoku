import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { BannerAd, BannerAdSize, TestIds, isExpoGo } from '../utils/ads';

export default function AdBanner() {
    const { darkTheme } = useGame();
    // Using production Banner ID provided by Webgenixx.
    // In dev mode, we automatically fall back to TestIds.BANNER to avoid Google bans for self-clicking.
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6260801095500320/6776464782';

    if (isExpoGo) {
        return (
            <View style={[styles.adWrapper, darkTheme && styles.adWrapperDark]}>
                <Text style={{ color: darkTheme ? '#a0a0a0' : '#495057', padding: 10 }}>[ Expo Go: AdBanner Placeholder ]</Text>
            </View>
        );
    }

    return (
        <View style={[styles.adWrapper, darkTheme && styles.adWrapperDark]}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    adWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderColor: '#ced4da',
        paddingVertical: 5,
    },
    adWrapperDark: {
        backgroundColor: '#1e1e1e',
        borderColor: '#333333',
    }
});
