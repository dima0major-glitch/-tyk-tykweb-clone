// Подключение Firebase модулей через официальный CDN Google
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://gstatic.com";

// Твоя личная конфигурация связи с базой данных
const firebaseConfig = {
  apiKey: "AIzaSyBAvQBxNS-cuzkfZxP_QCkC077eIuU37I0",
  authDomain: "tyk-tyk-app.firebaseapp.com",
  projectId: "tyk-tyk-app",
  storageBucket: "tyk-tyk-app.appspot.com",
  messagingSenderId: "728821261532",
  appId: "1:728821261532:web:6f30767a42ea74bc48f3b2",
  measurementId: "G-6X80RMH3MG"
};

// Запуск приложения, базы данных и облачного хранилища файлов
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Передаем модули в глобальное окно (window), чтобы app.js, likes.js и comments.js видели их без сложных импортов
window.db = db;
window.storage = storage;
window.fbCollection = collection;
window.fbAddDoc = addDoc;
window.fbOnSnapshot = onSnapshot;
window.fbQuery = query;
window.fbOrderBy = orderBy;
window.fbRef = ref;
window.fbUploadBytes = uploadBytes;
window.fbGetDownloadURL = getDownloadURL;

console.log("Облачный мост Tyk Tyk с Firebase Storage + Firestore успешно запущен! ☁️");
