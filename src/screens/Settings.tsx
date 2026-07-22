import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdBanner from '../components/AdBanner';
import { useGame } from '../context/GameContext';

export default function Settings() {
    const navigation = useNavigation();
    const { darkTheme, setDarkTheme } = useGame();
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        // Load settings from storage
        const loadSettings = async () => {
            const s = await AsyncStorage.getItem('soundEnabled');
            if (s !== null) setSoundEnabled(s === 'true');
        };
        loadSettings();
    }, []);

    const toggleSound = async (val: boolean) => {
        setSoundEnabled(val);
        await AsyncStorage.setItem('soundEnabled', val.toString());
    };

    const toggleTheme = (val: boolean) => {
        setDarkTheme(val);
    };

    const resetProgress = async () => {
        await AsyncStorage.removeItem('savedGame');
        alert('Progress reset successfully');
    };

    return (
        <SafeAreaView style={[styles.container, darkTheme && styles.containerDark]}>
            <View style={[styles.header, darkTheme && styles.headerDark]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#007bff" />
                </TouchableOpacity>
                <Text style={[styles.title, darkTheme && styles.textDark]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={[styles.settingRow, darkTheme && styles.rowDark]}>
                    <Text style={[styles.settingText, darkTheme && styles.textDarkSub]}>Sound Effects</Text>
                    <Switch value={soundEnabled} onValueChange={toggleSound} />
                </View>
                <View style={[styles.settingRow, darkTheme && styles.rowDark]}>
                    <Text style={[styles.settingText, darkTheme && styles.textDarkSub]}>Dark Theme</Text>
                    <Switch value={darkTheme} onValueChange={toggleTheme} />
                </View>

                <TouchableOpacity style={styles.resetBtn} onPress={resetProgress}>
                    <Text style={styles.resetBtnText}>Reset Progress</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, darkTheme && styles.textDarkSub]}>
                        Developed by webgenixx ❤️
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1 }} />
            <AdBanner />
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    backBtn: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#343a40',
    },
    content: {
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    settingText: {
        fontSize: 18,
        color: '#495057',
    },
    resetBtn: {
        marginTop: 40,
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetBtnText: {
        color: '#fff',
        fontSize: 16,
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
        color: '#ffffff',
    },
    textDarkSub: {
        color: '#e0e0e0',
    },
    rowDark: {
        borderBottomColor: '#333',
    },
    footer: {
        marginTop: 50,
        alignItems: 'center',
    },
    footerText: {
        color: '#6c757d',
        fontSize: 14,
        letterSpacing: 1,
    },
});
