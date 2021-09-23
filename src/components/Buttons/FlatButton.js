import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

const FlatButton = ({ text, onPress, color }) => {
	return (
		<View style={styles.newMeterButtonView}>
			<TouchableOpacity onPress={onPress}>
				<View
					style={{
						borderRadius      : 8,
						paddingVertical   : 12,
						paddingHorizontal : 10,
						backgroundColor   : color,
						width             : '70%',
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
	newMeterButtonView : {
		position     : 'absolute',
		bottom       : 0,
		marginBottom : 20,
		width        : '100%',
		padding      : 30
	},
	buttonText         : {
		color         : 'white',
		fontWeight    : 'bold',
		textTransform : 'uppercase',
		fontSize      : 16,
		textAlign     : 'center'
	}
});

export default FlatButton;
