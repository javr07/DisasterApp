import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { CheckBox } from 'react-native-elements';

// COMPONENT IMPORTS
import LoginButton from '../Buttons/LoginButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
const image = require('../../../assets/background.png');
const logo = require('../../../assets/logo.png');

function ConfigurationForm(props) {
	return (
		<View style={styles.inner}>
			<ImageBackground style={styles.image} source={image}>
				<ModalDropdown
					options={[ props.t('language.english'), props.t('language.spanish') ]}
					textStyle={styles.languageButtonText}
					defaultValue={props.t('language.button')}
					style={styles.languageButton}
					dropdownStyle={styles.dropdownStyle}
					dropdownTextStyle={styles.dropdownTextStyle}
					onSelect={(e) => props.__handleChangeLanguage(e)}
					renderRightComponent={() => {
						return (
							<Icon
								name="expand-more"
								size={30}
								color="#FFF"
								style={{
									right : -10
								}}
							/>
						);
					}}
				/>
				<Image source={logo} style={styles.logo} />
				<ScrollView>
					<View style={styles.formContainer}>
						<CheckBox
						title={props.t('configuration.trackingPos')}
						right
						iconRight
						checkedColor='green'
						checked={props.isTrackingPos}
						containerStyle={styles.checkComp}
						textStyle={styles.checkCompText}
						onPress={props.__handleChangeIsTrackingPos}
						/>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>{props.t('configuration.latitude')}</Text>
							{props.errors.latitude &&
							props.touched.latitude && (
								<Text style={styles.validationError}>{props.errors.latitude}</Text>
							)}
							<TextInput
								name="latitude"
								textContentType="location"
								keyboardType="numbers-and-punctuation"
								style={styles.textInput}
								allowFontScaling={false}
								autoCapitalize="none"
								textAlign="center"
								editable={!props.isTrackingPos}
								onBlur={props.handleBlur('latitude')}
								error={props.errors.latitude}
								touched={props.touched.latitude}
								onChangeText={props.handleChange('latitude')}
								onBlur={props.handleBlur('latitude')}
								value={props.isTrackingPos ? props.initialPosition.latitude+'' : props.values.latitude}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>{props.t('configuration.longitude')}</Text>
							{props.errors.longitude &&
							props.touched.longitude && (
								<Text style={styles.validationError}>{props.errors.longitude}</Text>
							)}
							<TextInput
								name="longitude"
								keyboardType="numbers-and-punctuation"
								style={styles.textInput}
								allowFontScaling={false}
								autoCapitalize="none"
								textAlign="center"
								editable={!props.isTrackingPos}
								onBlur={props.handleBlur('longitude')}
								error={props.errors.longitude}
								touched={props.touched.longitude}
								onChangeText={props.handleChange('longitude')}
								onBlur={props.handleBlur('longitude')}
								value={props.isTrackingPos ? props.initialPosition.longitude+'' : props.values.longitude}
							/>
						</View>
						<View
							style={{
								...styles.inputContainer,
								width : '100%'
							}}
						>
							<Text style={styles.label}>
								{props.t('configuration.geofence')} ({props.t('configuration.geofence.meters')})
							</Text>
							{props.errors.geofence &&
							props.touched.geofence && (
								<Text style={styles.validationError}>{props.errors.geofence}</Text>
							)}
							<TextInput
								name="geofence"
								style={styles.textInput}
								keyboardType="numbers-and-punctuation"
								allowFontScaling={false}
								textAlign="center"
								autoCapitalize="none"
								onBlur={props.handleBlur('geofence')}
								error={props.errors.geofence}
								touched={props.touched.geofence}
								onChangeText={props.handleChange('geofence')}
								onBlur={props.handleBlur('geofence')}
								value={props.values.geofence}
							/>
						</View>
						<View
							style={{
								...styles.inputContainer,
								width : '100%'
							}}
						>
							<Text style={styles.label}>URL (Endpoint)</Text>
							{props.errors.endpoint &&
							props.touched.endpoint && (
								<Text style={styles.validationError}>{props.errors.endpoint}</Text>
							)}
							<TextInput
								name="endpoint"
								type="text"
								keyboardType="url"
								style={styles.textInput}
								allowFontScaling={false}
								autoCapitalize="none"
								onBlur={props.handleBlur('endpoint')}
								error={props.errors.endpoint}
								touched={props.touched.endpoint}
								onChangeText={props.handleChange('endpoint')}
								onBlur={props.handleBlur('endpoint')}
								onChange={props.handleChange('endpoint')}
								editable={props.endpointConfigEnabled}
								value={props.values.endpoint}
							/>
							<Icon
								name={

										props.endpointConfigEnabled ? 'lock-open' :
										'lock'
								}
								size={30}
								color="#FFF"
								onPress={props.__handleEnableEndpointConfig}
								style={styles.icon}
							/>
						</View>
					</View>
					<View style={styles.buttonsContainer}>
						<LoginButton
							text={props.t('configuration.save.parameters')}
							color="#94c11f"
							borderRadius={20}
							width="100%"
							marginBottom={15}
							onPress={

									props.isValid ? props.handleSubmit :
									() => props.__handleConfigurationErrors(props.errors)
							}
						/>
					</View>
				</ScrollView>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	image              : {
		flex       : 1,
		resizeMode : 'cover',
		alignItems : 'center'
	},
	textInput          : {
		color             : 'white',
		borderBottomColor : '#94c11f',
		borderBottomWidth : 4,
		height            : 50,
		fontSize          : 20,
		fontWeight        : 'bold',
		padding           : 10,
		marginTop         : 10
	},
	label              : {
		color      : 'white',
		alignSelf  : 'baseline',
		fontSize   : 18,
		fontWeight : 'bold'
	},
	checkComp              : {
		backgroundColor: 'transparent',
		borderWidth: 0
	},
	checkCompText   :{
		color      : 'white',
		fontSize   : 18,
		fontWeight : 'bold',
	},
	formContainer      : {
		marginLeft : '5%',
		width      : '90%',
		marginTop  : 40
	},
	buttonsContainer   : {
		marginLeft : '5%',
		width      : '90%',
		marginTop  : 40
	},
	centeredLabel      : {
		color      : 'white',
		alignSelf  : 'center',
		fontSize   : 18,
		fontWeight : 'bold',
		marginTop  : 20
	},
	icon               : {
		position : 'absolute',
		right    : 10,
		bottom   : 50
	},
	logo               : {
		height    : 110,
		width     : 150,
		marginTop : 30
	},
	inputContainer     : {
		marginBottom : 20
	},
	validationError    : {
		color : 'red'
	},
	languageButton     : {
		position       : 'absolute',
		borderWidth    : 2,
		borderColor    : '#94c11f',
		padding        : 15,
		borderRadius   : 50,
		top            : 20,
		right          : 10,
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
	},
	inner              : {
		flex : 1
	}
});

export default ConfigurationForm;
