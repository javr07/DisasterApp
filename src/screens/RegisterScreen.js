// MAIN IMPORTS
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// COMPONENTS IMPORTS
import RegisterForm from '../components/Forms/RegisterForm';

const isAndroid = Platform.OS === 'android';

function RegisterScreen({ navigation, rootStore }) {
	// STATES
	const { configStore, authStore } = rootStore;
	const { showPassword } = authStore;
	const { t } = useTranslation();

	// FUNCTIONS

	const __handleSubmit = async (values) => {
		try {
			const user = await authStore.register(values.email, values.password, values.username);
			if (user.user) {
				if (user.user.emailVerified) {
					console.log('Envío a mapa');
					navigation.navigate('Main', { screen: 'Map' });
				} else {
					console.log('Envío a login');
					navigation.navigate('Login');
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const __handleRegisterErrors = (errors) => {
		if (errors.username) {
			Alert.alert(t('register.error'), `${errors.username}`, [ { text: 'OK' } ]);
		} else if (errors.email) {
			Alert.alert(t('register.error'), `${errors.email}`, [ { text: 'OK' } ]);
		} else if (errors.password) {
			Alert.alert(t('register.error'), `${errors.password}`, [ { text: 'OK' } ]);
		} else {
			Alert.alert(t('register.error'), `${errors.confirmPassword}`, [ { text: 'OK' } ]);
		}
	};

	// REGISTER SCHEMA
	const RegisterSchema = Yup.object().shape({
		username        : Yup.string()
			.required(t('login.schema.username'))
			.min(4, t('login.schema.username.min'))
			.max(18, t('login.schema.username.max')),
		email           : Yup.string().email(t('login.schema.email')).required(t('login.schema.email.required')),
		password        : Yup.string()
			.min(8, t('login.schema.password.min'))
			.max(18, t('login.schema.password.max'))
			.required(t('login.schema.password'))
			.matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})', t('login.schema.password.regex')),
		confirmPassword : Yup.string()
			.required(t('login.schema.password.match'))
			.oneOf([ Yup.ref('password'), null ], t('login.schema.password.match'))
	});

	useEffect(() => {
		configStore.setCurrentScreen('Register Screen');
	}, []);

	// COMPONENT JSX
	return (
		<Formik
			initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
			validateOnMount={true}
			validationSchema={RegisterSchema}
			onSubmit={(values) => __handleSubmit(values)}
		>
			{({ handleChange, handleBlur, handleSubmit, values, touched, isValid, errors }) => (
				<View style={styles.container}>
					{
						!isAndroid ? <KeyboardAwareScrollView
							behavior={

									isAndroid ? 'padding' :
									'position'
							}
							style={{ flex: 1 }}
							contentContainerStyle={{
								flex      :
									isAndroid ? 0 :
									1,
								flexBasis : '100%'
							}}
							extraHeight={250}
						>
							<RegisterForm
								navigate={navigation.navigate}
								showPassword={showPassword}
								t={t}
								__handleRegisterErrors={__handleRegisterErrors}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								values={values}
								touched={touched}
								isValid={isValid}
								errors={errors}
							/>
						</KeyboardAwareScrollView> :
						<View style={styles.container}>
							<RegisterForm
								navigate={navigation.navigate}
								showPassword={showPassword}
								t={t}
								__handleRegisterErrors={__handleRegisterErrors}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								values={values}
								touched={touched}
								isValid={isValid}
								errors={errors}
							/>
						</View>}
				</View>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	container : {
		flex : 1
	}
});

export default inject('rootStore')(observer(RegisterScreen));
