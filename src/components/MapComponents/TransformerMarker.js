// MAIN IMPORTS
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';

// COMPONENT IMPORTS
import TransformerSVG from '../MapComponents/TransformerSVG';

function TransformerMarker({ transformer, onPress, rootStore }) {
	const { mapStore } = rootStore;
	const { t } = useTranslation();
	return (
		<Marker
			key={transformer.pkey}
			coordinate={{ latitude: transformer.latitude, longitude: transformer.longitude }}
			anchor={{ x: 0.5, y: 0.5 }}
			onPress={(e) => onPress(e, transformer.pkey)}
		>
			<TransformerSVG
				color={

						transformer.color ? transformer.color :
						'#45FF'
				}
			/>
			<Callout onPress={() => mapStore.setModalVisible()}>
				<View style={styles.calloutContainer}>
					<Text style={styles.title}>{t('equipment.transformer')}</Text>
					<Text style={styles.text}>
						{transformer.name ? transformer.name : ''}
					</Text>
					<Text style={styles.text}>
						{transformer.pkey}
					</Text>
					<Text style={styles.text}>
						{t('configuration.latitude')}: {transformer.latitude}
					</Text>
					<Text style={styles.text}>
						{t('configuration.longitude')}: {transformer.longitude}
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

export default inject('rootStore')(observer(TransformerMarker));
