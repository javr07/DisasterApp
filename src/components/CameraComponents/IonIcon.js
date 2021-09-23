import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function IonIcon({ left, top, right, name, size, color }) {
	return (
		<Text
			style={{
				position : 'absolute',
				right    : right,
				top      : top
			}}
			allowFontScaling={false}
		>
			<Icon name={name} size={size} color={color} />
		</Text>
	);
}

export default IonIcon;
