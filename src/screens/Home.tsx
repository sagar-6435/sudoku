import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdBanner from '../components/AdBanner';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Difficulty } from '../utils/sudoku';

export default function Home() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { startNewGame, loadGame, darkTheme } = useGame();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let active = true;
            loadGame().then(exists => {
                if (active) {
                    setHasSavedGame(exists);
                }
            });
            return () => { active = false; };
        }, [loadGame])
    );

    const onStart = (diff: Difficulty) => {
        startNewGame(diff);
        navigation.navigate('Game');
    };

    const onContinue = () => {
        navigation.navigate('Game');
    };

    return (
        <View style={[styles.containerOuter, darkTheme && styles.containerOuterDark]}>
            <View style={[styles.container, darkTheme && styles.containerDark]}>
                <Text style={[styles.title, darkTheme && styles.textDark]}>Sudoku</Text>

                {hasSavedGame && (
                    <TouchableOpacity style={[styles.btn, styles.continueBtn]} onPress={onContinue}>
                        <Text style={styles.btnText}>Continue Game</Text>
                    </TouchableOpacity>
                )}

                <Text style={[styles.subtitle, darkTheme && styles.textDarkSub]}>New Game</Text>

                <TouchableOpacity style={styles.btn} onPress={() => onStart('easy')}>
                    <Text style={styles.btnText}>Easy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.mediumBtn]} onPress={() => onStart('medium')}>
                    <Text style={styles.btnText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.hardBtn]} onPress={() => onStart('hard')}>
                    <Text style={styles.btnText}>Hard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.settingsText}>Settings</Text>
                </TouchableOpacity>
            </View>
            <AdBanner />
        </View>
    );
}

const styles = StyleSheet.create({
    containerOuter: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    containerOuterDark: {
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#343a40',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6c757d',
        marginTop: 20,
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#4caf50',
        width: 200,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    continueBtn: {
        backgroundColor: '#2196f3',
    },
    mediumBtn: {
        backgroundColor: '#ff9800',
    },
    hardBtn: {
        backgroundColor: '#f44336',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingsBtn: {
        marginTop: 40,
    },
    settingsText: {
        fontSize: 16,
        color: '#007bff',
    },
    containerDark: {
        backgroundColor: 'transparent',
    },
    textDark: {
        color: '#ffffff',
    },
    textDarkSub: {
        color: '#a0a0a0',
    },
});
