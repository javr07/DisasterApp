import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';

// COMPONENT IMPORTS
import LoginButton from '../Buttons/LoginButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
const image = require('../../../assets/login.png');

function ResetPasswordForm(props) {
	return (
		<View
			style={{
				flex           : 1,
				flexDirection  : 'column',
				justifyContent : 'center'
			}}
		>
			<ImageBackground style={styles.image} source={image}>
				<View style={styles.formContainer}>
					<Text
						style={{
							...styles.centeredLabel,
							color    : '#94c11f',
							fontSize : 25
						}}
					>
						{props.t('login.recovery.title')} <Icon name="lock-open" color="#94c11f" size={50} />
					</Text>
					<Text
						style={{
							...styles.centeredLabel,
							color        : '#FFF',
							fontSize     : 16,
							marginBottom : 40
						}}
					>
						{props.t('login.recovery.text')}
					</Text>
					<View style={styles.inputContainer}>
						<Text style={styles.label}>{props.t('login.email')}</Text>
						<TextInput
							name="email"
							type="text"
							style={styles.textInput}
							allowFontScaling={false}
							keyboardType="email-address"
							autoCapitalize="none"
							onBlur={props.handleBlur('email')}
							error={props.errors.email}
							touched={props.touched.email}
							onChangeText={props.handleChange('email')}
							onBlur={props.handleBlur('email')}
							value={props.email}
						/>
					</View>
				</View>
				<View style={styles.buttonsContainer}>
					<LoginButton
						text={props.t('login.recovery.button')}
						color="#94c11f"
						borderRadius={20}
						width="100%"
						marginBottom={15}
						onPress={

								props.isValid ? props.handleSubmit :
								() => props.__handleRestorePasswordErrors(props.errors)
						}
					/>
					<TouchableOpacity onPress={() => props.navigate('Login')}>
						<Text
							style={{
								...styles.centeredLabel,
								color : '#94c11f'
							}}
						>
							{props.t('msg.goBack')}
						</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	image            : {
		flex           : 1,
		resizeMode     : 'cover',
		justifyContent : 'center',
		alignItems     : 'center'
	},
	inputContainer   : {
		marginBottom : 5,
		marginTop    : 5
	},
	textInput        : {
		color             : 'white',
		borderBottomColor : '#94c11f',
		borderBottomWidth : 4,
		height            : 50,
		fontSize          : 16,
		padding           : 10
	},
	label            : {
		color      : 'white',
		alignSelf  : 'baseline',
		fontSize   : 18,
		fontWeight : 'bold'
	},
	formContainer    : {
		width     : '75%',
		marginTop : 200
	},
	buttonsContainer : {
		marginTop : 20,
		width     : '75%'
	},
	centeredLabel    : {
		color      : 'white',
		alignSelf  : 'center',
		fontSize   : 18,
		fontWeight : 'bold',
		marginTop  : 20
	}
});

export default ResetPasswordForm;
