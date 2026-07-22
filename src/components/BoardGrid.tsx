import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 9;

export default function BoardGrid() {
    const { currentBoard, initialBoard, selectedCell, setSelectedCell, solutionBoard, darkTheme } = useGame();

    return (
        <View style={[styles.board, darkTheme && styles.boardDark]}>
            {currentBoard.map((row, r) => (
                <View key={r} style={styles.row}>
                    {row.map((cell, c) => {
                        const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                        const isInitial = initialBoard[r][c] !== null;
                        const isMistake = cell !== null && cell !== solutionBoard[r][c];

                        // 3x3 grid borders styling check
                        const addBottomBorder = r === 2 || r === 5;
                        const addRightBorder = c === 2 || c === 5;

                        return (
                            <TouchableOpacity
                                key={`${r}-${c}`}
                                style={[
                                    styles.cell,
                                    darkTheme && styles.cellDark,
                                    isSelected && (darkTheme ? styles.selectedCellDark : styles.selectedCell),
                                    addBottomBorder && [styles.bottomBorder, darkTheme && styles.thickBorderDark],
                                    addRightBorder && [styles.rightBorder, darkTheme && styles.thickBorderDark],
                                ]}
                                onPress={() => setSelectedCell([r, c])}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.cellText,
                                    darkTheme && styles.cellTextDark,
                                    isInitial && [styles.initialText, darkTheme && styles.initialTextDark],
                                    isMistake && styles.mistakeText
                                ]}>
                                    {cell !== null ? cell : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        borderWidth: 2,
        borderColor: '#343a40',
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 0.5,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCell: {
        backgroundColor: '#b3d4ff',
    },
    bottomBorder: {
        borderBottomWidth: 2,
        borderBottomColor: '#343a40',
    },
    rightBorder: {
        borderRightWidth: 2,
        borderRightColor: '#343a40',
    },
    cellText: {
        fontSize: 20,
        color: '#0055ff',
    },
    initialText: {
        color: '#343a40',
        fontWeight: 'bold',
    },
    mistakeText: {
        color: '#e63946',
    },
    boardDark: {
        backgroundColor: '#1e1e1e',
        borderColor: '#555555',
    },
    cellDark: {
        borderColor: '#333333',
    },
    selectedCellDark: {
        backgroundColor: '#004085',
    },
    thickBorderDark: {
        borderColor: '#555555',
    },
    cellTextDark: {
        color: '#66b2ff',
    },
    initialTextDark: {
        color: '#ffffff',
    },
});
