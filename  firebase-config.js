// Подключение Firebase модулей через официальный CDN Google
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://gstatic.com";

// Твоя личная конфигурация связи с базой данных
const firebaseConfig = {
  apiKey: "AIzaSyBAvQBxNS-cuzkfZxP_QCkC077eIuU37I0",
  authDomain: "://firebaseapp.com",
  projectId: "tyk-tyk-app",
  storageBucket: "://appspot.com",
  messagingSenderId: "728821261532",
  appId: "1:728821261532:web:6f30767a42ea74bc48f3b2",
  measurementId: "G-6X80RMH3MG"
};

// Запуск приложения и базы данных
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Передаем функции базы данных в глобальное окно браузера, чтобы другие файлы видели их
window.db = db;
window.fbCollection = collection;
window.fbAddDoc = addDoc;
window.fbOnSnapshot = onSnapshot;
window.fbQuery = query;
window.fbOrderBy = orderBy;

console.log("Мост связи с Firebase успешно настроен! ☁️");
