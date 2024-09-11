import os
import datetime
import cv2
from flask import Flask, jsonify, request, render_template

# LIBRARY FACE DETECTION
import face_recognition

app = Flask(__name__)

registered_data = {}

# halaman utama deteksi wajah
@app.route("/")
def index():
    return render_template("index.html")

# halaman untuk mendaftarkan wajah
@app.route("/face-zwaewserdre-4ededcd")
def face():
    return render_template("register.html")

# halaman untuk masuk ke halaman daftar wajah
@app.route("/sign-in")
def signIn():
    return render_template("signIn.html")

# halaman untuk menampilkan semua data yg sudah masuk ke rumah melalui web
@app.route("/all-data")
def allData():
    return render_template("dataLogin.html")

# halaman sukses untuk hitung mundur
@app.route("/success")
def success():
    user_name = request.args.get("user_name")
    return render_template("success.html", user_name=user_name)

# menyimpan gambar ke webiste
@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    # AND GET YOU PHOTO UPLOADS
    photo = request.files["photo"]

    uploads_folder = os.path.join(os.getcwd(), "static", "uploads")

    if not os.path.exists(uploads_folder):
        os.makedirs(uploads_folder)
    # menyimpan data foto dengan format tanggal_foto.jpg
    photo.save(os.path.join(uploads_folder, f"{datetime.date.today()}_{name}.jpg"))

    registered_data[name] = f"{datetime.date.today()}_{name}.jpg"

    response = {"success": True, "name": name}
    return jsonify(response)


# mengirim data ke website untuk membandingkan gambar wajah yang baru dengan gambar  yang sebelumnya disimpan
@app.route("/login", methods=["POST"])
def login():
    photo = request.files["photo"]
    # menyimpan foto login ke sistem 
    uploads_folder = os.path.join(os.getcwd(), "static", "uploads")

    if not os.path.exists(uploads_folder):
        os.makedirs(uploads_folder)

    login_filename = os.path.join(uploads_folder, "login_face.jpg")

    photo.save(login_filename)

    # detect kamera wajah atau tidak
    login_image = cv2.imread(login_filename)
    gray_image = cv2.cvtColor(login_image, cv2.COLOR_BGR2GRAY)

    # sumber file = https://github.com/kipr/opencv/blob/master/data/haarcascades/haarcascade_frontalface_default.xml
    # penjelasan = https://medium.com/geeky-bawa/face-detection-using-haar-cascade-classifier-in-python-using-opencv-97873fbf24ec
    # mendeteksi berdasarkan sistem deteksi opencv haarcascade
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
     # setting skala dari haarcascade
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    # detect tidak ada wajah

    if len(faces) == 0:
        response = {"success": False}
        return jsonify(response)

    login_image = face_recognition.load_image_file(login_filename)

    login_face_encodings = face_recognition.face_encodings(login_image)

    # proses jika beda photo
    for name, filename in registered_data.items():
        # uploads folder

        registered_photo = os.path.join(uploads_folder, filename)
        registered_image = face_recognition.load_image_file(registered_photo)
        # melakukan encoding login foto
        registered_face_encodings = face_recognition.face_encodings(registered_image)

        # perbandingkan dengan login dan register foto
        if len(registered_data) > 0 and len(login_face_encodings) > 0:
            matches = face_recognition.compare_faces(
                registered_face_encodings, login_face_encodings[0]
            )

            # lihat persamaan

            print("matches", matches)
            if any(matches):
                response = {"success": True, "name": name}
                return jsonify(response)

    # jika tidak ditemukan
    response = {"success": False}
    return jsonify(response)


# menampilkan succes ke login




if __name__ == "__main__":
    app.run(port=5000)
