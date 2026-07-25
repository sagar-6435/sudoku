import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, isExpoGo } from '../utils/ads';
import { Board, Difficulty, checkWin, generatePuzzle } from '../utils/sudoku';

type GameContextType = {
    difficulty: Difficulty;
    initialBoard: Board;
    currentBoard: Board;
    solutionBoard: Board;
    mistakes: number;
    timeElapsed: number;
    isPaused: boolean;
    isWon: boolean;
    hintsUsed: number;
    darkTheme: boolean;
    streak: number;
    selectedCell: [number, number] | null;
    startNewGame: (diff: Difficulty) => void;
    makeMove: (num: number) => void;
    undo: () => void;
    erase: () => void;
    hint: () => void;
    togglePause: () => void;
    continueAfterError: () => void;
    setSelectedCell: (cell: [number, number] | null) => void;
    setDarkTheme: (val: boolean) => void;
    saveGame: () => Promise<void>;
    loadGame: () => Promise<boolean>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [initialBoard, setInitialBoard] = useState<Board>([]);
    const [currentBoard, setCurrentBoard] = useState<Board>([]);
    const [solutionBoard, setSolutionBoard] = useState<Board>([]);
    const [mistakes, setMistakes] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [history, setHistory] = useState<Board[]>([]);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [darkTheme, setDarkThemeState] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const initializeApp = async () => {
            // Theme
            const d = await AsyncStorage.getItem('darkTheme');
            if (d !== null) setDarkThemeState(d === 'true');

            // Streak
            const today = new Date().toDateString();
            const lastPlayed = await AsyncStorage.getItem('lastPlayedDate');
            let currentStreak = parseInt(await AsyncStorage.getItem('currentStreak') || '0', 10);

            if (lastPlayed !== today) {
                if (lastPlayed) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastPlayed === yesterday.toDateString()) {
                        currentStreak += 1;
                    } else {
                        currentStreak = 0; // broken streak
                    }
                } else {
                    currentStreak = 1; // first time
                }
                await AsyncStorage.setItem('lastPlayedDate', today);
                await AsyncStorage.setItem('currentStreak', currentStreak.toString());
            }
            setStreak(currentStreak);

            // Notifications
            try {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: false,
                        shouldShowBanner: true,
                        shouldShowList: true
                    } as any),
                });

                const { status } = await Notifications.requestPermissionsAsync();
                if (status === 'granted') {
                    await Notifications.cancelAllScheduledNotificationsAsync();
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "🔥 Keep your streak alive!",
                            body: "It's time to solve a Sudoku puzzle. Don't lose your daily streak!",
                        },
                        trigger: {
                            seconds: 7200, // 2 hours
                            repeats: true,
                        } as any,
                    });
                }
            } catch (e) {
                console.error("Notification setup error", e);
            }
        };

        initializeApp();
    }, []);

    const setDarkTheme = (val: boolean) => {
        setDarkThemeState(val);
        AsyncStorage.setItem('darkTheme', val.toString());
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (!isPaused && !isWon && currentBoard.length > 0) {
            timer = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPaused, isWon, currentBoard]);

    const startNewGame = (diff: Difficulty) => {
        const { initialBoard, solutionBoard } = generatePuzzle(diff);
        setDifficulty(diff);
        setInitialBoard(initialBoard);
        setCurrentBoard(initialBoard.map(row => [...row]));
        setSolutionBoard(solutionBoard);
        setMistakes(0);
        setTimeElapsed(0);
        setIsPaused(false);
        setIsWon(false);
        setSelectedCell(null);
        setHistory([]);
        setHintsUsed(0);
    };

    const makeMove = (num: number) => {
        if (!selectedCell || isWon || isPaused) return;
        const [r, c] = selectedCell;

        // Can't edit initial board cells
        if (initialBoard[r][c] !== null) return;

        // Check if same as current
        if (currentBoard[r][c] === num) return;

        // Check mistake
        if (solutionBoard[r][c] !== num) {
            setMistakes((m) => m + 1);
        }

        setHistory((prev) => [...prev, currentBoard.map(row => [...row])]);
        const newBoard = currentBoard.map(row => [...row]);
        newBoard[r][c] = num;
        setCurrentBoard(newBoard);

        if (checkWin(newBoard, solutionBoard)) {
            setIsWon(true);
        }
    };

    const undo = () => {
        if (history.length > 0) {
            const prevBoard = history[history.length - 1];
            setCurrentBoard(prevBoard);
            setHistory((prev) => prev.slice(0, -1));
        }
    };

    const erase = () => {
        if (!selectedCell || isWon || isPaused) return;
        const [r, c] = selectedCell;
        if (initialBoard[r][c] === null && currentBoard[r][c] !== null) {
            setHistory((prev) => [...prev, currentBoard.map(row => [...row])]);
            const newBoard = currentBoard.map(row => [...row]);
            newBoard[r][c] = null;
            setCurrentBoard(newBoard);
        }
    };

    const hint = () => {
        if (isWon || isPaused) return;

        if (hintsUsed >= 1) {
            import('react-native').then(({ Alert }) => {
                Alert.alert(
                    "Out of Free Hints",
                    "Would you like to watch an ad to get another hint?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Watch Ad",
                            onPress: () => {
                                if (isExpoGo) {
                                    import('react-native').then(({ Alert }) => {
                                        Alert.alert("Expo Go", "Watching simulated Ad...");
                                        setTimeout(() => executeHintLogic(), 2000);
                                    });
                                    return;
                                }

                                const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
                                    requestNonPersonalizedAdsOnly: true
                                });
                                rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
                                    rewarded.show();
                                });
                                rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                                    executeHintLogic();
                                });
                                rewarded.load();
                            }
                        }
                    ]
                );
            });
            return;
        }

        executeHintLogic();
    };

    const executeHintLogic = () => {
        let r = -1;
        let c = -1;

        if (selectedCell) {
            const [selR, selC] = selectedCell;
            if (initialBoard[selR][selC] === null && currentBoard[selR][selC] !== solutionBoard[selR][selC]) {
                r = selR;
                c = selC;
            }
        }

        if (r === -1 || c === -1) {
            const availableCells = [];
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (initialBoard[i][j] === null && currentBoard[i][j] !== solutionBoard[i][j]) {
                        availableCells.push([i, j]);
                    }
                }
            }
            if (availableCells.length > 0) {
                const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
                r = randomCell[0];
                c = randomCell[1];
                setSelectedCell([r, c]);
            }
        }

        if (r !== -1 && c !== -1) {
            const correctNum = solutionBoard[r][c]!;
            setHistory((prev) => [...prev, currentBoard.map(row => [...row])]);
            const newBoard = currentBoard.map(row => [...row]);
            newBoard[r][c] = correctNum;
            setCurrentBoard(newBoard);
            setHintsUsed((prev) => prev + 1);

            if (checkWin(newBoard, solutionBoard)) {
                setIsWon(true);
            }
        }
    };

    const togglePause = () => setIsPaused(!isPaused);

    const continueAfterError = () => {
        setMistakes(0);
    };

    const saveGame = async () => {
        try {
            const state = {
                difficulty, initialBoard, currentBoard, solutionBoard,
                mistakes, timeElapsed, isPaused, history, hintsUsed
            };
            await AsyncStorage.setItem('savedGame', JSON.stringify(state));
        } catch (e) {
            console.error(e);
        }
    };

    const loadGame = async (): Promise<boolean> => {
        try {
            const data = await AsyncStorage.getItem('savedGame');
            if (data) {
                const state = JSON.parse(data);
                setDifficulty(state.difficulty);
                setInitialBoard(state.initialBoard);
                setCurrentBoard(state.currentBoard);
                setSolutionBoard(state.solutionBoard);
                setMistakes(state.mistakes);
                setTimeElapsed(state.timeElapsed);
                setIsPaused(state.isPaused);
                setHistory(state.history);
                setHintsUsed(state.hintsUsed || 0);
                setIsWon(false);
                return true;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    };

    return (
        <GameContext.Provider value={{
            difficulty, initialBoard, currentBoard, solutionBoard, mistakes,
            timeElapsed, isPaused, isWon, hintsUsed, selectedCell, darkTheme, streak,
            startNewGame, makeMove, undo, erase, hint, togglePause, continueAfterError, setSelectedCell, setDarkTheme,
            saveGame, loadGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
