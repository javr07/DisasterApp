import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function CameraIcon({ onPress, name, size, color, left, top, bottom, right }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				position : 'absolute',
				left     : left,
				top      : top,
				bottom   : bottom,
				right    : right,
				height   : size,
				width    : size
			}}
		>
			<Text allowFontScaling={false}>
				<Icon name={name} size={size} color={color} />
			</Text>
		</TouchableOpacity>
	);
}

export default CameraIcon;
