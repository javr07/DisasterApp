import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Equipment {
	qrCode = undefined;
	search = '';

	constructor() {
		makeAutoObservable(this, {
			qrCode    : observable,
			search    : observable,
			setQRcode : action,
			setSearch : action
		});
	}

	setQRcode(qrCode) {
		this.qrCode = qrCode;
		console.log('Scanned QR Code: ');
		console.log(qrCode);
	}

	setSearch(search) {
		this.search = search;
	}
}

export default Equipment;
