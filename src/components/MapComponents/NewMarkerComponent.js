import React from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Marker } from 'react-native-maps';

// SVG COMPONENTS
import MeterSVG from './MeterSVG';
import { View } from 'react-native';

const NewMarkerComponent = ({ rootStore }) => {
	const { mapStore } = rootStore;

	const { marker } = mapStore;

	const setCurrentMarker = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = parseFloat(position.coords.latitude);
				const long = parseFloat(position.coords.longitude);

				const initialRegion = {
					latitude  : lat,
					longitude : long
				};

				setMarker(initialRegion);
			},
			(error) => console.log(JSON.stringify(error)),
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
		);
	};

	return (
		<View>
			{marker.latitude && (
				<Marker
					key={defaultMeter.title}
					coordinate={marker}
					title={defaultMeter.title}
					description={defaultMeter.description}
					anchor={{ x: 0.5, y: 0.5 }}
				>
					<MeterSVG color="#25FF" />
				</Marker>
			)}
		</View>
	);
};

export default inject('rootStore')(observer(NewMarkerComponent));
