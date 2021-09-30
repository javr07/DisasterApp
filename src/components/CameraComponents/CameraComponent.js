// MAIN IMPORTS
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground} from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';

// COMPONENTS IMPORTS
import CameraIcon from './CameraIcon';

// COMPONENT
const CameraComponent = ({ navigation, rootStore }) => {
	// STATES
	const { configStore, cameraStore } = rootStore;
	const { hasPermission, type, flashMode } = cameraStore;

	const isFocused = useIsFocused();
	const cameraRef = useRef(null);
	const [isPreviewVisible, setPreviewVisible] = useState(false)
  	const [capturedImage, setCapturedImage] = useState(null)
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			cameraStore.setHasPermission(status === 'granted');
		})();
		const unsubscribe = navigation.addListener('focus', () => {
			configStore.setCurrentScreen('Camera Screen');
			return unsubscribe;
		});
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

	const __handleTakePicture = async () => {
		if (!cameraRef) return;
		const photo = await cameraRef.current.takePictureAsync();
		setPreviewVisible(true);
		setCapturedImage(photo);
	};
	const __handleRetakePicture = () => {
		setCapturedImage(null);
		setPreviewVisible(false);
	};
	const __handleSaveCurrent = async () => {
		console.log(capturedImage); //SEND THIS PHOTO TO THE NEXT COMPONENT
		const reportId = 2; //Primero enviar el reporte y después enviar la foto con el ID del reporte.
		const response = await uploadPhoto(reportId, capturedImage); //OJO ESTO ES LENTO
		if(response.status == 200) {
			alert('OK. Foto guardada');
		} else {
			alert('ERROR externo, no se pudo guardar');
		}		
		//navigation.navigate('Map');
	};
	const uploadPhoto = (reportId, data) => {
		var formData = new FormData();
		formData.append('image', { uri: data.uri, name: 'image.jpg', type: 'image/jpg'});
		let options = {
		  headers: {
			'Content-Type': 'multipart/form-data'
		  },
		  method: 'POST',
		  body: formData
		};
		console.log(options);
		const path = `http://187.189.23.174:8008/api/itddo/saveReportPhoto/${reportId}`;
		return fetch(path, options)
			.then(response => response.json()) 
			.then(responseJson => {
				return responseJson;
			}).catch(() => {
				alert('ERROR interno, no se pudo enviar');
			});
	  }

	// COMPONENT JSX
	return (
		<View style={styles.container}>
			{isFocused && !isPreviewVisible? (
				<Camera 
					ref={cameraRef}
					style={styles.container} 
					type={type} 
					flashMode={flashMode}>
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
						{/* SHUTTER ICON */}
						<CameraIcon
							onPress={__handleTakePicture}
							left="40%"
							bottom="3%"
							size={80}
							name="camera"
							color="#ffff"
						/>
					</View>
				</Camera>
			):
			(
				<View
				style={{
					backgroundColor: 'transparent',
					flex: 1,
					width: '100%',
					height: '100%'
				}}
				>
				<ImageBackground
					source={{uri: capturedImage && capturedImage.uri}}
					style={{
					flex: 1
					}}
				>
					<View style={styles.container}>
						{/* SAVE ICON */}
						<CameraIcon
							onPress={__handleSaveCurrent}
							right="20%"
							bottom="3%"
							size={65}
							name="check-circle"
							color="#69b00b"
						/>
						{/* RETAKE ICON */}
						<CameraIcon
							onPress={__handleRetakePicture}
							left="20%"
							bottom="3%"
							size={65}
							name="cancel"
							color="#e70d4f"
						/>
					</View>

				</ImageBackground>
				</View>
			)
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container : {
		flex : 1
	}
});

export default inject('rootStore')(observer(CameraComponent));
