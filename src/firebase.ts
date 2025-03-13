/* eslint-disable import/prefer-default-export */
import firebase from 'firebase/compat/app';
// import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyADHhzqlmEhpgO3DQhAWjQ1Yupq8cyaYN4',
  authDomain: 'evansoven-2c943.firebaseapp.com',
  projectId: 'evansoven-2c943',
  storageBucket: 'evansoven-2c943.appspot.com',
  messagingSenderId: '490838133933',
  appId: '1:490838133933:web:382f95097d8257d5dc0a24',
  measurementId: 'G-S71VREEG0Q',
};

export const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const auth = getAuth(app);
