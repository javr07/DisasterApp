import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import esTranslation from './es.json';
import { rootStore } from '../store/RootStore';

const { configStore } = rootStore;

const resources = {
	en : {
		translation : enTranslation
	},
	es : {
		translation : esTranslation
	}
};

i18n.use(initReactI18next).init({
	resources,
	lng           : configStore.language,
	keySeparator  : false,
	interpolation : {
		escapeValue : true
	}
});

export default i18n;
