import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useGame } from '../context/GameContext';

export default function AdBanner() {
    const { darkTheme } = useGame();
    // Use test ID universally for now so build doesn't crash without real ad unit
    const adUnitId = TestIds.BANNER;

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
