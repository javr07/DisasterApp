import React from 'react';
import { inject, observer } from 'mobx-react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import LoginButton from '../Buttons/LoginButton';

function ModalView({ rootStore }) {
	const { mapStore, equipmentStore } = rootStore;
	const { t } = useTranslation();

	const titleText = () => {
		if (mapStore.newMeterState || mapStore.newTransformerState) {
			if (mapStore.newMeterState) {
				return t('modal.meter.new');
			} else {
				return t('modal.transformer.new');
			}
		} else {
			return t('modal.transformer.edit');
		}
	}
	const idText = () => {
		if (mapStore.newMeterState) {
			return t('modal.meter.id');
		} else {
			return t('modal.transformer.id');
		}
	}
	const buttonText = () => {
		if (mapStore.newMeterState || mapStore.newTransformerState) {
			return t('modal.save');
		} else {
			return t('modal.edit');
		}
	}
	const valueLatitude = () => {
		let latValue = '';
		if (mapStore.newMeterMarker) {
			latValue = mapStore.newMeterMarker.latitude;
		} else {
			if (mapStore.newTransformerMarker) {
				latValue = mapStore.newTransformerMarker.latitude;
			} else {
				if (mapStore.selectedTransformer) {
					latValue = mapStore.selectedTransformer.latitude;
				}
			}
		}
		return latValue + '';
	}
	const valueLongitude = () => {
		let lonValue = '';
		if (mapStore.newMeterMarker) {
			lonValue = mapStore.newMeterMarker.longitude;
		} else {
			if (mapStore.newTransformerMarker) {
				lonValue = mapStore.newTransformerMarker.longitude;
			} else {
				if (mapStore.selectedTransformer) {
					lonValue = mapStore.selectedTransformer.longitude;
				}
			}
		}
		return lonValue + '';
	}
	//PROGRAMMATICALLY UNSELECT METER 
	const unselectMeter = () => {
		if (mapStore.selectedMeter) {
			const selectedMeterName = mapStore.meters.find((meter) => {
				if (meter.name === mapStore.selectedMeter.name) {
					return meter;
				}
			})
			selectedMeterName.color = '#ff7a21';
			mapStore.setSelectedMeter();
		}	
	};
	//PROGRAMMATICALLY UNSELECT TRANSFORMER
	const unselectTransformer = () => {
		if (mapStore.selectedTransformer) {
			const selectedTrans = mapStore.transformers.find((trans) => {
				if (trans.pkey === mapStore.selectedTransformer.pkey) {
					return trans;
				}
			})
			selectedTrans.color = '#45FF';
			mapStore.setSelectedMeter();
		}	
	};
	const saveEquipmentValues = (values) => {
		if (mapStore.newMeterState || mapStore.newTransformerState) {
			equipmentStore.setSearch();
			if (mapStore.newMeterState == true) {
				//NEW METER
				unselectMeter();
				let meters = Object.assign([], mapStore.meters);
				const newMeter = {
					latitude      : mapStore.newMeterMarker.latitude,
					longitude     : mapStore.newMeterMarker.longitude,
					name          : values.equipmentId,
					xfrmrid       : values.equipmentId,
					isNew         : true
				}
				meters.push(newMeter);
				//SAVE METER IN ARRAY
				mapStore.setMeters(meters);
				mapStore.setPersistentMeters(meters);
				Alert.alert('', t('modal.save.ok'));
				mapStore.setNewMeterState(false);
				mapStore.setModalVisible();
			} else {
				//NEW TRANSFORMER
				unselectTransformer();
				var date = new Date();
				const fullDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
				let transformers = Object.assign([], mapStore.transformers);
				const newTrans = {
					latitude      : mapStore.newTransformerMarker.latitude,
					longitude     : mapStore.newTransformerMarker.longitude,
					name          : values.equipmentId,
					pkey          : values.equipmentId,
					timestamp     : fullDate,
					isNew         : true,
					color		  : ''
				}
				transformers.push(newTrans);
				//SAVE TRANSFORMER AS NEW
				mapStore.setTransformers(transformers);
				mapStore.setPersistentTransformers(transformers);
				Alert.alert('', t('modal.save.ok'));
				mapStore.setNewTransformerState(false);
				mapStore.setModalVisible();
			}
		} else {
			//EDIT A TRANSFORMER (NEW OR EXISTENT)
			const editTransformer = mapStore.transformers.find((transformer) => {
				if(transformer.pkey === mapStore.selectedTransformer.pkey){
					return transformer;
				}
			});
			var date = new Date();
			const fullDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
			editTransformer.timestamp = fullDate;
			editTransformer.name = values.equipmentId;
			unselectTransformer()//Not before not after
			mapStore.setPersistentTransformers(mapStore.transformers);
			Alert.alert('', t('modal.edit.ok'));
			mapStore.setModalVisible();
		}
	}

	const __handleModalErrors = (errors) => {
		if (errors.equipmentId) {
			alert(t('modal.schema.id'));
		}
	};
	// Modal SCHEMA
	const modalSchema = Yup.object().shape({
		equipmentId: Yup.string()
			.min(6, t('modal.schema.id'))
	});
	const getNameTransformer = () => {
		if (!mapStore.newTransformerState && 
			!mapStore.newMeterState && 
			mapStore.selectedTransformer) {
			var name;	
			name = mapStore.selectedTransformer.name;
			return name + '';
		} else {
			console.log(equipmentStore.search);
			if (equipmentStore.search != null) {
				var name = equipmentStore.search.toUpperCase().substring(1, equipmentStore.search.length);
				return name + '';
			} else {
				return null;
			}
		}
	}

	return (
		<Formik
			initialValues={{ equipmentId: getNameTransformer()
			}}
			validationSchema={modalSchema}
			onSubmit={(values) => {
				saveEquipmentValues(values);
			}}
		>
			{({ handleChange, handleSubmit, values, isValid, errors }) => (
				<View style={styles.centeredView}>
					<ScrollView style={styles.modalView}>
						<TouchableOpacity onPress={() => mapStore.setModalVisible()} style={styles.closeIcon}>
							<Icon name="close" size={40} color="#148fe0" />
						</TouchableOpacity>
						<View>
							<Text
								style={{ marginTop: 40, fontWeight: 'bold', fontSize: 16, paddingLeft: 10, marginBottom: 10 }}
							>
								{titleText()}
							</Text>
							<TextInput
								name="equipmentId"
								textContentType="none"
								keyboardType="default"
								allowFontScaling={false}
								autoCapitalize="characters"
								value={values.equipmentId}
								error={errors.equipmentId}
								placeholder={idText()}
								onChangeText={handleChange('equipmentId')}
								style={{
									borderColor  : '#148fe0',
									borderWidth  : 2,
									fontSize     : 16,
									padding      : 10,
									borderRadius : 20
								}}
							/>
							<Text
								style={{ marginTop: 40, fontWeight: 'bold', fontSize: 16, paddingLeft: 10, marginBottom: 10 }}
							>
								{t('configuration.latitude')}
							</Text>
							<TextInput
								name="latitude"
								textContentType="location"
								keyboardType="numbers-and-punctuation"
								allowFontScaling={false}
								autoCapitalize="none"
								value={valueLatitude()}
								editable={false}
								placeholder="..."
								style={{
									borderColor  : '#148fe0',
									borderWidth  : 2,
									fontSize     : 16,
									padding      : 10,
									borderRadius : 20
								}}
							/>
							<Text
								style={{ marginTop: 40, fontWeight: 'bold', fontSize: 16, paddingLeft: 10, marginBottom: 10 }}
							>
								{t('configuration.longitude')}
							</Text>
							<TextInput
								name="longitude"
								textContentType="location"
								keyboardType="numbers-and-punctuation"
								allowFontScaling={false}
								autoCapitalize="none"
								value={valueLongitude()}
								editable={false}
								placeholder="..."
								style={{
									borderColor  : '#148fe0',
									borderWidth  : 2,
									fontSize     : 16,
									padding      : 10,
									borderRadius : 20
								}}
							/>
							<View style={{ marginTop: 40 }}>
								<LoginButton
									text={buttonText()}
									color="#94c11f"
									borderRadius={20}
									width="100%"
									onPress={
										isValid ? handleSubmit :
										() => __handleModalErrors(errors)
									}
								/>
							</View>
						</View>
					</ScrollView>
				</View>
			)}
		</Formik>
	);
}
const styles = StyleSheet.create({
	centeredView : {
		flex : 1
	},
	modalView    : {
		margin          : 20,
		marginLeft      : 10,
		backgroundColor : 'white',
		borderRadius    : 20,
		padding         : 35,
		shadowColor     : '#000',
		shadowOffset    : {
			width  : 0,
			height : 2
		},
		shadowOpacity   : 0.25,
		shadowRadius    : 4,
		elevation       : 2,
		width           : '95%'
	},
	textStyle    : {
		color      : 'black',
		fontWeight : 'bold',
		textAlign  : 'center'
	},
	modalText    : {
		marginBottom : 15,
		textAlign    : 'center'
	},
	button       : {
		borderRadius : 20,
		padding      : 10,
		elevation    : 2
	},
	closeIcon    : {
		left : '85%'
	},
	textInput    : {
		marginLeft : 20
	}
});

export default inject('rootStore')(observer(ModalView));
