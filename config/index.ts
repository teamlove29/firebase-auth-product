import 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FirebaseApp, initializeApp } from 'firebase/app'

const firebaseConfig = {
	apiKey: 'AIzaSyBobF-dQWAtHgZ4Jum22bAdni-D3slQZ4Y',
	authDomain: 'order-plus-test.firebaseapp.com',
	projectId: 'order-plus-test',
	storageBucket: 'order-plus-test.appspot.com',
	messagingSenderId: '505853078140',
	appId: '1:505853078140:web:14290f51e9ff5e31e077f9',
	measurementId: 'G-80XP684WXQ',
}

const app: FirebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const test1234 = 12345

export { db, auth, app, firebaseConfig, test1234 }
