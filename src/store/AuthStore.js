import { action, makeAutoObservable, observable } from 'mobx';
import { Alert } from 'react-native';
import firebase from '../../config/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Authentication {
	user = {};
	email;
	showPassword = true;
	accessToken = '';

	constructor() {
		makeAutoObservable(this, {
			user               : observable,
			showPassword       : observable,
			accessToken        : observable,
			email              : observable,
			storeEmail         : action,
			setEmail           : action,
			addCurrentUser     : action,
			removeCurrentUser  : action,
			handleShowPassword : action,
			login              : action,
			logout             : action,
			storeAccessToken   : action,
			removeAccessToken  : action,
			register           : action,
			restorePassword    : action
		});
	}

	addCurrentUser(user) {
		this.user = user;
		console.log(this.user);
	}

	removeCurrentUser() {
		this.user = {};
		console.log('User removed');
	}

	handleShowPassword() {
		this.showPassword = !this.showPassword;
		if (this.showPassword) {
			console.log('Show Password enabled');
		} else {
			console.log('Show Password disabled');
		}
		return this.showPassword;
	}

	setAccessToken(accessToken) {
		this.accessToken = accessToken;
		//console.log(this.accessToken);
	}
	setEmail(email){
		this.email = email;
	}
	logout() {
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.removeCurrentUser();
				console.log('Sesión cerrada exitosamente.');
			})
			.catch((error) => {
				Alert.alert('Logout error', `${error.code}`, [ { text: 'OK' } ]);
			});
	}

	//PERSISTENT METHODS
	async register(email, password, username) {
		try {
			const user = await firebase.auth().createUserWithEmailAndPassword(email, password);

			if (user.user) {
				user.user.updateProfile({ displayName: username });
				Alert.alert('User register', 'New user successfully registered', [ { text: 'OK' } ]);
				user.user
					.sendEmailVerification()
					.then(function() {
						console.log(`Verification code sent to ${user.displayName} (${user.email}).`);
					})
					.catch(function(error) {
						console.log(`Error on verification code sending ${error}`);
					});
				return user;
			}
		} catch (error) {
			if (error.code == 'auth/email-already-in-use') {
				Alert.alert('Register error', 'Email already taken', [ { text: 'OK' } ]);
			} else {
				Alert.alert('Register error', `${error.code}`, [ { text: 'OK' } ]);
			}
		}
	}

	async login(email, password) {
		try {
			console.log(email);
			const user = await firebase.auth().signInWithEmailAndPassword(email, password);
			if (user.user) {
				console.log('Successful Sign in');
				this.storeEmail(email);
				this.addCurrentUser(user);
				return user;
			}
		} catch (error) {
			this.logout();
			return error;
		}
	}

	async restorePassword(email, actions) {
		try {
			const unsubscriber = firebase.auth().sendPasswordResetEmail(email);

			if (unsubscriber) {
				Alert.alert('Password Recovery', `An email has been sent to ${email} to reset your password.`, [
					{ text: 'OK' }
				]);
				actions.resetForm();
				return unsubscriber;
			}
		} catch (error) {
			if (error.code == 'auth/user-not-found') {
				Alert.alert('Password Recovery', 'The entered email does not exist.', [ { text: 'OK' } ]);
			} else {
				Alert.alert('Password Recovery error', `${error.code}`, [ { text: 'OK' } ]);
			}
		}
	}

	async storeAccessToken(accessToken) {
		try {
			await AsyncStorage.setItem('accessToken', accessToken);
			this.setAccessToken(accessToken);
			console.log('Access Token created.');
		} catch (error) {
			console.log(error);
		}
	}
	async storeEmail(email) {
		try {
			await AsyncStorage.setItem('email', email);
			console.log('Email recorded.');
		} catch (error) {
			console.log(error);
		}
	}
	async removeAccessToken() {
		try {
			await AsyncStorage.removeItem('accessToken');
			this.setAccessToken('');
		} catch (e) {
			console.log(e);
		}
		console.log('Access Token cleared.');
	}

	async getAccessToken() {
		try {
			const accessToken = await AsyncStorage.getItem('accessToken');
			if (accessToken !== null) {
				this.setAccessToken(accessToken);
				return accessToken;
			} else {
				console.log('No access Token found.');

			}
		} catch (e) {
			console.log(e);
		}
	}
	async getEmail() {
		try {
			const email = await AsyncStorage.getItem('email');
			if (email !== null) {
				this.setEmail(email);
				return email;
			} else {
				console.log('No email found.');
				return false;
			}
		} catch (e) {
			console.log(e);
		}
	}
}

export default Authentication;
