import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';

// COMPONENT IMPORTS
import LoginButton from '../Buttons/LoginButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
const image = require('../../../assets/background.png');
const logo = require('../../../assets/logo.png');

function RegisterForm({
	navigate,
	handleShowPassword,
	showPassword,
	t,
	__handleRegisterErrors,
	handleChange,
	handleBlur,
	handleSubmit,
	values,
	touched,
	isValid,
	errors,
	rootStore
}) {
	const { authStore } = rootStore;

	return (
		<View
			style={{
				flex          : 1,
				flexDirection : 'column'
			}}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow : 1
				}}
			>
				<ImageBackground style={styles.image} source={image}>
					<Image source={logo} style={styles.logo} />
					<View style={styles.formContainer}>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>{t('login.username')}</Text>
							{errors.username &&
							touched.username && <Text style={styles.validationError}>{errors.username}</Text>}
							<TextInput
								name="username"
								type="text"
								style={styles.textInput}
								allowFontScaling={false}
								autoCapitalize="words"
								onBlur={handleBlur('username')}
								error={errors.username}
								touched={touched.username}
								onChangeText={handleChange('username')}
								onBlur={handleBlur('username')}
								value={values.username}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>{t('login.email')}</Text>
							{errors.email &&
							touched.email && <Text style={styles.validationError}>{errors.email}</Text>}
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
								width : '100%'
							}}
						>
							<Text style={styles.label}>{t('login.password')}</Text>
							{errors.password &&
							touched.password && <Text style={styles.validationError}>{errors.password}</Text>}
							<TextInput
								name="password"
								type="text"
								style={styles.textInput}
								secureTextEntry={showPassword}
								allowFontScaling={false}
								autoCapitalize="none"
								onBlur={handleBlur('password')}
								error={errors.password}
								touched={touched.password}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								value={values.password}
							/>
						</View>
						<View
							style={{
								...styles.inputContainer,
								width : '100%'
							}}
						>
							<Text style={styles.label}>{t('login.password.repeat')}</Text>
							{errors.confirmPassword &&
							touched.confirmPassword && (
								<Text style={styles.validationError}>{errors.confirmPassword}</Text>
							)}
							<TextInput
								name="confirmPassword"
								type="text"
								style={styles.textInput}
								secureTextEntry={showPassword}
								allowFontScaling={false}
								autoCapitalize="none"
								onBlur={handleBlur('confirmPassword')}
								error={errors.confirmPassword}
								touched={touched.confirmPassword}
								onChangeText={handleChange('confirmPassword')}
								onBlur={handleBlur('confirmPassword')}
								value={values.confirmPassword}
								onChange={handleChange('confirmPassword')}
							/>
							<Icon
								name={

										showPassword ? 'visibility' :
										'visibility-off'
								}
								size={30}
								color="#FFF"
								onPress={() => authStore.handleShowPassword()}
								style={styles.icon}
							/>
						</View>
					</View>
					<View style={styles.buttonsContainer}>
						<LoginButton
							text={t('login.register')}
							color="#94c11f"
							borderRadius={20}
							width="100%"
							marginBottom={15}
							onPress={

									isValid ? handleSubmit :
									() => __handleRegisterErrors(errors)
							}
						/>

						<Text style={styles.centeredLabel}>{t('login.hasAccount')}</Text>
						<TouchableOpacity onPress={() => navigate('Login')}>
							<Text
								style={{
									...styles.centeredLabel,
									color : '#94c11f'
								}}
							>
								{t('login.signIn')}
							</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	image            : {
		flex       : 1,
		resizeMode : 'cover',
		alignItems : 'center'
	},
	textInput        : {
		color             : 'white',
		borderBottomColor : '#94c11f',
		borderBottomWidth : 4,
		height            : 50,
		fontSize          : 16,
		padding           : 10,
		marginTop         : 10
	},
	label            : {
		color      : 'white',
		alignSelf  : 'baseline',
		fontSize   : 18,
		fontWeight : 'bold'
	},
	formContainer    : {
		width     : '75%',
		marginTop : 40
	},
	buttonsContainer : {
		marginTop : 10,
		width     : '75%'
	},
	centeredLabel    : {
		color      : 'white',
		alignSelf  : 'center',
		fontSize   : 18,
		fontWeight : 'bold',
		marginTop  : 20
	},
	icon             : {
		position : 'absolute',
		right    : 10,
		bottom   : 10
	},
	logo             : {
		height    : 110,
		width     : 150,
		marginTop : 30
	},
	inputContainer   : {
		marginBottom : 20
	},
	validationError  : {
		color : 'red'
	}
});

export default inject('rootStore')(observer(RegisterForm));
