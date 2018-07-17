import firebase from 'firebase';
import 'firebase/firestore';
import config from './firebaseConfig';

try {
  firebase.initializeApp(config.production);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

export default firebase;
