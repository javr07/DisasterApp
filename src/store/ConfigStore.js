import { action, computed, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

class Configuration {
	currentScreen;
	configObject;
	endpointConfigEnabled = false;
	initialPosition;
	region;
	language = 'en';
	isTrackingPos = false;

	constructor() {
		makeAutoObservable(this, {
			currentScreen                : observable,
			configObject                 : observable,
			endpointConfigEnabled        : observable,
			initialPosition              : observable,
			region                       : observable,
			language                     : observable,
			isTrackingPos                : observable,
			setIsTrackingPos             : action,
			setCurrentScreen             : action,
			setConfigObject              : action,
			setEndpointConfigEnabled     : action,
			setInitialPosition           : action,
			setRegion                    : action,
			getPersistentConfigObject    : action,
			setPersistentConfigObject    : action,
			setLanguage                  : action,
			getPersistentLanguage        : action,
			setPersistentLanguage        : action,
			removePersistentConfigObject : action,
			getGeofence                  : computed
		});
	}
	setIsTrackingPos () {
		this.isTrackingPos = !this.isTrackingPos;
	}
	setCurrentScreen(screen) {
		this.currentScreen = screen;
		console.log(this.currentScreen);
	}

	setConfigObject(config) {
		this.configObject = config;
		console.log(this.configObject);
	}

	setEndpointConfigEnabled() {
		this.endpointConfigEnabled = !this.endpointConfigEnabled;
	}

	// PERSISTENT STORAGE
	async getPersistentConfigObject() {
		try {
			const jsonConfigObject = await AsyncStorage.getItem('configObject');
			if (jsonConfigObject != null) {
				this.setConfigObject(JSON.parse(jsonConfigObject));
				console.log('Configuration Object retrieved.');
				console.log(this.configObject);
			}
		} catch (e) {
			console.log(e);
		}
	}

	async setPersistentConfigObject(configObject) {
		try {
			this.setConfigObject(JSON.parse(configObject));
			const response = await AsyncStorage.setItem('configObject', configObject);
			if (response) {
				console.log('Persistent Configuration Stored.');
				return response;
			}
		} catch (error) {
			console.log(error);
		}
	}

	setInitialPosition(position) {
		this.initialPosition = position;
		console.log('Initial position: ');
		console.log(this.initialPosition);
	}

	setRegion(region) {
		this.region = region;
	}

	get getGeofence() {
		return (this.configObject.geofence * 1000).toString();
	}

	setLanguage(index) {
		if (index === 0) {
			this.language = 'en';
		} else if (index === 1) {
			this.language = 'es';
		} else {
			this.language = index;
		}
		i18next.changeLanguage(this.language);
	}

	async getPersistentLanguage() {
		try {
			const language = await AsyncStorage.getItem('language');
			if (language != null) {
				console.log('Configuration Language retrieved: ', language);
				this.setLanguage(language);
				return language;
			} else {
				console.log('No Language found');
				this.setLanguage('en');
				language = 'en';
				return language;
			}
		} catch (e) {
			console.log(e);
		}
	}

	async setPersistentLanguage(index) {
		try {
			this.setLanguage(index);
			const response = await AsyncStorage.setItem('language', this.language);
			if (response) {
				console.log('Persistent Language Stored.');
				console.log(this.language);
				i18next.changeLanguage(this.language);
				return response;
			} else {
				console.log('Language not stored');
			}
		} catch (error) {
			console.log(error);
		}
	}

	async removePersistentConfigObject() {
		try {
			await AsyncStorage.removeItem('configObject');
			console.log('Configuración borrada');
		} catch (error) {
			console.log(error);
		}
	}
}

export default Configuration;
