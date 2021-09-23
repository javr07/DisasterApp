// MAIN IMPORTS
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

// STYLE IMPORTS
import { theme } from '../infrastructure/theme';

// COMPONENT IMPORTS
import SearchbarButton from './Buttons/SearchbarButton';

// DEVICE CONST
const isAndroid = Platform.OS === 'android';

// COMPONENT
const SearchbarComponent = ({
	placeholder,
	onChangeText,
	value,
	searchError,
	searchNewEquiment,
	handleCancelButton,
	handleAcceptNewEquipment,
	rootStore
}) => {
	const { t } = useTranslation();
	const { mapStore } = rootStore;
	// COMPONENT JSX
	return (
		<View style={styles.searchbarView}>
			<View style={styles.container}>
				{
					isAndroid ? <Searchbar
						placeholder={placeholder}
						onChangeText={onChangeText}
						value={value}
						allowFontScaling={false}
					/> :
					<Searchbar
						placeholder={placeholder}
						onChangeText={onChangeText}
						value={value}
						cancelIcon={true}
						showCancel={true}
						allowFontScaling={false}
					/>}

				{searchError && (
					<View style={styles.searchError}>
						<Text allowFontScaling={false} style={styles.searchErrorText}>
							{searchError}
						</Text>
						{mapStore.isMeterUnassignLayer && 
						!mapStore.polylineState && 
						searchNewEquiment && (
							<View style={styles.newEquipmentButtons}>
								<SearchbarButton
									text={t('msg.cancel')}
									color="#ed736b"
									onPress={handleCancelButton}
									borderColor="#ff9c9c"
								/>
								<SearchbarButton
									text={t('msg.accept')}
									color="#15ba09"
									onPress={handleAcceptNewEquipment}
									borderColor="#ff9c9c"
								/>
							</View>
						)}
					</View>
				)}
			</View>
		</View>
	);
};

// STYLES
const styles = StyleSheet.create({
	searchbarView       : {
		position  : 'absolute',
		top       : 0,
		width     : '100%',
		padding   : 15,
		marginTop :
			isAndroid ? 0 :
			0
	},
	container           : {
		padding : parseInt(theme.space[2].substr(0, 1))
	},
	searchError         : {
		backgroundColor : '#f0ebeb',
		borderRadius    : 5,
		borderWidth     : 2,
		borderColor     : '#ff9c9c'
	},
	searchErrorText     : {
		textAlign : 'center',
		padding   : 10
	},
	newEquipmentButtons : {
		flex           : 1,
		flexDirection  : 'row',
		justifyContent : 'space-around'
	}
});

export default SearchbarComponent;
