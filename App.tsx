
import { GameProvider } from './src/context/GameContext';
import { AppNavigator } from './src/navigation/AppNavigator';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <GameProvider>
                <AppNavigator />
            </GameProvider>
        </SafeAreaProvider>
    );
}
