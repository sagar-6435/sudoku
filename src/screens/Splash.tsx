import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function Splash() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { darkTheme } = useGame();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[styles.container, darkTheme && styles.containerDark]}>
            <Text style={styles.title}>Classic Sudoku</Text>
            <Text style={[styles.companyText, darkTheme && styles.companyTextDark]}>by webgenixx</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0055ff',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    companyText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#6c757d',
        letterSpacing: 2,
    },
    companyTextDark: {
        color: '#a0a0a0',
    },
});
