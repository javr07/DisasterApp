import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EquipmentMap {
	marker;
	newMeterMarker;
	newTransformerMarker;
	selectedMeter = undefined;
	selectedTransformer = undefined;
	polylineState = undefined;
	searchNewEquipment = false;
	modalVisible = false;
	searchError = null;
	meters;
	metersAssigned;
	temporalMeters;
	transformers;
	transMeterCoordinates;
	fetchedData = false;
	isFetchingData = false;
	newMeterState = false;
	isMeterLoading = false;
	isTransformerLoading = false;
	newTransformerState = false;
	isMeterUnassignLayer = true;
	isLocationLoading = false;

	constructor() {
		makeAutoObservable(this, {
			marker                   : observable,
			newMeterMarker           : observable,
			newTransformerMarker     : observable,
			selectedMeter            : observable,
			selectedTransformer      : observable,
			polylineState            : observable,
			searchNewEquipment       : observable,
			modalVisible             : observable,
			searchError              : observable,
			meters                   : observable,
			metersAssigned           : observable,
			temporalMeters           : observable,	
			transformers             : observable,
			newTransformers          : observable,
			transMeterCoordinates    : observable,
			fetchedData              : observable,
			newMeterState            : observable,
			isFetchingData           : observable,     
			newTransformerState      : observable,
			isMeterUnassignLayer     : observable,
			isMeterLoading           : observable,
			isTransformerLoading     : observable,
			isLocationLoading        : observable,
			setMarker                : action,
			setNewMeterMarker        : action,
			setNewTransformerMarker  : action,
			setSelectedMeter         : action,
			setSelectedTransformer   : action,
			setPolylineState         : action,
			setSearchNewEquipment    : action,
			setSearchError           : action,
			setMeters                : action,
			setTransformers          : action,
			setFetchedData           : action,
			setIsFetchingData        : action,
			setNewMeterState         : action,
			setNewTransformerState   : action,
			setMetersAssigned        : action,
			setTransMeterCoordinates : action,
			setModalVisible          : action,
			setIsMeterUnassignLayer  : action,
			setOffModal              : action,
			setModalVisible          : action,
			setIsMeterLoading        : action,
			setIsTransformerLoading  : action,
			setIsLocationLoading     : action
		});
	}

	setMarker(marker) {
		this.marker = marker;
		console.log('New Marker setted');
	}

	setNewMeterMarker(marker) {
		if (marker) {
			var lat = Math.pow(10, 7);
    		lat = Math.trunc(lat * marker.latitude) / lat;
			var lon = Math.pow(10, 7);
    		lon = Math.trunc(lon * marker.longitude) / lon;
			const coordinate = {
				latitude: lat,
				longitude: lon
			}
			this.newMeterMarker = coordinate;
			console.log('New Meter setted');
			console.log(this.newMeterMarker);
		} else {
			this.newMeterMarker = null;
			console.log('New Meter marker removed');
		}
		return this.newMeterMarker;
	}
	setNewTransformerMarker(marker) {
		if (marker) {
			var lat = Math.pow(10, 7);
    		lat = Math.trunc(lat * marker.latitude) / lat;
			var lon = Math.pow(10, 7);
    		lon = Math.trunc(lon * marker.longitude) / lon;
			const coordinate = {
				latitude: lat,
				longitude: lon
			}
			this.newTransformerMarker = coordinate;
			console.log('New Transformer setted');
			console.log(this.newTransformerMarker);
		} else {
			this.newTransformerMarker = null;
			console.log('New Transformer marker removed');
		}
		return this.newTransformerMarker;
	}

	setSelectedMeter(meter) {
		this.selectedMeter = meter;
		console.log('Meter selected: ');
		console.log(this.selectedMeter);
	}

	setSelectedTransformer(transformer) {
		this.selectedTransformer = transformer;
		console.log('Transformer selected: ');
		console.log(this.selectedTransformer);
	}

	setPolylineState(state) {
		this.polylineState = state;
		if (this.polylineState) {
			console.log('Polyline enabled.');
		} else {
			console.log('Polyline disabled.');
		}
		return this.polylineState;
	}
	setIsMeterUnassignLayer(state) {
		this.isMeterUnassignLayer = state;
		return this.isMeterUnassignLayer;
	}
	setSearchNewEquipment(state) {
		this.searchNewEquipment = state;
	}

	setSearchError(state) {
		this.searchError = state;
	}

	setMeters(meters) {
		this.meters = meters;
		console.log('Meters: ');
		console.log(this.meters);
		return this.meters;
	}
	setTemporalMeters(meters){
		this.temporalMeters = meters;
		return this.temporalMeters;
	}
	setMetersAssigned(meters) {
		this.metersAssigned = meters;
		console.log('Meters assigned: ');
		console.log(this.metersAssigned);
		return this.metersAssigned;
	}
	setTransformers(transformers) {
		this.transformers = transformers;
		console.log('Transformers: ');
		console.log(this.transformers);
		return this.transformers;
	}
	setTransMeterCoordinates(coordinates) {
		this.transMeterCoordinates = coordinates;
		console.log('transMeter coordinates changed: ');
		return this.transMeterCoordinates;
	}
	setIsFetchingData() {
		this.isFetchingData = !this.isFetchingData;
		return this.isFetchingData;
	}
	setFetchedData(state) {
		this.fetchedData = state;
		return this.fetchedData;
	}
	setNewMeterState(state) {
		this.newMeterState = state;
		return this.newMeterState;
	}

	setNewTransformerState(state) {
		this.newTransformerState = state;
		return this.newTransformerState;
	}

	setModalVisible() {
		this.modalVisible = !this.modalVisible;
		if (this.modalVisible) {
			console.log('Modal enabled');
		} else {
			console.log('Modal disabled');
		}
	}
	setOffModal() {
		this.modalVisible = false;
		console.log('Modal disabled');
	}
	setIsMeterLoading() {
		this.isMeterLoading = !this.isMeterLoading;
		return this.isLoading;
	}
	setIsTransformerLoading() {
		this.isTransformerLoading = !this.isTransformerLoading;
		return this.isLoading;
	}
	setIsLocationLoading(){
		this.isLocationLoading = !this.isLocationLoading;
		return this.isLocationLoading;
	}

	// PERSISTENT STORAGE
	async getPersistentMeters() {
		try {
			const jsonMetersObject = await AsyncStorage.getItem('metersObject');
			if (jsonMetersObject != null) {
				console.log('Meters retrieved.');
				this.setMeters(JSON.parse(jsonMetersObject));
				this.setFetchedData(true);
			}
		} catch (e) {
			console.log(e);
		}
	}
	async setPersistentMeters(metersObj) {
		try {
			const response = await AsyncStorage.setItem('metersObject', JSON.stringify(metersObj));
			if (response) {
				console.log('Persistent meters stored.');
			}
		} catch (error) {
			console.log(error);
		}
	}
	async removePersistentMeters() {
		try {
			const response = await AsyncStorage.removeItem('metersObject');
			if (response) {
				console.log('Persistent meters removed.');
			}
		} catch (error) {
			console.log(error);
		}
	}
	async setPersistentTransformers(transformersObj) {
		try {
			const response = await AsyncStorage.setItem('transformersObject', JSON.stringify(transformersObj));
			if (response) {
				console.log('Persistent transformers stored.');
			}
		} catch (error) {
			console.log(error);
		}
	}
	async getPersistentTransformers() {
		try {
			const jsonTransformersObject = await AsyncStorage.getItem('transformersObject');
			if (jsonTransformersObject != null) {
				console.log('transformers retrieved.');
				this.setTransformers(JSON.parse(jsonTransformersObject));
			}
		} catch (e) {
			console.log(e);
		}
	}
	async removePersistentTransformers() {
		try {
			const response = await AsyncStorage.removeItem('transformersObject');
			if (response) {
				console.log('Persistent transformers removed.');
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getPersistentMetersAssigned() {
		try {
			const jsonMetersAssignedObject = await AsyncStorage.getItem('metersAssignedObject');
			if (jsonMetersAssignedObject != null) {
				console.log(' Meters assigned retrieved.');
				this.setMetersAssigned(JSON.parse(jsonMetersAssignedObject));	
			}
		} catch (e) {
			console.log(e);
		}
	}
	async setPersistentMetersAssigned(metersAssignedObj) {
		try {
			const response = await AsyncStorage.setItem('metersAssignedObject', JSON.stringify(metersAssignedObj));
			if (response) {
				console.log('Persistent meters assigned stored.');
			}
		} catch (error) {
			console.log(error);
		}
	}
	async removePersistentMetersAssigned() {
		try {
			const response = await AsyncStorage.removeItem('metersAssignedObject');
			if (response) {
				console.log('Persistent meters assigned removed.');
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default EquipmentMap;
