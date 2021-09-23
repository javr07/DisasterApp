// MAIN IMPORTS
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { inject, observer } from 'mobx-react';

// COMPONENTS IMPORTS
import ConfigurationForm from '../components/Forms/ConfigurationForm';

const isAndroid = Platform.OS === 'android';

function ConfigScreen({ navigation, rootStore }) {
	// STATES
	const { configStore } = rootStore;

	const { endpointConfigEnabled, isTrackingPos } = configStore;

	const { t } = useTranslation();

	// FUNCTIONS
	const __handleEnableEndpointConfig = () => {
		configStore.setEndpointConfigEnabled();
	};
	const __handleChangeIsTrackingPos = () => {
		configStore.setIsTrackingPos();
	}
	const setConfigObject = (values) => {
		try {
			const jsonConfigValues = JSON.stringify(values);
			const response = configStore.setPersistentConfigObject(jsonConfigValues);
			if (response) {
				console.log('New configuration stored. Ok. ');
			}
		} catch (e) {
			console.log(e);
		}
	};

	const __handleSubmit = async (values) => {
		values = {
			...values,
			geofence : values.geofence / 1000
		};
		setConfigObject(values);
		configStore.setEndpointConfigEnabled(false);
		navigation.navigate('Map');
	};

	const __handleConfigurationErrors = (errors) => {
		if (errors.latitude) {
			Alert.alert(t('configuration.error'), `${errors.latitude}`, [ { text: 'OK' } ]);
		} else if (errors.longitude) {
			Alert.alert(t('configuration.error'), `${errors.longitude}`, [ { text: 'OK' } ]);
		} else if (errors.geofence) {
			Alert.alert(t('configuration.error'), `${errors.geofence}`, [ { text: 'OK' } ]);
		} else {
			Alert.alert(t('configuration.error'), `${errors.endpoint}`, [ { text: 'OK' } ]);
		}
	};

	const __handleChangeLanguage = (e) => {
		configStore.setPersistentLanguage(e);
	};
	// REGISTER SCHEMA
	const RegisterSchema = Yup.object().shape({
		latitude  : Yup.number()
			.required(t('configuration.schema.latitude.required'))
			.typeError(t('configuration.schema.type.number'))
			.min(-90, t('configuration.schema.latitude.min'))
			.max(90, t('configuration.schema.latitude.max')),
		longitude : Yup.number()
			.required('Ingresa la longitud de inicio')
			.typeError(t('configuration.schema.type.number'))
			.min(-180, t('configuration.schema.longitude.min'))
			.max(180, t('configuration.schema.latitude.max')),
		geofence  : Yup.number()
			.typeError(t('configuration.schema.type.number'))
			.min(50, t('configuration.schema.geofence.min'))
			.max(500, t('configuration.schema.geofence.max')),
		endpoint  : Yup.string()
			.url(t('configuration.schema.url.valid'))
			.required(t('configuration.schema.url.valid'))
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			configStore.setCurrentScreen('Configuration Screen');
			return unsubscribe;
		});
	}, []);

	// COMPONENT JSX
	return (
		<Formik
			initialValues={{
				latitude  :
					configStore.configObject ? configStore.configObject.latitude :
					configStore.initialPosition.latitude + '',
				longitude :
					configStore.configObject ? configStore.configObject.longitude :
					configStore.initialPosition.longitude + '',
				geofence  :
					configStore.configObject ? configStore.configObject.geofence * 1000 + '' :
					'50',
				endpoint  :
					configStore.configObject ? configStore.configObject.endpoint :
					'http://187.189.23.174:8080/api/geo/getEquip'
			}}
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
							<ConfigurationForm
								endpointConfigEnabled={endpointConfigEnabled}
								t={t}
								isTrackingPos={isTrackingPos}
								__handleChangeIsTrackingPos={__handleChangeIsTrackingPos}
								__handleEnableEndpointConfig={__handleEnableEndpointConfig}
								__handleConfigurationErrors={__handleConfigurationErrors}
								__handleChangeLanguage={__handleChangeLanguage}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								values={values}
								initialPosition={configStore.initialPosition}
								touched={touched}
								isValid={isValid}
								errors={errors}
							/>
						</KeyboardAwareScrollView> :
						<View style={styles.container}>
							<ConfigurationForm
								endpointConfigEnabled={endpointConfigEnabled}
								t={t}
								isTrackingPos={isTrackingPos}
								__handleChangeIsTrackingPos={__handleChangeIsTrackingPos}
								__handleEnableEndpointConfig={__handleEnableEndpointConfig}
								__handleConfigurationErrors={__handleConfigurationErrors}
								__handleChangeLanguage={__handleChangeLanguage}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								values={values}
								initialPosition={configStore.initialPosition}
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

export default inject('rootStore')(observer(ConfigScreen));
