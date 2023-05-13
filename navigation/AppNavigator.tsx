import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import AuthScreen from '../screens/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
    const isAuth = useSelector((state: RootState) => state.auth.token !== null && state.auth.token !== undefined);
    const didTryAutoLogin = useSelector((state: RootState) => state.auth.didTryAutoLogin);

    return (
        <NavigationContainer>
            {isAuth && <MainNavigator />}
            {!isAuth && didTryAutoLogin && <AuthScreen />}
            {!isAuth && !didTryAutoLogin && <StartUpScreen />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({

});

export default AppNavigator;