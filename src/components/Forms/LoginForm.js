import React from 'react';
import Constants from 'expo-constants';
import ModalDropdown from 'react-native-modal-dropdown';
import { inject, observer } from 'mobx-react';
// COMPONENT IMPORTS
import LoginButton from '../Buttons/LoginButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
const image = require('../../../assets/login.png');
const isAndroid = Platform.OS === 'android';


function LoginForm({
	authStore,
	t,
	__handleLoginErrors,
	__handleChangeLanguage,
	handleChange,
	handleBlur,
	handleSubmit,
	touched,
	values,
	isValid,
	errors,
	navigation
}) {
	return (
		<ImageBackground style={styles.image} source={image}>
			<View style={{ flex: 6 }}/>
			<View style={styles.formContainer}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>{t('login.email')}</Text>
					<TextInput
						name="email"
						type="text"
						style={styles.textInput}
						allowFontScaling={false}
						keyboardType="email-address"
						autoCapitalize="none"
						onBlur={handleBlur('email')}
						error={errors.email}
						touched={touched.email}
						onChangeText={handleChange('email')}
						onBlur={handleBlur('email')}
						value={values.email}
					/>
				</View>
				<View
					style={{
						...styles.inputContainer,
						width : '100%',
						marginBottom: 20
					}}
				>
					<Text style={styles.label}>{t('login.password')}</Text>
					<TextInput
						name="password"
						type="text"
						style={styles.textInput}
						secureTextEntry={authStore.showPassword}
						allowFontScaling={false}
						autoCapitalize="none"
						onBlur={handleBlur('password')}
						error={errors.password}
						touched={touched.password}
						onChangeText={handleChange('password')}
						onBlur={handleBlur('password')}
						value={values.password}
					/>
					<Icon
						name={

							authStore.showPassword ? 'visibility' :
								'visibility-off'
						}
						size={30}
						color="#FFF"
						onPress={() => authStore.handleShowPassword()}
						style={styles.icon}
					/>
				</View>
				<LoginButton
					text={t('login.login')}
					color="#94c11f"
					borderRadius={20}
					width="100%"
					marginBottom={15}
					onPress={

							isValid ? handleSubmit :
							() => __handleLoginErrors(errors)
					}
				/>
				<LoginButton
					text={t('login.recovery')}
					color="#94c11f"
					borderRadius={20}
					width="100%"
					onPress={() => navigation.navigate('ResetPassword')}
				/>
				<Text style={styles.centeredLabel}>{t('login.newAccount')}</Text>
				<TouchableOpacity onPress={() => navigation.navigate('Register')}>
					<Text
						style={{
							...styles.centeredLabel,
							color : '#94c11f'
						}}
					>
						{t('login.signUp')}
					</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flex: 3 }}>
				<ModalDropdown
					options={[ t('language.english'), t('language.spanish') ]}
					textStyle={styles.languageButtonText}
					defaultValue={t('language.button')}
					style={styles.languageButton}
					dropdownStyle={styles.dropdownStyle}
					dropdownTextStyle={styles.dropdownTextStyle}
					onSelect={(e) => __handleChangeLanguage(e)}
					renderRightComponent={() => {
						return (
							<Icon
								name="expand-less"
								size={30}
								color="#FFF"
								style={{
									right : -10
								}}
							/>
						);
					}}
				/>
				<Text style={styles.version}>{`${t('menu.version')} v${Constants.manifest.version}`}</Text>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	image              : {
		flex           : 1,
		resizeMode     : 'cover',
		justifyContent : 'center',
		alignItems     : 'center'
	},
	inputContainer     : {
		marginBottom : 5,
		marginTop    : 5
	},
	textInput          : {
		color             : 'white',
		borderBottomColor : '#94c11f',
		borderBottomWidth : 4,
		height            : 50,
		fontSize          : 16,
		padding           : 10
	},
	label              : {
		color      : 'white',
		alignSelf  : 'baseline',
		fontSize   : 18,
		fontWeight : 'bold'
	},
	formContainer      : {
		width     : '75%',
		flex: 9
	},
	centeredLabel      : {
		color      : 'white',
		alignSelf  : 'center',
		fontSize   : 18,
		fontWeight : 'bold',
		marginTop  : 15
	},
	icon               : {
		position : 'absolute',
		right    : 10,
		bottom   : 10
	},
	version            : {
		color      : 'white',
		bottom     :
			isAndroid ? -40 :
			-40,
		left       : 130,
		fontWeight : 'bold'
	},
	languageButton     : {
		borderWidth    : 2,
		borderColor    : '#94c11f',
		padding        : 10,
		borderRadius   : 50,
		bottom         :
			isAndroid ? -60 :
			-60,
		right          : 120,
		width          : 130,
		alignContent   : 'center',
		justifyContent : 'center',
		alignItems     : 'center',
		alignSelf      : 'center',
		textAlign      : 'center'
	},
	dropdownStyle      : {
		width        : 100,
		height       : 90,
		borderRadius : 1
	},
	dropdownTextStyle  : {
		fontSize  : 15,
		textAlign : 'center'
	},
	languageButtonText : {
		fontSize : 15,
		color    : 'white'
	}
});

export default inject('rootStore')(observer(LoginForm));
