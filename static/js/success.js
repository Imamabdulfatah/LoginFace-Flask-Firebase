import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZrsNRApcZ1STX0pjftDfGf09sujDAPNM",
  authDomain: "face-detection-3ff4e.firebaseapp.com",
  databaseURL: "https://face-detection-3ff4e-default-rtdb.firebaseio.com",
  projectId: "face-detection-3ff4e",
  storageBucket: "face-detection-3ff4e.appspot.com",
  messagingSenderId: "394146179509",
  appId: "1:394146179509:web:381a04c8cd6527c19a91fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Login
// const auth = getAuth(app);
const db = getDatabase(app);

let countdownElement = document.getElementById("countdown");
let countdownValue = 7;

const countdownInterval = setInterval(() => {
  countdownValue--;
  countdownElement.textContent = countdownValue;

  if (countdownValue <= 0) {
    clearInterval(countdownInterval);
    // hapus data
    update(ref(db, "post/"), {
      sensor: 0,
    })
      .then(() => {
        console.log("Data deleted successfully.");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Data could not be deleted." + error);
      });
  }
}, 1000);
