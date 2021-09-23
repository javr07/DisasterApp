// MAIN IMPORTS
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';

// COMPONENTS IMPORTS
import CameraIcon from './CameraIcon';
import IonIcon from './IonIcon';

// COMPONENT
const CameraComponent = ({ navigation, rootStore }) => {
	// STATES
	const { configStore, cameraStore, equipmentStore } = rootStore;

	const { hasPermission, type, flashMode } = cameraStore;

	const isFocused = useIsFocused();

	// HANDLE BACKBUTTON
	// const __handleBackButton = () => {
	// 	setCurrentScreen('Camera Screen');
	// 	const backAction = () => {
	// 		if (currentScreen === 'Camera Screen') {
	// 			navigation.navigate('Map');
	// 		}
	// 	};

	// 	const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

	// 	return () => backHandler.remove();
	// };

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			cameraStore.setHasPermission(status === 'granted');
		})();
		const unsubscribe = navigation.addListener('focus', () => {
			configStore.setCurrentScreen('Camera Screen');
			return unsubscribe;
		});
		// __handleBackButton();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	// FUNCTIONS
	const __handleFlashMode = () => {
		cameraStore.setFlashMode(

				flashMode === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch :
				Camera.Constants.FlashMode.off
		);
	};

	const __handleCameraType = () => {
		cameraStore.setType(

				type === Camera.Constants.Type.back ? Camera.Constants.Type.front :
				Camera.Constants.Type.back
		);
	};

	const __handleGetQRCode = (e) => {
		const meterQR = ('M' + e.data.toUpperCase()).split(' ')[0];
		equipmentStore.setQRcode(meterQR);
		navigation.navigate('Map');
	};

	// COMPONENT JSX
	return (
		<View style={styles.container}>
			{isFocused && (
				<Camera style={styles.container} type={type} onBarCodeScanned={__handleGetQRCode} flashMode={flashMode}>
					<View style={styles.container}>
						{/* FLIP CAMERA ICON */}
						<CameraIcon
							onPress={__handleCameraType}
							left="5%"
							top="3%"
							size={40}
							name="flip-camera-ios"
							color="rgba(225, 228, 232,0.7)"
						/>

						{/* FLASH MODE ICON */}
						{
							flashMode === Camera.Constants.FlashMode.torch ? <CameraIcon
								onPress={__handleFlashMode}
								left="85%"
								top="3%"
								size={40}
								name="flash-on"
								color="#e8df5a"
							/> :
							<CameraIcon
								onPress={__handleFlashMode}
								left="85%"
								top="3%"
								size={40}
								name="flash-off"
								color="rgba(225, 228, 232,0.7)"
							/>}

						{/* SCANNER ICON */}
						<IonIcon right="0%" top="25%" name="scan-outline" size={400} color="rgba(225, 228, 232,0.3)" />
					</View>
				</Camera>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container : {
		flex : 1
	}
});

export default inject('rootStore')(observer(CameraComponent));
