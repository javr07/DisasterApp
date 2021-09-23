// MAIN IMPORTS
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const isAndroid = Platform.OS === 'android';

// COMPONENT IMPORTS
import LoginForm from '../components/Forms/LoginForm';

// CONTEXT

const LoginScreen = ({ navigation, rootStore }) => {
	const { configStore, authStore, mapStore } = rootStore;
	const { t } = useTranslation();
	const [initialValue, setInitialValue] = useState({
		email: '',
		password: ''
	});

	// FUNCTIONS
	const __handleLoginErrors = (errors) => {
		if (errors.email) {
			Alert.alert(t('login.error'), `${errors.email}`, [ { text: 'OK' } ]);
		} else {
			Alert.alert(t('login.error'), `${errors.password}`, [ { text: 'OK' } ]);
		}
	};

	const __handleSubmit = async (values, actions) => {
		try {
			const user = await authStore.login(values.email, values.password, actions);
			if (user?.user) {
				if (user.user.emailVerified) {
					console.log('Envío a mapa');
					navigation.navigate('Main', { screen: 'Map' });
				} else {
					Alert.alert(t('login.emailValidation'), t('login.newEmailValidationCode'), [
						{
							text    : t('login.newEmailValidationConfirmation'),
							onPress : async () => {
								await user
									.sendEmailVerification()
									.then(function() {
										console.log('Envío de código de verificación exitoso.');
									})
									.catch(function(error) {
										console.log(error);
									});
							}
						},
						{
							text    : t('msg.cancel'),
							onPress : () => console.log('Envío de código de verificación cancelado.')
						}
					]);
					authStore.logout();
				}
			} else {
				if (user.code == 'auth/user-disabled') {
					Alert.alert(t('login.error'), t('login.error.disabled'), [ { text: 'OK' } ]);
				} else if (user.code == 'auth/wrong-password') {
					Alert.alert(t('login.error'), t('login.error.password'), [ { text: 'OK' } ]);
				} else if (user.code == 'auth/user-not-found') {
					Alert.alert(t('login.error'), t('login.error.noUser'), [ { text: 'OK' } ]);
				} else if (user.code == 'auth/too-many-requests') {
					Alert.alert(t('login.error'), t('login.error.blocked'), [ { text: 'OK' } ]);
				} else {
					Alert.alert(t('login.error'), `${user.code}`, [ { text: 'OK' } ]);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getPosition = async () => {
		let permission = await Location.requestForegroundPermissionsAsync();
		if (permission.status !== 'granted') {
			console.log(permission);
		} else {
			console.log('Permission granted: ', permission.granted);
			let location
			try{
				location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
				console.log('Highest accuracy location');
			} catch (error) {
				try{
					location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
					console.log('Lowest accuracy location');
				} catch(error) {
					location = await Location.getLastKnownPositionAsync();
					console.log('Backup location');
				}
			}
			if (location) {
				const initialRegion = {
					latitude       : location.coords.latitude,
					longitude      : location.coords.longitude,
					latitudeDelta  : 0.009,
					longitudeDelta : 0.009
				};
				configStore.setInitialPosition(initialRegion);
			}
			console.log('Location: ', location);
		}
	};

	const __handleChangeLanguage = (e) => {
		configStore.setPersistentLanguage(e);
	};

	// USEEFFECT
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			authStore.getEmail().then((mail) => {
				setInitialValue({
					email: mail? mail : '',
					password: ''
				})
			})
			getPosition();
			configStore.getPersistentConfigObject();
			configStore.getPersistentLanguage();
			mapStore.getPersistentTransformers();
			mapStore.getPersistentMeters();
			mapStore.getPersistentMetersAssigned();
			configStore.setCurrentScreen('Login Screen');
			return unsubscribe;
		});
	}, []);
	// LOGIN SCHEMA
	const LoginSchema = Yup.object().shape({
		email    : Yup.string().email(t('login.schema.email')).required(t('login.schema.email.required')),
		password : Yup.string().required(t('login.schema.password'))
	});
	// COMPONENT JSX
	return (
		<Formik
			enableReinitialize={true}
			initialValues={initialValue}
			validateOnMount={true}
			validationSchema={LoginSchema}
			onSubmit={(values, actions) => {
				__handleSubmit(values, actions);
			}}
		>
			{({ handleChange, handleBlur, handleSubmit, values, touched, isValid, errors }) => (
				<View style={styles.container}>
					{
						!isAndroid ? <KeyboardAwareScrollView
							behavior={

									isAndroid ? 'position' :
									'position'
							}
							contentContainerStyle={{
								flex      :
									isAndroid ? 0 :
									1,
								flexBasis : '100%'
							}}
							enableOnAndroid={false}
							style={{ flex: 1, flexDirection: 'column' }}
						>
							<LoginForm
								authStore={authStore}
								t={t}
								__handleLoginErrors={__handleLoginErrors}
								__handleChangeLanguage={__handleChangeLanguage}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								touched={touched}
								values={values}
								isValid={isValid}
								errors={errors}
								navigation={navigation}
							/>
						</KeyboardAwareScrollView> :
						<KeyboardAwareScrollView
							contentContainerStyle={{
								flex      :
									1
							}}
						>
							<LoginForm
									authStore={authStore}
									t={t}
									__handleLoginErrors={__handleLoginErrors}
									__handleChangeLanguage={__handleChangeLanguage}
									handleChange={handleChange}
									handleBlur={handleBlur}
									handleSubmit={handleSubmit}
									touched={touched}
									values={values}
									isValid={isValid}
									errors={errors}
									navigation={navigation}
								/>
						</KeyboardAwareScrollView>}
				</View>
			)}
		</Formik>
	);
};

const styles = StyleSheet.create({
	container : {
		flex: 1
	}
});

export default inject('rootStore')(observer(LoginScreen));
