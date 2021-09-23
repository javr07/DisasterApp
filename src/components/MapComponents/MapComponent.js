// MAIN IMPORTS
import React, { useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, BackHandler, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';

// COMPONENT IMPORTS
import SearchbarComponent from '../SearchbarComponent';
import MapIcon from './MapIcon';
import TransformerMarker from './TransformerMarker';
import MeterMarker from './MeterMarker';
import NewMeterMarker from './NewMeterMarker';
import NewTransformerMarker from './NewTransformerMarker';
import MeterIcon from './MeterIcon';
import TransformerIcon from './TransformerIcon';
import ModalView from './ModalView';

// STYLE IMPORTS
import styled from 'styled-components/native';

// DEVICE CONST
const isAndroid = Platform.OS === 'android';

// STYLED COMPONENTS
const StyledView = styled.View({
	...StyleSheet.absoluteFillObject
});
const StyledMapView = styled(MapView)({
	flex : 1
});
const SafeAreaViewStyled = styled(SafeAreaView)`
flex:1;
${StatusBar.currentHeight && !isAndroid && `margin-top: ${StatusBar.currentHeight}px`};
`;

const locationPermissionRequest = async () => {
	let { status } = await Location.requestForegroundPermissionsAsync();
	if (status !== 'granted') {
		setErrorMsg(t('configuration.location.permission'));
		return;
	}
};

// COMPONENT
const MapComponent = ({ navigation, rootStore }) => {
	const { configStore, equipmentStore, mapStore, authStore } = rootStore;
	const { t } = useTranslation();
	const mapRef = useRef(null);
	// EQUIPMENT FECTH FUNCTION
	const fetchMeters = async () => {
		let response;
		if(configStore.isTrackingPos){
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
			response = await fetch(
				`${configStore.configObject.endpoint}?latitude=${location.coords
					.latitude}&longitude=${location.coords.longitude}&km=${configStore.configObject.geofence}`
			);
		} else {
			response = await fetch(
				`${configStore.configObject.endpoint}?latitude=${configStore.configObject
					.latitude}&longitude=${configStore.configObject.longitude}&km=${configStore.configObject.geofence}`
			);
		}
		if (!response) {
			alert(t('map.fetch.error'));
			mapStore.setFetchedData(false);
		}
		if (!response.ok) {
			alert(t('map.fetch.error'));
			mapStore.setFetchedData(false);
			throw new Error('Error recuperando la información');
		}
		return response.json();
	};
	//RESET MAP OBJECTS, BROOM ACTION
	const __handleResetAssignments = () => {
		//CLEAN LINES
		mapStore.setPolylineState(false);
		//CLEAN COORDINATES FOR LINES
		mapStore.setTransMeterCoordinates();
		//CLEAN MAIN OBJECTS
		mapStore.setMeters();
		mapStore.removePersistentMeters();
		mapStore.setTransformers();
		mapStore.removePersistentTransformers();
		//CLEAN SELECTIONS
		mapStore.setSelectedMeter();
		mapStore.setSelectedTransformer();
		//CLEAN NEW OBJECTS
		mapStore.setNewMeterState(false);
		mapStore.setNewMeterMarker();
		mapStore.setNewTransformerState(false);
		mapStore.setNewTransformerMarker();
		//CLEAN DATA STATE
		mapStore.setFetchedData(false);
	};
	const setCameraInMeters = () => {
		var geoDataMeters = [];
		mapStore.meters.map((meter) => {
			const coordinates = {
				latitude: meter.latitude,
				longitude: meter.longitude
			};
			geoDataMeters.push(coordinates);
		}); 
		const edgePadding = {
			top: 60,
			right: 60,
			bottom: 60,
			left: 60
			};
		mapRef.current.fitToCoordinates(geoDataMeters, {edgePadding, animated: true});
	}

	// MAIN STATE SETTER (SETS DATA FROM API CALL TO THE COMPONENT STATE)
	const setEquipmentDataAndCoordinates = () => {
		if (!mapStore.metersAssigned) {
			__handleResetAssignments();
			mapStore.setIsFetchingData();
			fetchMeters().then((response) => {
				if (response) {
					mapStore.setMeters(response.data[0]);
					mapStore.setPersistentMeters(response.data[0]);
					mapStore.setTransformers(response.data[1]);
					mapStore.setPersistentTransformers(response.data[1]);
					mapStore.setFetchedData(true);
					mapStore.setIsFetchingData();
					if(response.data[0].length > 0) {
						setCameraInMeters();
					}
					if(response.data[0].length == 0 && response.data[1].length == 0) {
						Alert.alert("", t('map.get.empty'));
					}
				}
			});
		} else {
			Alert.alert(t('survey.delete.title'), t('survey.delete.msg'), [
				{
					text    : t('msg.no'),
					onPress : () => null,
					style   : 'cancel'
				},
				{
					text    : t('msg.yes'),
					onPress : () => {
						__handleResetAssignments();
					}
				}
			]);
		}
	};

	// SEARCH QRCODE FUNCTION
	const searchQRcode = () => {
		if (equipmentStore.qrCode !== undefined) {
			console.log('Hay QRcode');
			console.log(equipmentStore.qrCode);
			if (mapStore.fetchedData) {
				__handleLocateEquipment(equipmentStore.qrCode); //CHECK
			}
		}
	};

	// HANDLE LOGOUT ON BACKBUTTON. CHECK OR REMOVE
	const __handleLogoutOnBackButton = () => {
		if (configStore.currentScreen === 'Map Screen') {
			authStore.logout();
			navigation.navigate('Login');
		}
	};

	// HANDLE BACKBUTTON
	const __handleBackButton = () => {
		const backAction = () => {
			console.log('Back');
			console.log(configStore.currentScreen);
			if (configStore.currentScreen === 'Map Screen') {
				Alert.alert(t('msg.wait'), t('msg.logout.text'), [
					{
						text    : t('msg.cancel'),
						onPress : () => null,
						style   : 'cancel'
					},
					{
						text    : t('msg.logout'),
						onPress : () => {
							__handleLogoutOnBackButton();
						}
					}
				]);
				return true;
			} else if (configStore.currentScreen === 'Camera Screen') {
				navigation.navigate('Map');
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		// return () => backHandler.remove();
	};

	// USEEFFECT. RECALLS MAIN FUNCTIONS ON EVERY STATE CHANGE
	useEffect(() => {
		__handleBackButton();
		searchQRcode();
		const unsubscribe = navigation.addListener('focus', () => {
			__handleBackButton();
			locationPermissionRequest();
			searchQRcode();
			configStore.setCurrentScreen('Map Screen');
			return unsubscribe;
		});
	}, []);

	// LOCATE EQUIPMENT FUNCTION
	const __handleLocateEquipment = (search) => {
		equipmentStore.setSearch(search);
		if (mapStore.transformers === undefined && mapStore.meters === undefined && search.length > 0) {
			mapStore.setSearchError(t('survey.error'));
			return false;
		}
		if (equipmentStore.qrCode !== undefined) {
			equipmentStore.setQRcode();
		}
		if (equipmentStore.search.length === 0) {
			mapStore.setSearchError();
			mapStore.setSearchNewEquipment(false);
		}
		if (equipmentStore.search.toUpperCase().substring(0, 1) === 'T') {
			// TRANSFORMER SEARCH
			const foundTransformer = mapStore.transformers.filter((transformer) => {
				if (
					transformer.name == equipmentStore.search.toUpperCase().substring(1, equipmentStore.search.length)
				) {
					const coordinates = {
						latitude       : transformer.latitude,
						longitude      : transformer.longitude,
						// Propiedades del Zoom
						latitudeDelta  : 0.0008,
						longitudeDelta : 0.0008
					};
					mapRef.current.animateToRegion(coordinates);
					handleTransformerSelection(undefined, transformer.pkey); //NEED IT
					mapStore.setSearchError();
					equipmentStore.setQRcode();
					return transformer;
				}
			});
			if (typeof foundTransformer[0] !== 'object' && equipmentStore.search.length >= 4) {
				mapStore.setSearchError(t('survey.error.transformer'));
				mapStore.setSearchNewEquipment(true);
			}
		} else if (equipmentStore.search.toUpperCase().substring(0, 1) === 'M') {
			// METER SEARCH
			const foundMeter = mapStore.meters.filter((meter) => {
				if (meter.name == equipmentStore.search.toUpperCase().substring(1, equipmentStore.search.length)) {
					const coordinates = {
						latitude       : meter.latitude,
						longitude      : meter.longitude,
						// Propiedades del Zoom
						latitudeDelta  : 0.0008,
						longitudeDelta : 0.0008
					};
					mapRef.current.animateToRegion(coordinates);
					mapStore.setSearchError();
					// handleMeterSelection(undefined, meter.name); //MYSTERIOUS
					equipmentStore.setQRcode();
					return meter;
				}
			});
			if (equipmentStore.search.length >= 7 && typeof foundMeter[0] !== 'object') {
				mapStore.setSearchError(t('survey.error.meter'));
				mapStore.setSearchNewEquipment(true);
			} else if (typeof foundMeter[0] === 'object') {
				handleMeterSelection(undefined, foundMeter[0].name);
			}
		} else if (
			(equipmentStore.search.toUpperCase().substring(0, 1) !== 'T' ||
				equipmentStore.search.toUpperCase().substring(0, 1) !== 'M') &&
			equipmentStore.search.length > 0
		) {
			mapStore.setSearchError(t('map.search.error'));
		}
	};

	//CREATES JSON WITH COORDINATES BETWEEN TRANSFORMER AND METERS
	const assignMeterTransCoordinates = () => {
		let trans = mapStore.selectedTransformer;
		const transCoor = { latitude: trans.latitude, longitude: trans.longitude };
		let transMeterCoordinates = [];
		const assignedTransMeters = mapStore.metersAssigned.filter((meter) => meter.transformerId == trans.pkey);
		for (let index = 0; index < assignedTransMeters.length; index++) {
			transMeterCoordinates.push(transCoor);
			const meterCoor = {
				latitude  : assignedTransMeters[index].latitude,
				longitude : assignedTransMeters[index].longitude
			};
			transMeterCoordinates.push(meterCoor);
		}
		mapStore.setTransMeterCoordinates(transMeterCoordinates);
	};
	//SWITCH BETWEEN TEMPORAL ARRAY AND MAIN (SPIDER VIEW)
	const showMetersAssignedMap = (change) => {
		unselectMeter();
		if(change == true){
			mapStore.setTemporalMeters(mapStore.meters);
			let metersA = cloneMetersAssigned();
			mapStore.setMeters(metersA);
		} else {
			mapStore.setMeters(mapStore.temporalMeters);
			mapStore.setTemporalMeters();
		}
	}
	//SET POLYLINES FROM SELECTED TRANSFORMER TO METERS ASSIGNED
	const __handleSetPolyline = () => {
		if (mapStore.polylineState) {
			mapStore.setPolylineState(false);
			showMetersAssignedMap(false);
			mapStore.setOffModal();
			mapStore.setTransMeterCoordinates();
		} else if (!mapStore.polylineState && mapStore.metersAssigned) {
			if (mapStore.selectedTransformer) {
				assignMeterTransCoordinates();
				showMetersAssignedMap(true);
				mapStore.setPolylineState(true);
			} else {
				alert(t('map.polyline.error.trans'));
			}	
		} else {
			alert(t('map.polyline.error.empty'));
		}
	};

	// GET POSITION FUNCTION
	const getPosition = async () => {
		mapStore.setIsLocationLoading();
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
			const coordinates = {
				latitude       : location.coords.latitude,
				longitude      : location.coords.longitude,
				latitudeDelta  : 0.002,
				longitudeDelta : 0.002
			};
			console.log('Location: ', location);
			mapRef.current.animateToRegion(coordinates);
		}
		mapStore.setIsLocationLoading();
	};

	// SET METER MARKER ON CURRENT POSITION FUNCTION
	const __setCurrentMeterMarker = async () => {
		mapStore.setIsMeterLoading();
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
				latitude  : location.coords.latitude,
				longitude : location.coords.longitude
			};
			if (mapStore.newMeterMarker) {
				mapStore.setNewMeterMarker();
				mapStore.setNewMeterState(false);
				mapStore.setIsMeterLoading();
			} else {
				mapStore.setNewMeterMarker(initialRegion);
				mapStore.setNewMeterState(true);
				mapRef.current.animateToRegion({
					latitude       : location.coords.latitude,
					longitude      : location.coords.longitude,
					latitudeDelta  : 0.0008,
					longitudeDelta : 0.0008
				});
				mapStore.setIsMeterLoading();
			}
		}
	};

	// SET TRANSFORMER MARKER ON CURRENT POSITION FUNCTION
	const __setCurrentTransformerMarker = async () => {
		mapStore.setIsTransformerLoading();
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
				latitude  : location.coords.latitude,
				longitude : location.coords.longitude
			};
			if (mapStore.newTransformerMarker) {
				mapStore.setNewTransformerMarker();
				mapStore.setNewTransformerState(false);
				mapStore.setIsTransformerLoading();
			} else {
				mapStore.setNewTransformerMarker(initialRegion);
				mapStore.setNewTransformerState(true);
				mapRef.current.animateToRegion({
					latitude       : location.coords.latitude,
					longitude      : location.coords.longitude,
					latitudeDelta  : 0.0008,
					longitudeDelta : 0.0008
				});
				mapStore.setIsTransformerLoading();
			}
		}
	};

	// METER SELECTION FUNCTION
	const handleMeterSelection = (e, name) => {
		const newMeterSelection = mapStore.meters.find((meter) => {
			if (meter.name === name) {
				return meter;
			}
		});
		if (mapStore.selectedMeter === undefined) {
			mapStore.setSelectedMeter(newMeterSelection);
			(mapStore.isMeterUnassignLayer && !mapStore.polylineState) ? newMeterSelection.color = '#952fc4' : '';
		} else if (newMeterSelection.name === mapStore.selectedMeter.name) {
			console.log('Quitar selección medidor');
			(mapStore.isMeterUnassignLayer && !mapStore.polylineState) ? newMeterSelection.color = '#ff7a21' : '';
			mapStore.setSelectedMeter();
		} else if (newMeterSelection.name !== mapStore.selectedMeter.name) {
			const selectedMeterName = mapStore.meters.find((meter) => {
				if (meter.name === mapStore.selectedMeter.name) {
					return meter;
				}
			});
			console.log('Cambiar medidor seleccionado');
			(mapStore.isMeterUnassignLayer && !mapStore.polylineState) ? selectedMeterName.color = '#ff7a21' : '';
			(mapStore.isMeterUnassignLayer && !mapStore.polylineState) ? newMeterSelection.color = '#952fc4' : '';
			mapStore.setSelectedMeter(newMeterSelection);
		}
		mapRef.current.animateToRegion({
			latitude       : newMeterSelection.latitude,
			longitude      : newMeterSelection.longitude,
			// Propiedades del Zoom
			latitudeDelta  : 0.0008,
			longitudeDelta : 0.0008
		});
	};

	// TRANSFORMER SELECTION FUNCTION
	const handleTransformerSelection = (e, pkey) => {
		const newTransformerSelection = mapStore.transformers.find((transformer) => {
			if (transformer.pkey === pkey) {
				return transformer;
			}
		});
		mapStore.setFetchedData(false); //TO FORCE REFRESH
		if (mapStore.selectedTransformer === undefined) {
			mapStore.setSelectedTransformer(newTransformerSelection);
			newTransformerSelection.color = '#db2465';
			console.log('from undefined');
		} else if (newTransformerSelection.pkey !== mapStore.selectedTransformer.pkey) {
			const selectedTrans = mapStore.transformers.find((transformer) => {
				if (transformer.pkey === mapStore.selectedTransformer.pkey) {
					return transformer;
				}
			});
			selectedTrans.color = '#45FF';
			newTransformerSelection.color = '#db2465';
			mapStore.setSelectedTransformer(newTransformerSelection);
			console.log('Cambiar trans seleccionado');
		} else if (newTransformerSelection.pkey === mapStore.selectedTransformer.pkey) {
			if (!mapStore.modalVisible) {
				newTransformerSelection.color = '#45FF';
				mapStore.setSelectedTransformer();
				console.log('Quitar selección Trans');
			}
		}
		mapRef.current.animateToRegion({
			latitude       : newTransformerSelection.latitude,
			longitude      : newTransformerSelection.longitude,
			// Propiedades del Zoom
			latitudeDelta  : 0.0008,
			longitudeDelta : 0.0008
		});
		mapStore.setFetchedData(true);
	};
	//PROGRAMMATICALLY UNSELECT METER 
	const unselectMeter = () => {
		if (mapStore.selectedMeter) {
			const selectedMeterName = mapStore.meters.find((meter) => {
				if (meter.name === mapStore.selectedMeter.name) {
					return meter;
				}
			})
			mapStore.isMeterUnassignLayer ? selectedMeterName.color = '#ff7a21' : '';
			mapStore.setSelectedMeter();
		}	
	};
	// CANCEL NEW EQUIPMENT BUTTON FUNCTION
	const handleCancelButton = () => {
		equipmentStore.setSearch();
		mapStore.setSearchError();
		mapStore.setSearchNewEquipment();
	};

	// ACCEPT NEW EQUIPMENT BUTTON FUNCTION
	const handleAcceptNewEquipment = () => {
		if (equipmentStore.search.toUpperCase().substring(0, 1) === 'M') {
			__setCurrentMeterMarker();
		}
		else {
			__setCurrentTransformerMarker();
		}
		mapStore.setSearchError();
		mapStore.setSearchNewEquipment();
	};
	//POP ASSIGNED METER FROM MAIN ARRAY
	const refreshMeters = () => {
		const unassignedMeters = mapStore.meters.filter((meter) => meter.name !== mapStore.selectedMeter.name);
		console.log('unassigned meters');
		mapStore.setMeters(unassignedMeters);
		mapStore.setPersistentMeters(unassignedMeters);
		mapStore.setSelectedMeter();
		mapStore.setFetchedData(false);
		mapStore.setFetchedData(true);
	};
	//PUSH NEW METER ASSIGNED OBJ TO ARRAY
	const __handleAssignEquipment = () => {
		if (mapStore.selectedMeter && mapStore.selectedTransformer) {
			let metersAssigned = Object.assign([], mapStore.metersAssigned);
			var date = new Date();
			const fullDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
			//This will hold meters only.
			const meterAssigned = {
				latitude      : mapStore.selectedMeter.latitude,
				longitude     : mapStore.selectedMeter.longitude,
				name          : mapStore.selectedMeter.name,
				xfrmrid       : mapStore.selectedMeter.xfrmrid,
				transformerId : mapStore.selectedTransformer.pkey,
				timestamp     : fullDate,
				isNew         : mapStore.selectedMeter.isNew ? true : false
			};
			metersAssigned.push(meterAssigned);
			mapStore.setMetersAssigned(metersAssigned);
			mapStore.setPersistentMetersAssigned(metersAssigned);
			Alert.alert('', `${t('equipment.meter')} ${mapStore.selectedMeter.name} ${t('assignment.assigned')}`);
			refreshMeters();
		} else {
			alert(t('assignment.msg'));
		}
	};
	//SWITCH BETWEEN METERS ASSIGNED AND UNASSIGNED
	const __handleChangeLayer = () => {
		if (mapStore.metersAssigned) {
			unselectMeter();
			if (mapStore.isMeterUnassignLayer) {
				showMetersAssignedMap(true);
				mapStore.setIsMeterUnassignLayer(false);
			} else {
				showMetersAssignedMap(false);
				mapStore.setOffModal();
				mapStore.setIsMeterUnassignLayer(true);
			}
		} else {
			alert(t('map.polyline.error.empty'));
		}	
	};
	const cloneMetersAssigned = () => {
		let clone = [];
		mapStore.metersAssigned.forEach(meterA => {
			const meterC = {
				latitude      : meterA.latitude,
				longitude     : meterA.longitude,
				name          : meterA.name,
				xfrmrid       : meterA.xfrmrid,
				transformerId : meterA.transformerId,
				timestamp     : meterA.timestamp,
				isNew         : meterA.isNew
			}
			clone.push(meterC);
		});
		return clone;
	};
	// COMPONENTN JSX
	return (
		<SafeAreaViewStyled>
			<StyledView>
				{/* MAP VIEW */}
				<StyledMapView
					provider={PROVIDER_GOOGLE}
					ref={mapRef}
					showsCompass={false}
					showsMyLocationButton={false}
					rotateEnabled={true}
					showsUserLocation={true}
					initialRegion={{
						latitude       :
							configStore.initialPosition ? configStore.initialPosition.latitude :
							configStore.configObject.latitude,
						longitude      :
							configStore.initialPosition ? configStore.initialPosition.longitude :
							configStore.configObject.longitude,
						latitudeDelta  : 0.0015,
						longitudeDelta : 0.005
					}}
					
				>
					{/* NEW METER MARKER */}
					{mapStore.newMeterState && <NewMeterMarker marker={mapStore.newMeterMarker} color="#f542c8" />}

					{/* NEW TRANSFORMER MARKER */}
					{mapStore.newTransformerState && (
						<NewTransformerMarker marker={mapStore.newTransformerMarker} color="#f542c8" />
					)}

					{/* TRANSFORMERS MARKERS */}
					{mapStore.fetchedData && 
					mapStore.transformers &&
						mapStore.transformers.map((transformer) => {
							return (
								<TransformerMarker
									key={transformer.pkey}
									transformer={transformer}
									onPress={handleTransformerSelection}
								/>
							);
						})}

					{/* METERS MARKERS */}
					{mapStore.fetchedData && 
					mapStore.meters &&
						mapStore.meters.map((meter) => {
							return <MeterMarker key={meter.name} meter={meter} onPress={handleMeterSelection} />;
						})}

					{/* POLYLINE COMPONENT */}
					{mapStore.polylineState && (
						<Polyline
							coordinates={mapStore.transMeterCoordinates}
							strokeColors={[ '#5e6673' ]}
							strokeWidth={4}
							strokeColor="#000"
						/>
					)}

					{/* MAPVIEW END */}
				</StyledMapView>

				{mapStore.isMeterUnassignLayer && 
				!mapStore.polylineState &&
					<Modal
					animationType="slide"
					isVisible={mapStore.modalVisible}
					avoidKeyboard={true}
					coverScreen={

							isAndroid ? true :
							false
					}
					onBackButtonPress={() => mapStore.setModalVisible()}
					onBackdropPress={() => mapStore.setModalVisible()}
					swipeDirection={[ 'left', 'right' ]}
					propagateSwipe={true}
					onSwipeComplete={() => mapStore.setModalVisible()}
				>
					<ModalView />
				</Modal>
				}
				{/* OVERLAY VIEW */}

				{/* LOCATION ICON */}
				<MapIcon
					iconName="my-location"
					size={40}
					color={
						mapStore.isLocationLoading ? '#48d104' :
						'#5e6673'
					}
					borderColor={
						mapStore.isLocationLoading ? '#48d104' :
						'#5e6673'
					}
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={getPosition}
					searchError={mapStore.searchError}
					topError={180}
					topOk={100}
					right={15}
					type="mi"
				/>

				{/* SCANNER ICON */}
				{mapStore.isMeterUnassignLayer && 
				!mapStore.polylineState && (<MapIcon
					iconName="qr-code-scanner"
					size={40}
					color="#5e6673"
					borderColor="#5e6673"
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={() => navigation.navigate('Main', { screen: 'Camera' })}
					searchError={mapStore.searchError}
					topError={530}
					topOk={450}
					right={15}
					type="mi"
				/>
				)}
				{/* AREA ICON */}
				{mapStore.isMeterUnassignLayer && (<MapIcon
					iconName="flow-tree"
					size={40}
					color={
						mapStore.polylineState ? '#48d104' :
						'#5e6673'
					}
					borderColor={
						mapStore.polylineState ? '#48d104' :
						'#5e6673'
					}
					borderColor="#5e6673"
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={__handleSetPolyline}
					searchError={mapStore.searchError}
					topError={320}
					topOk={240}
					right={15}
					type="en"
				/>
				)}
				{/* NEW METER ICON */}
				{mapStore.isMeterUnassignLayer && 
				!mapStore.polylineState && 
				(<MeterIcon
					size={40}
					color={

							mapStore.newMeterState || mapStore.isMeterLoading ? '#48d104' :
							'#5e6673'
					}
					borderColor={

							mapStore.newMeterState || mapStore.isMeterLoading ? '#48d104' :
							'#5e6673'
					}
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={__setCurrentMeterMarker}
					searchError={mapStore.searchError}
					topError={390}
					topOk={310}
					right={15}
				/>
				)}
				{/* NEW TRANSFORMER ICON */}
				{mapStore.isMeterUnassignLayer && 
				!mapStore.polylineState &&
				(<TransformerIcon
					size={40}
					color={

							mapStore.newTransformerState || mapStore.isTransformerLoading ? '#48d104' :
							'#5e6673'
					}
					borderColor={

							mapStore.newTransformerState || mapStore.isTransformerLoading ? '#48d104' :
							'#5e6673'
					}
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={__setCurrentTransformerMarker}
					searchError={mapStore.searchError}
					topError={460}
					topOk={380}
					right={15}
				/>
				)}
				{/* ASSIGNMET ICON */}
				{mapStore.selectedMeter &&
				mapStore.selectedTransformer &&
				!mapStore.polylineState &&
				mapStore.isMeterUnassignLayer && (
					<MapIcon
						iconName="assignment-turned-in"
						size={40}
						color={

								mapStore.selectedMeter && mapStore.selectedTransformer ? '#48d104' :
								'#5e6673'
						}
						borderColor={

								mapStore.selectedMeter && mapStore.selectedTransformer ? '#48d104' :
								'#5e6673'
						}
						backgroundColor="rgba(201, 206, 209,0.7)"
						onPress={__handleAssignEquipment}
						searchError={mapStore.searchError}
						topError={180}
						topOk={100}
						left={15}
						type="mi"
					/>
				)}

				{/* GET EQUIPMENT ICON */}
				{(!mapStore.metersAssigned) && (
					<MapIcon
						iconName="get-app"
						size={40}
						color={
							mapStore.isFetchingData && !mapStore.fetchedData ? '#48d104' :
							'#5e6673'
						}
						borderColor={
							mapStore.isFetchingData && !mapStore.fetchedData ? '#48d104' :
						'#5e6673'
						}
						backgroundColor="rgba(201, 206, 209,0.7)"
						onPress={setEquipmentDataAndCoordinates}
						searchError={mapStore.searchError}
						topError={250}
						topOk={170}
						left={15}
						type="mi"
					/>
				)}
				{/* CLEAN EQUIPMENTS ICON */}
				{mapStore.fetchedData && !mapStore.metersAssigned  && (
					<MapIcon
						iconName="cleaning-services"
						size={40}
						color={'#5e6673'}
						borderColor={'#5e6673'}
						backgroundColor="rgba(201, 206, 209,0.7)"
						onPress={__handleResetAssignments}
						searchError={mapStore.searchError}
						topError={320}
						topOk={240}
						left={15}
						type="mi"
					/>
				)}
				{/* LAYERS ICON */}
				{!mapStore.polylineState && (<MapIcon
					iconName="layers"
					size={40}
					color={
							!mapStore.isMeterUnassignLayer ? '#48d104' :
							'#5e6673'
						}
						borderColor={
							!mapStore.isMeterUnassignLayer ? '#48d104' :
							'#5e6673'
						}
					borderColor="#5e6673"
					backgroundColor="rgba(201, 206, 209,0.7)"
					onPress={__handleChangeLayer}
					searchError={mapStore.searchError}
					topError={250}
					topOk={170}
					right={15}
					type="mi"
				/>
				)}

				{/* SEARCHBAR COMPONENT */}
				<SearchbarComponent
					placeholder={t('map.search')}
					onChangeText={__handleLocateEquipment}
					searchError={mapStore.searchError}
					searchNewEquiment={mapStore.searchNewEquipment}
					handleCancelButton={handleCancelButton}
					handleAcceptNewEquipment={handleAcceptNewEquipment}
					value={
						// qrCodeState !== undefined ? qrCodeState :
						equipmentStore.search
					}
					rootStore={rootStore}
				/>

				{/* MAIN VIEW END */}
			</StyledView>
		</SafeAreaViewStyled>
	);
};

// STYLES
const styles = StyleSheet.create(
	{
		//
	}
);

export default inject('rootStore')(observer(MapComponent));
