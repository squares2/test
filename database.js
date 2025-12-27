import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, set, get,update,remove,ref,runTransaction,child,onValue}
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = 
{
    apiKey: "AIzaSyCSTThgge2nSFlEQXjS1ta2tZXvVgNAnZ0",
    authDomain: "deliveryonline-300f7.firebaseapp.com",
    projectId: "deliveryonline-300f7",
    storageBucket: "deliveryonline-300f7.firebasestorage.app",
    messagingSenderId: "360058447266",
    appId: "1:360058447266:web:5ac25e3ad30f636bdd3efb",
	databaseURL: "https://deliveryonline-300f7-default-rtdb.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const dbref=ref(db);
		
// Signup/Login Logic
window.handleAuth = (mode) => 
{
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const name = document.getElementById('name').value;
	
	const authFunc = mode === 'signup' ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
	
	authFunc(auth, email, password)
	.then((userCredential) => 
	{
		const user = userCredential.user;
		if(mode === 'signup') {
			set(ref(db, 'users/' + user.uid), { name: name, online: true });
		}
		alert("Success! Tracking started.");
		startTracking(user.uid, name || "User");
	})
	.catch((error) => alert(error.message));
};
function startTracking(uid, name) 
{
	if (navigator.geolocation) 
	{
		navigator.geolocation.watchPosition((pos) => 
		{
			set(ref(db, 'locations/' + uid), 
			{
				name: name,
				lat: pos.coords.latitude,
				lng: pos.coords.longitude,
				lastSeen: Date.now()
			});
		}, null, { enableHighAccuracy: true });
	}
}
