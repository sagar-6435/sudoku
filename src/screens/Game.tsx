import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Alert, AppState, AppStateStatus, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdBanner from '../components/AdBanner';
import BoardGrid from '../components/BoardGrid';
import Controls from '../components/Controls';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RewardedAd, RewardedAdEventType, TestIds, isExpoGo } from '../utils/ads';

export default function Game() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { timeElapsed, mistakes, difficulty, togglePause, isWon, saveGame, isPaused, startNewGame, darkTheme, continueAfterError } = useGame();

    useEffect(() => {
        if (mistakes >= 3) {
            Alert.alert(
                "Game Over",
                "You've made 3 mistakes.",
                [
                    {
                        text: "Watch Ad & Continue",
                        onPress: () => {
                            if (isExpoGo) {
                                Alert.alert("Expo Go", "Watching simulated Ad...");
                                setTimeout(() => continueAfterError(), 2000);
                                return;
                            }
                            const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
                                requestNonPersonalizedAdsOnly: true
                            });
                            rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
                                rewarded.show();
                            });
                            rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                                continueAfterError();
                            });
                            rewarded.load();
                        }
                    },
                    {
                        text: "Restart",
                        style: "destructive",
                        onPress: () => {
                            startNewGame(difficulty);
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }, [mistakes, difficulty, startNewGame]);

    // Format MM:SS
    const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const secs = (timeElapsed % 60).toString().padStart(2, '0');

    useEffect(() => {
        if (isWon) {
            navigation.navigate('Win');
        }
    }, [isWon, navigation]);

    // Handle app background to save game
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState.match(/inactive|background/)) {
                saveGame();
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [saveGame]);

    const handlePause = () => {
        togglePause();
    };

    const handleBack = () => {
        saveGame().then(() => {
            navigation.goBack();
        });
    };

    return (
        <SafeAreaView style={[styles.container, darkTheme && styles.containerDark]}>
            <View style={[styles.header, darkTheme && styles.headerDark]}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="#007bff" />
                </TouchableOpacity>
                <View style={styles.info}>
                    <Text style={[styles.infoText, darkTheme && styles.textDark]}>{difficulty.toUpperCase()}</Text>
                    <Text style={[styles.infoText, darkTheme && styles.textDark]}>Mistakes: {mistakes}/3</Text>
                    <Text style={[styles.infoText, darkTheme && styles.textDark]}>{mins}:{secs}</Text>
                </View>
                <TouchableOpacity onPress={handlePause}>
                    <Text style={styles.headerBtn}>Pause</Text>
                </TouchableOpacity>
            </View>

            {isPaused ? (
                <View style={styles.pauseOverlay}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.pauseTitle, darkTheme && styles.textDarkWhite]}>Game Paused</Text>
                        <TouchableOpacity style={styles.resumeBtn} onPress={togglePause}>
                            <Text style={styles.resumeText}>Resume</Text>
                        </TouchableOpacity>
                    </View>
                    <AdBanner />
                </View>
            ) : (
                <>
                    <View style={styles.boardContainer}>
                        <BoardGrid />
                    </View>
                    <View style={styles.controlsContainer}>
                        <Controls />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    headerBtn: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    info: {
        flexDirection: 'row',
        gap: 15,
    },
    infoText: {
        color: '#495057',
        fontWeight: 'bold',
    },
    boardContainer: {
        padding: 20,
        alignItems: 'center',
    },
    controlsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    pauseOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#343a40',
    },
    resumeBtn: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        width: 200,
        alignItems: 'center',
    },
    resumeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    headerDark: {
        backgroundColor: '#1e1e1e',
        borderBottomColor: '#333',
    },
    textDark: {
        color: '#e0e0e0',
    },
    textDarkWhite: {
        color: '#ffffff',
    },
});
