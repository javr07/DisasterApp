// MAIN IMPORTS
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';

// COMPONENT IMPORTS
import MeterSVG from '../MapComponents/MeterSVG';

function MeterMarker({ meter, onPress, rootStore }) {
	const { mapStore } = rootStore;
	const { t } = useTranslation();
	return (
		<Marker
			key={meter.name}
			coordinate={{ latitude: meter.latitude, longitude: meter.longitude }}
			anchor={{ x: 0.5, y: 0.5 }}
			onPress={(e) => onPress(e, meter.name)}
		>
			<MeterSVG
				color={

						meter.color ? meter.color :
						'#ff7a21'
				}
			/>
			<Callout>
				<View style={styles.calloutContainer}>
					<Text style={styles.title}>{t('equipment.meter')}</Text>
					<Text style={styles.text}>
						{meter.name}
					</Text>
					<Text style={styles.text}>
						{t('configuration.latitude')}: {meter.latitude}
					</Text>
					<Text style={styles.text}>
						{t('configuration.longitude')}: {meter.longitude}
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

export default inject('rootStore')(observer(MeterMarker));
