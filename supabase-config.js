// Подключение официального SDK Supabase через быстрый CDN
import { createClient } from 'https://jsdelivr.net';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_w3Ed49L4qfY6W-WsIoiN6g_ekcCyzTR";

// Инициализируем клиента облачной базы данных и хранилища
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Прокидываем в глобальное окно window, чтобы app.js, likes.js и comments.js видели базу
window.supabase = supabase;

console.log("Облако Supabase успешно подключено к Tyk Tyk! 🚀☁️");
