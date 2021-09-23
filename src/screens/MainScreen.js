// MAIN IMPORTS
import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { inject, observer } from 'mobx-react';
import Constants from 'expo-constants';

// COMPONENTS IMPORTS
import CameraComponent from '../components/CameraComponents/CameraComponent';
import MapComponent from '../components/MapComponents/MapComponent';
import ConfigScreen from './ConfigScreen';
import TasksListScreen from './TasksListScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
const isAndroid = Platform.OS === 'android';

// COMPONENT
const MainContainerComponent = ({ navigation, rootStore }) => {
	const { authStore, mapStore, configStore } = rootStore;
	const { t } = useTranslation();
	const { user } = authStore;

	const Drawer = createDrawerNavigator();

	const __handleLogout = () => {
		authStore.logout();
		navigation.navigate('Login');
	};

	const __handleNavigationToMap = () => {
		navigation.navigate('Map');
	};
	const getCleanTransformers = () => {
		const newTransformers = mapStore.transformers.filter((transformer) => transformer.timestamp);
		var cleanTransformers = [];
		newTransformers.forEach(transformer => {
			const cleanTransformer = {
				latitude: transformer.latitude,
				longitude: transformer.longitude,
				name: transformer.name,
				pkey: transformer.pkey,
				isNew: transformer.isNew,
				timestamp: transformer.timestamp
			}
			cleanTransformers.push(cleanTransformer);
		});
		return cleanTransformers;
	}
	const __handleDownload = async () => {
		if (mapStore.metersAssigned) {
			var endpoint = configStore.configObject.endpoint;
			const cleanTransformers = getCleanTransformers();
			var urlBase = endpoint.slice(0, endpoint.lastIndexOf('/'));
			const postData = {
				userId         : authStore.user.user.email,
				assignedMeters : mapStore.metersAssigned,
				newTransformers: cleanTransformers
			};
			const requestOptions = {
				method  : 'POST',
				headers : {
					Accept         : 'application/json',
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify(postData)
			};
			console.log(requestOptions);
			try {
				fetch(urlBase + '/setEquip', requestOptions)
					.then((response) => response.json()) 
					.then((data) => {
						if (data.status == 200) {
							Alert.alert('', t('menu.upload.ok'));
							console.log(data);
							mapStore.setMetersAssigned(); //This will erase them locally
							mapStore.removePersistentMetersAssigned();
							mapStore.setFetchedData(false); //TO FORCE UPDATE THE MAP
							mapStore.setFetchedData(true);
						} else {
							console.log(data);
							Alert.alert('Error ' + data.status, t('menu.upload.badExternal'));
						}
					});
			} catch (error) {
				Alert.alert('', t('menu.upload.badInternal'));
			}
		} else {
			Alert.alert('', t('menu.upload.empty'));
		}
	};
	useEffect(() => {
		// __handleBackButton();
	}, []);

	// CUSTOM BOTTOM DRAWER CONTENT
	function DrawerItems(props) {
		return (
			<SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
				<DrawerContentScrollView {...props}>
					<DrawerItemList {...props} />
				</DrawerContentScrollView>
				<View>
					<DrawerItem
						label={t('menu.download')}
						icon={() => <Icon name="ios-share" size={30} color="#148fe0" />}
						onPress={__handleDownload}
						style={{ marginBottom: 8, marginLeft: 5 }}
					/>
					{user.user &&
					user.user.displayName && (
						<DrawerItem
							label={user.user.displayName}
							icon={() => <FontAwesomeIcon name="user-cog" size={21} color="#148fe0" />}
							onPress={() => alert('To do')}
						/>
					)}
					<DrawerItem
						label={t('menu.logout')}
						icon={() => <FontAwesomeIcon name="sign-out-alt" size={25} color="#148fe0" />}
						onPress={__handleLogout}
					/>
					<DrawerItem label={`${t('menu.version')} v${Constants.manifest.version}`} style={{ left: 150 }} />
				</View>
			</SafeAreaView>
		);
	}

	// COMPONENT JSX
	return (
		<Drawer.Navigator
			screenOptions={{
				headerRight      : () => (
					<Icon
						name="menu"
						size={30}
						color={

								isAndroid ? '#FFF' :
								'#148fe0'
						}
						style={{ marginRight: 20 }}
						onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
					/>
				),

				headerStyle      : {
					backgroundColor         :
						isAndroid ? '#45FF' :
						'#FFF',
					height                  : 50,
					borderBottomLeftRadius  :
						isAndroid ? 25 :
						0,
					borderBottomRightRadius :
						isAndroid ? 25 :
						0,
					borderTopLeftRadius     :
						isAndroid ? 25 :
						0,
					borderTopRightRadius    :
						isAndroid ? 25 :
						0,
					marginTop               :
						isAndroid ? 5 :
						0,
					marginHorizontal        :
						isAndroid ? 5 :
						0
				},
				headerTitleStyle : {
					color :
						isAndroid ? '#FFF' :
						'#000'
				},
				headerTintColor  : '#FFF',
				headerTitleAlign : 'center',
				headerShown      : true
			}}
			drawerContent={(props) => {
				return <DrawerItems {...props} />;
			}}
			drawerStyle={{ justifyContent: 'space-between' }}
		>
			<Drawer.Screen
				name="Map"
				component={MapComponent}
				initialParams={{ QRCode: undefined }}
				options={{
					title      : t('menu.map'),
					headerLeft : () => null,
					drawerIcon : () => <Icon name="explore" size={25} color="#148fe0" />
				}}
			/>
			<Drawer.Screen
				name="Camera"
				component={CameraComponent}
				options={{
					headerShown :
						isAndroid ? false :
						true,
					title       : t('menu.camera'),
					headerLeft  : () => <HeaderBackButton onPress={__handleNavigationToMap} label={t('menu.map')} />,
					drawerIcon  : () => <Icon name="camera-alt" size={25} color="#148fe0" />
				}}
			/>
			<Drawer.Screen
				name="Config"
				component={ConfigScreen}
				options={{
					headerShown :
						isAndroid ? false :
						true,
					title       : t('menu.parameters'),
					headerLeft  : () => <HeaderBackButton onPress={__handleNavigationToMap} label={t('menu.map')} />,
					drawerIcon  : () => <Icon name="settings" size={25} color="#148fe0" />
				}}
			/>
			<Drawer.Screen
				name="Tasks"
				component={TasksListScreen}
				options={{
					headerShown :
						isAndroid ? false :
						true,
					title       : t('menu.tasks'),
					headerLeft  : () => <HeaderBackButton onPress={__handleNavigationToMap} label={t('menu.map')} />,
					drawerIcon  : () => <Icon name="assignment" size={25} color="#148fe0" />
				}}
			/>
		</Drawer.Navigator>
	);
};

export default inject('rootStore')(observer(MainContainerComponent));
