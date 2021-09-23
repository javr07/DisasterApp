// MAIN IMPORTS
import firebase from 'firebase';

// DOTENV IMPORTS
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, DATABASE_URL } from '@env';

const firebaseConfig = {
	apiKey            : API_KEY,
	authDomain        : AUTH_DOMAIN,
	databaseURL       : DATABASE_URL,
	projectId         : PROJECT_ID,
	storageBucket     : STORAGE_BUCKET,
	messagingSenderId : MESSAGING_SENDER_ID,
	appId             : APP_ID
};

// Initialize Firebase
export default (
	!firebase.apps.length ? firebase.initializeApp(firebaseConfig) :
	firebase.app());
