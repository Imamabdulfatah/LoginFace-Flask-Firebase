import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZrsNRApcZ1STX0pjftDfGf09sujDAPNM",
  authDomain: "face-detection-3ff4e.firebaseapp.com",
  databaseURL: "https://face-detection-3ff4e-default-rtdb.firebaseio.com",
  projectId: "face-detection-3ff4e",
  storageBucket: "face-detection-3ff4e.appspot.com",
  messagingSenderId: "394146179509",
  appId: "1:394146179509:web:381a04c8cd6527c19a91fc",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

let video;
let canvas;
let nameInput;

function init() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  nameInput = document.getElementById("name");

  // open webcam
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.log("error acces webcam", error);
      alert("tidak bisa akses webcam");
    });
}
const capture_Btn = document.querySelector("#capture_btn");
const register_Btn = document.querySelector("#register_btn");
const login_Btn = document.querySelector("#login_btn");

// membuat kamera
function capture() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";
  video.style.display = "none";
}

capture_Btn.addEventListener("click", capture);

// membuat register

function register() {
  const name = nameInput.value;
  const photo = dataURItoBlob(canvas.toDataURL());

  if (!name || !photo) {
    alert("nama dan photo diperlukan");
    return;
  }

  // merubah nama gambar sesuai nama yang dimasukan
  const formData = new FormData();
  formData.append("name", name);
  formData.append("photo", photo, `${name}.jpg`);

  // menyimpan data hasil registri
  fetch("/register", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("data sukses didaftarkan");
        // mengarahkan ke halaman utama
        window.location.href = "/";
      } else {
        alert("sorry failed register");
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

register_Btn.addEventListener("click", register);

function login() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const photo = dataURItoBlob(canvas.toDataURL());
  // memastikan foto tersedia
  if (!photo) {
    alert("foto diperlukan untuk login");
    return;
  }

  const formData = new FormData();
  formData.append("photo", photo, "login.jpg");

  fetch("/login", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        // Extract nama and success dari data
        const name = data.name;
        const success = data.success;

        // Generate a random id
        const id = Math.floor(Math.random() * 100);

        // mendapatkan current date
        const date = new Date().toISOString();

        // menyimpan data (tanggal, nama dan login berhasil ) ke firebase /data
        set(ref(db, "data/" + id), {
          date: date,
          name: name,
          success: success,
        });

        // menyimpan  data ke firebase /post  1
        set(ref(db, "post/"), {
          sensor: 1,
        }).then(() => {
          console.log("Data saved successfully.");

          // mengarahkan pengguna ke halaman succes
          window.location.href = "/success";
        });
      } else {
        alert("Login gagal, mohon coba kembali");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi sebuah error. mohon coba kembali");
    });
}

// login jika klik tombol login
login_Btn.addEventListener("click", login);

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

init();
