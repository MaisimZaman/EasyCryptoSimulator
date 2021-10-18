import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./stores/rootReducer";

import Tabs from "./navigation/tabs";

import LoginScreen from './screens/auth/LoginScreen'

import RegisterScreen from './screens/auth/RegisterScreen';

import BuyCrypto from './screens/BuyCrypto';

import WithDrawCrypto from './screens/WithdrawCrypto';

const Stack = createStackNavigator();

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

const App = () => {
    const [loaded] = useFonts({
      "Roboto-Black" : require('./assets/fonts/Roboto-Black.ttf'),
      "Roboto-Bold" : require('./assets/fonts/Roboto-Bold.ttf'),
      "Roboto-Regular" : require('./assets/fonts/Roboto-Regular.ttf'),
    })

    if(!loaded){
        return null;
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName={'LoginScreen'}
                >
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                    />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                    />
                    <Stack.Screen
                        name="MainLayout"
                        component={Tabs}
                    />

                    <Stack.Screen
                        options={{headerShown: true, headerTintColor: "black"}}
                        name="BuyCrypto"
                        component={BuyCrypto}
                    />

                    <Stack.Screen
                        options={{headerShown: true, headerTintColor: "black"}}
                        name="WithDrawCrypto"
                        component={WithDrawCrypto}
                    />

                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default App;