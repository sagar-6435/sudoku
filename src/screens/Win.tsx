import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';
import AdBanner from '../components/AdBanner';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function Win() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { timeElapsed, difficulty, startNewGame, mistakes, darkTheme } = useGame();

    // Interstitial Ad setup
    const interstitial = useInterstitialAd(TestIds.INTERSTITIAL);

    useEffect(() => {
        const checkCountAndLoad = async () => {
            const countStr = await AsyncStorage.getItem('winCount');
            const count = countStr ? parseInt(countStr, 10) : 0;
            // Show every 2 games
            if (count % 2 === 0) {
                interstitial.load();
            }
            await AsyncStorage.setItem('winCount', (count + 1).toString());
        };
        checkCountAndLoad();
    }, []);

    const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const secs = (timeElapsed % 60).toString().padStart(2, '0');

    const triggerAdThen = (callback: () => void) => {
        if (interstitial.isLoaded) {
            interstitial.show();
            // In a real app we'd wait for the ad to close. 
            // For now, we perform action immediately as it overlays anyway.
        }
        callback();
    };

    const handleNewGame = async () => {
        await AsyncStorage.removeItem('savedGame');
        triggerAdThen(() => {
            startNewGame(difficulty);
            navigation.replace('Game');
        });
    };

    const handleHome = async () => {
        await AsyncStorage.removeItem('savedGame');
        triggerAdThen(() => {
            navigation.navigate('Home');
        });
    };

    return (
        <View style={[styles.container, darkTheme && styles.containerDark]}>
            <Text style={[styles.title, darkTheme && styles.textDarkGreen]}>You Won!</Text>

            <View style={styles.stats}>
                <Text style={[styles.statText, darkTheme && styles.textDarkWhite]}>Difficulty: {difficulty}</Text>
                <Text style={[styles.statText, darkTheme && styles.textDarkWhite]}>Time: {mins}:{secs}</Text>
                <Text style={[styles.statText, darkTheme && styles.textDarkWhite]}>Mistakes: {mistakes}</Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleNewGame}>
                <Text style={styles.btnText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.homeBtn]} onPress={handleHome}>
                <Text style={styles.btnText}>Home</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, maxHeight: 40 }} />
            <AdBanner />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingTop: 40,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 40,
    },
    stats: {
        marginBottom: 40,
        alignItems: 'center',
    },
    statText: {
        fontSize: 20,
        color: '#495057',
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#007bff',
        width: 200,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    homeBtn: {
        backgroundColor: '#6c757d',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    textDarkGreen: {
        color: '#4ade80',
    },
    textDarkWhite: {
        color: '#e0e0e0',
    },
});
