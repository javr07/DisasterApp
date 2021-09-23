import React from 'react';
import { View, StyleSheet } from 'react-native';
import MeterSVG from './MeterSVG';

function MeterIcon({ size, color, borderColor, backgroundColor, onPress, searchError, topError, topOk, left, right }) {
	return (
		<View
			style={{
				...styles.view,
				top             :
					searchError ? topError :
					topOk,
				backgroundColor : backgroundColor,
				borderColor     : borderColor,
				left            :
					left ? left :
					null,
				right           :
					right ? right :
					null
			}}
		>
			<MeterSVG color={color} onPress={onPress} size={size} />
		</View>
	);
}

const styles = StyleSheet.create({
	view : {
		alignContent   : 'center',
		justifyContent : 'center',
		borderWidth    : 4,
		borderRadius   : 20,
		width          : 55,
		padding        : 4,
		position       : 'absolute'
	}
});

export default MeterIcon;
