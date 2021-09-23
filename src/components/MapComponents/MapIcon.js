import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

function MapIcon({
	iconName,
	size,
	color,
	borderColor,
	backgroundColor,
	onPress,
	searchError,
	topError,
	topOk,
	left,
	right,
	type
}) {
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
			{
				type === 'mi' ? <Icon name={iconName} size={size} color={color} onPress={onPress} /> :
				<EntypoIcon name={iconName} size={size} color={color} onPress={onPress} />}
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

export default MapIcon;
