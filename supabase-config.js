// Подключение официального SDK Supabase через стабильный CDN esm.sh (исправление зависания на iOS)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://tksugsuzksoejtlxamw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_w3Ed49L4qfY6W-WsIoiN6g_ekcCyzTR";

// Инициализируем клиента облачной базы данных и хранилища
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Прокидываем в глобальное окно window, чтобы app.js и profile.js сразу увидели базу
window.supabase = supabase;

console.log("Облако Supabase успешно подключено к Tyk Tyk! 🚀☁️");
