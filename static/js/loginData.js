// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZrsNRApcZ1STX0pjftDfGf09sujDAPNM",
  authDomain: "face-detection-3ff4e.firebaseapp.com",
  databaseURL: "https://face-detection-3ff4e-default-rtdb.firebaseio.com",
  projectId: "face-detection-3ff4e",
  storageBucket: "face-detection-3ff4e.appspot.com",
  messagingSenderId: "394146179509",
  appId: "1:394146179509:web:381a04c8cd6527c19a91fc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function SignInUSer() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      console.log(userCredentials.user.uid);
      alert("Login Berhasil");
      window.location.href = "/face-zwaewserdre-4ededcd"; // Change this as per your requirement
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
    });
}

const Sign_btn = document.querySelector("#sign_in");
Sign_btn.addEventListener("click", (event) => {
  event.preventDefault();
  SignInUSer();
});
