// Mengimpor modul Firebase dari CDN Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Konfigurasi Firebase dengan detail proyek
const firebaseConfig = {
  apiKey: "AIzaSyBZrsNRApcZ1STX0pjftDfGf09sujDAPNM",
  authDomain: "face-detection-3ff4e.firebaseapp.com",
  databaseURL: "https://face-detection-3ff4e-default-rtdb.firebaseio.com",
  projectId: "face-detection-3ff4e",
  storageBucket: "face-detection-3ff4e.appspot.com",
  messagingSenderId: "394146179509",
  appId: "1:394146179509:web:381a04c8cd6527c19a91fc",
};

// Menginisialisasi aplikasi Firebase dengan konfigurasi yang diberikan
const app = initializeApp(firebaseConfig);

// Mengambil referensi ke Firebase Realtime Database
const db = getDatabase(app);

// Menentukan referensi data di dalam database pada node "data/"
const dataRef = ref(db, "data/");

// Fungsi untuk memformat tanggal dari format ISO menjadi format yang lebih mudah dibaca
function formatDate(isoString) {
  // Membuat objek Date dari string ISO
  const date = new Date(isoString);
  // Mendapatkan hari, bulan, dan tahun dan memformatnya dengan leading zero jika perlu
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`; // Format DD-MM-YYYY

  // Mendapatkan jam, menit, dan detik dan memformatnya dengan leading zero jika perlu
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`; // Format HH:MM:SS

  // Mengembalikan objek dengan format tanggal dan waktu
  return { formattedDate, formattedTime };
}

// Fungsi untuk menampilkan data pada tabel HTML
function displayData(data) {
  // Menemukan elemen tbody di dalam tabel yang memiliki id "data-table"
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Mengosongkan isi tabel

  // Mengubah objek data menjadi array dan mengurutkannya berdasarkan tanggal
  const dataArray = Object.values(data).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Loop melalui setiap item di dataArray
  dataArray.forEach((item) => {
    // Memformat tanggal dan waktu dari setiap item
    const { formattedDate, formattedTime } = formatDate(item.date);

    // Membuat baris tabel baru
    const row = document.createElement("tr");
    // Membuat sel untuk tanggal, waktu, dan nama
    const dateCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const nameCell = document.createElement("td");

    // Menetapkan teks konten untuk setiap sel
    dateCell.textContent = formattedDate;
    timeCell.textContent = formattedTime;
    nameCell.textContent = item.name;

    // Menambahkan setiap sel ke dalam baris
    row.appendChild(dateCell);
    row.appendChild(timeCell);
    row.appendChild(nameCell);

    // Menambahkan baris ke dalam tbody tabel
    tableBody.appendChild(row);
  });
}

// Mengambil data dari referensi Firebase Realtime Database yang sudah ditentukan
get(dataRef)
  .then((snapshot) => {
    // Jika snapshot data ada, maka tampilkan data menggunakan fungsi displayData
    if (snapshot.exists()) {
      const data = snapshot.val(); // Mengambil data dari snapshot
      displayData(data); // Menampilkan data
    } else {
      // Jika tidak ada data, tampilkan pesan di konsol
      console.log("No data available");
    }
  })
  .catch((error) => {
    // Menangkap dan menampilkan error jika terjadi kesalahan saat mengambil data
    console.error("Error fetching data: ", error);
  });
