// MAIN IMPORTS
import React from 'react';
import { StatusBar, SafeAreaView, Platform } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import '../i18n';
// STYLE IMPORTS
import styled from 'styled-components/native';

// COMPONENTS IMPORTS
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

// DEVICE CONST
const isAndroid = Platform.OS === 'android';

// STYLED COMPONENTS
const SafeAreaViewStyled = styled(SafeAreaView)`
flex:1;
${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`};
`;

function MainAppComponent({ navigation }) {
	// SCREENS STACK
	const LoginStack = createStackNavigator();

	// CLOSE DRAWER ON INIT
	() => navigation.closeDrawer();

	// CUSTOM THEME FOR SCREENS
	const CustomTheme = {
		...DefaultTheme,
		colors : {
			...DefaultTheme.colors,
			background :
				isAndroid ? '#FFF' :
				'#14115f'
		}
	};

	return (
		<SafeAreaViewStyled>
			<NavigationContainer theme={CustomTheme}>
				<LoginStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
					<LoginStack.Screen name="Login" component={LoginScreen} />
					<LoginStack.Screen name="Register" component={RegisterScreen} />
					<LoginStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
					<LoginStack.Screen name="Main" component={MainScreen} />
				</LoginStack.Navigator>
			</NavigationContainer>
		</SafeAreaViewStyled>
	);
}

export default MainAppComponent;
