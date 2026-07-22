import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Game from '../screens/Game';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import Splash from '../screens/Splash';
import Win from '../screens/Win';

export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Game: undefined;
    Settings: undefined;
    Win: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Win" component={Win} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
