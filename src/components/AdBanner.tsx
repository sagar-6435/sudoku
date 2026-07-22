import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';

// ----------------------------------------------------------------------
// REAL ADMOB INTEGRATION (Uncomment when modifying for EAS Prebuild):
// ----------------------------------------------------------------------
// 1. Run: npx expo install react-native-google-mobile-ads
// 2. Add your AdMob App ID to app.json under "react-native-google-mobile-ads"
// 3. Uncomment the code below:
//
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyy';
//
// export default function AdBanner() {
//     return (
//         <View style={styles.adWrapper}>
//             <BannerAd
//                 unitId={adUnitId}
//                 size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//                 requestOptions={{ requestNonPersonalizedAdsOnly: true }}
//             />
//         </View>
//     );
// }

export default function AdBanner() {
    const { darkTheme } = useGame();

    // MOCKED FOR EXPO GO:
    return (
        <View style={[styles.container, darkTheme && styles.containerDark]}>
            <Text style={[styles.text, darkTheme && styles.textDark]}>
                [ AdMob Banner Zone ]
            </Text>
            <Text style={[styles.subText, darkTheme && styles.subTextDark]}>
                Uncomment real AdBlock Native code for actual release
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ced4da',
    },
    containerDark: {
        backgroundColor: '#1e1e1e',
        borderColor: '#333333',
    },
    text: {
        color: '#495057',
        fontWeight: 'bold',
    },
    textDark: {
        color: '#a0a0a0',
    },
    subText: {
        color: '#6c757d',
        fontSize: 10,
        marginTop: 2,
    },
    subTextDark: {
        color: '#777777',
    },
    adWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
