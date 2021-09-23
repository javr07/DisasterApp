// MAIN IMPORTS
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Table, Row } from 'react-native-table-component';

import { useTranslation } from 'react-i18next';

const image = require('../../assets/background.png');

function TasksListScreen({ navigation, rootStore }) {
	const { mapStore, configStore } = rootStore;
	const { t } = useTranslation();
	const [ assignedArrayTable, setAssignedArrayTable] = useState([]);
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			assignedArray();
			configStore.setCurrentScreen('Task Screen');
			return unsubscribe;
		});
	}, []);

	const tableHead = [t('equipment.meter'), t('equipment.transformer'), t('task.table.header.new')];
	const widthArr = [100, 140, 130];
	const assignedArray = () => {
		let metersArray = [];
		if(mapStore.metersAssigned){
			metersArray = mapStore.metersAssigned.map((meter) => {
				const meterTable = [
					meter.name,
					meter.transformerId,
					meter.isNew ? t('task.table.new') : t('task.table.existent')
				]
				return meterTable;
			});
			console.log('Meters assigned for table');
		}
		setAssignedArrayTable(metersArray);
	}

	// COMPONENT JSX
	return (
		<ImageBackground style={styles.image} source={image}>
			<View style={{width:'90%', paddingTop: 30 }}>
				<View style={{flexDirection: 'row', padding: 20}}>
					<Text style={styles.label}>{t('task.table.total') + ': '}</Text>
					<Text style={styles.label}>{assignedArrayTable ? assignedArrayTable.length : 0}</Text>
				</View>
				<ScrollView horizontal={true}>
					<View>
						<Table borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
							<Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.textHeader}/>
						</Table>
						<ScrollView style={styles.dataWrapper}>
							<Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
								{
									assignedArrayTable.map((rowData) => (
										<Row
											key={rowData[0]}
											data={rowData}
											widthArr={widthArr}
											style={{backgroundColor: '#fff'}}
											textStyle={styles.text}
										/>
									))
								}
							</Table>
						</ScrollView>
					</View>
				</ScrollView>
			</View>
		</ImageBackground>

	);
}

const styles = StyleSheet.create({
	image : {
		flex       : 1,
		resizeMode : 'cover',
		alignItems : 'center'
	},
	head: { 
		height: 65,
		backgroundColor: '#13105e'
	},
	textHeader: {
		color: 'white',
		fontSize: 14,
		fontWeight : 'bold',
		padding: 5,
	},
	label              : {
		color      : 'white',
		alignSelf  : 'baseline',
		fontSize   : 18,
		fontWeight : 'bold'
	},
  	text: { 
		margin: 6 
	},
	dataWrapper: { marginTop: -1 }
});

export default inject('rootStore')(observer(TasksListScreen));
