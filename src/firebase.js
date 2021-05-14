// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyABrvkyZCGYLUnqwooAtR7vOhVTpj-CzqI",
    authDomain: "insta-70a91.firebaseapp.com",
    projectId: "insta-70a91",
    storageBucket: "insta-70a91.appspot.com",
    messagingSenderId: "838751688904",
    appId: "1:838751688904:web:610af6816a284d5f156dfd",
    measurementId: "G-3H31LPEQMY"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
export {db,auth,storage}