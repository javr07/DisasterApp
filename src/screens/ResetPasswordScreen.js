// MAIN IMPORTS
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const isAndroid = Platform.OS === 'android';

// COMPONENTS IMPORTS
import ResetPasswordForm from '../components/Forms/ResetPasswordForm';

function RestorePasswordScreen({ navigation, rootStore }) {
	// USE CONTEXT
	const { configStore, authStore } = rootStore;

	const { t } = useTranslation();

	const __handleRestorePasswordErrors = (errors) => {
		if (errors.email) {
			Alert.alert(t('login.recovery.title'), `${errors.email}`, [ { text: 'OK' } ]);
		}
	};

	const __handleSubmit = async (values, actions) => {
		try {
			await authStore.restorePassword(values.email, actions);
		} catch (error) {
			console.log(error);
		}
	};

	// USEEFFECT
	useEffect(() => {
		configStore.setCurrentScreen('Restore Password Screen');
	}, []);

	// LOGIN SCHEMA
	const RestorePasswordSchema = Yup.object().shape({
		email : Yup.string().email(t('login.schema.email')).required(t('login.schema.email.required'))
	});

	// COMPONENT JSX
	return (
		<Formik
			initialValues={{ email: '' }}
			validateOnMount={true}
			validationSchema={RestorePasswordSchema}
			onSubmit={(values, actions) => {
				__handleSubmit(values, actions);
			}}
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
							extraHeight={200}
						>
							<ResetPasswordForm
								navigate={navigation.navigate}
								t={t}
								__handleRestorePasswordErrors={__handleRestorePasswordErrors}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								email={values.email}
								isValid={isValid}
								touched={touched}
								errors={errors}
							/>
						</KeyboardAwareScrollView> :
						<View style={styles.container}>
							<ResetPasswordForm
								navigate={navigation.navigate}
								t={t}
								__handleRestorePasswordErrors={__handleRestorePasswordErrors}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								email={values.email}
								isValid={isValid}
								touched={touched}
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

export default inject('rootStore')(observer(RestorePasswordScreen));
