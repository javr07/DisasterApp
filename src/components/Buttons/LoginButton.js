import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

const FlatButton = ({ text, onPress, color, borderRadius, width, marginTop, marginBottom, disabled }) => {
	return (
		<View style={styles.newMeterButtonView}>
			<TouchableOpacity onPress={onPress} disabled={disabled}>
				<View
					style={{
						borderRadius      : borderRadius,
						paddingVertical   : 12,
						paddingHorizontal : 10,
						backgroundColor   : color,
						width             : width,
						marginTop         : marginTop,
						marginBottom      : marginBottom,
						alignSelf         : 'center'
					}}
				>
					<Text allowFontScaling={false} style={styles.buttonText}>
						{text}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
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
