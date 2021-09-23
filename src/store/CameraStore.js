import { action, makeAutoObservable, observable } from 'mobx';
import { Camera } from 'expo-camera';
class CameraScanner {
	hasPermission = null;
	type = Camera.Constants.Type.back;
	flashMode = Camera.Constants.FlashMode.off;

	constructor() {
		makeAutoObservable(this, {
			hasPermission    : observable,
			type             : observable,
			flashMode        : observable,
			setHasPermission : action,
			setType          : action,
			setFlashMode     : action
		});
	}

	setHasPermission(hasPermission) {
		this.hasPermission = hasPermission;
		console.log(this.hasPermission);
	}

	setType(type) {
		this.type = type;
	}

	setFlashMode(flashMode) {
		this.flashMode = flashMode;
	}
}

export default CameraScanner;
