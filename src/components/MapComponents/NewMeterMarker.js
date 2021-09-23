// MAIN IMPORTS
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// COMPONENT IMPORTS
import MeterSVG from '../MapComponents/MeterSVG';
import { inject, observer } from 'mobx-react';

function NewMeterMarker({ marker, color, rootStore }) {
	const { mapStore } = rootStore;
	const { t } = useTranslation();

	const defaultMeter = {
		title       : t('equipment.meter.new')
	};

	return (
		<Marker key={defaultMeter.title} coordinate={marker} draggable anchor={{ x: 0.5, y: 0.5 }} onDragEnd={res => mapStore.setNewMeterMarker(res.nativeEvent.coordinate)}>
			<MeterSVG color={color} />
			<Callout onPress={() => mapStore.setModalVisible()}>
				<View style={styles.calloutContainer}>
					<Text style={styles.title}>{defaultMeter.title}</Text>
					<Text style={styles.text}>
						{t('configuration.latitude')}: {marker.latitude}
					</Text>
					<Text style={styles.text}>
						{t('configuration.latitude')}: {marker.longitude}
					</Text>
				</View>
			</Callout>
		</Marker>
	);
}

const styles = StyleSheet.create({
	calloutContainer : {
		width        : 200,
		alignContent : 'center'
	},
	title            : {
		textAlign  : 'center',
		fontWeight : 'bold'
	},
	text             : {
		textAlign : 'center'
	}
});

export default inject('rootStore')(observer(NewMeterMarker));
