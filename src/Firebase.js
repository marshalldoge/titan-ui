import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
	apiKey: "AIzaSyClRs3Xkafgy4TNUA9vfFz8RjHLG3ZHMaU",
	authDomain: "titan-health.firebaseapp.com",
	databaseURL: "https://titan-health.firebaseio.com",
	projectId: "titan-health",
	storageBucket: "titan-health.appspot.com",
	messagingSenderId: "562863710701",
	appId: "1:562863710701:web:fa4cbc372b7f10c35007e4",
	measurementId: "G-727QQ9J50P"
});

export default firebase;
