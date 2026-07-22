import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function Win() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { timeElapsed, difficulty, startNewGame, mistakes, darkTheme } = useGame();

    const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const secs = (timeElapsed % 60).toString().padStart(2, '0');

    const handleNewGame = async () => {
        // Clear saved game
        await AsyncStorage.removeItem('savedGame');
        startNewGame(difficulty);
        navigation.replace('Game');
    };

    const handleHome = async () => {
        await AsyncStorage.removeItem('savedGame');
        navigation.navigate('Home');
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
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
