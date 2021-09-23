import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FlatButton = ({ text, onPress, color, borderColor }) => {
	return (
		<TouchableOpacity onPress={onPress} style={{ width: '50%' }}>
			<View
				style={{
					paddingVertical : 7,
					backgroundColor : color,
					justifyContent  : 'space-between',
					borderTopColor  : borderColor,
					borderTopWidth  : 2
				}}
			>
				<Text allowFontScaling={false} style={styles.buttonText}>
					{text}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonText : {
		color         : 'white',
		fontWeight    : 'bold',
		textTransform : 'uppercase',
		fontSize      : 16,
		textAlign     : 'center'
	}
});

export default FlatButton;
