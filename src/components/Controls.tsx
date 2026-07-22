import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');
const GAP = 5;
const BTN_SIZE = (width - 40 - (8 * GAP)) / 9;

export default function Controls() {
    const { makeMove, undo, erase, hint, darkTheme } = useGame();

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <View style={styles.container}>
            <View style={styles.tools}>
                <TouchableOpacity style={[styles.toolBtn, darkTheme && styles.toolBtnDark]} onPress={undo}>
                    <Ionicons name="arrow-undo" size={24} color={darkTheme ? '#e0e0e0' : '#495057'} />
                    <Text style={[styles.toolText, darkTheme && styles.textDarkWhite]}>Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolBtn, darkTheme && styles.toolBtnDark]} onPress={erase}>
                    <FontAwesome5 name="eraser" size={20} color={darkTheme ? '#e0e0e0' : '#495057'} />
                    <Text style={[styles.toolText, darkTheme && styles.textDarkWhite]}>Erase</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toolBtn, darkTheme && styles.toolBtnDark]} onPress={hint}>
                    <Ionicons name="bulb" size={24} color={darkTheme ? '#ffc107' : '#f5b041'} />
                    <Text style={[styles.toolText, darkTheme && styles.textDarkWhite]}>Hint</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.numpad}>
                {numbers.map((num) => (
                    <TouchableOpacity key={num} style={[styles.numBtn, darkTheme && styles.numBtnDark]} onPress={() => makeMove(num)}>
                        <Text style={[styles.numText, darkTheme && styles.textDarkWhite]}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    tools: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    toolBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolText: {
        color: '#495057',
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 12,
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        gap: GAP,
        width: '100%',
    },
    numBtn: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ced4da',
    },
    numText: {
        fontSize: 20,
        color: '#212529',
    },
    toolBtnDark: {
        backgroundColor: 'transparent',
    },
    numBtnDark: {
        backgroundColor: '#1e1e1e',
        borderColor: '#333333',
    },
    textDarkWhite: {
        color: '#e0e0e0',
    },
});
