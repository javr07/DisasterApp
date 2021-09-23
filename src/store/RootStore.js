import Authentication from './AuthStore';
import Configuration from './ConfigStore';
import CameraScanner from './CameraStore';
import Equipment from './EquipmentStore';
import EquipmentMap from './MapStore';

class RootStore {
	authStore;
	configStore;
	cameraStore;
	equipmentStore;
	mapStore;

	constructor() {
		this.authStore = new Authentication(this);
		this.configStore = new Configuration(this);
		this.cameraStore = new CameraScanner(this);
		this.equipmentStore = new Equipment(this);
		this.mapStore = new EquipmentMap(this);
	}
}

export const rootStore = new RootStore();
