//firebase config key setup
 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
 
import 'firebase/compat/firestore'
 
// youre web app's Firebase configuration
 
  const firebaseConfig = {
    apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
    authDomain: "newsapp-32049.firebaseapp.com",
    projectId: "newsapp-32049",
    storageBucket: "newsapp-32049.appspot.com",
    messagingSenderId: "109848058571",
    appId: "1:109848058571:web:2e5322e2a1d8251017594e",
    measurementId: "G-KVL2B1SPCG"
   
};
 if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);

}else{
  firebase.app();
   
}

export {firebase}