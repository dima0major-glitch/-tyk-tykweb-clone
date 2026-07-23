// Подключение официального SDK Supabase через стабильный CDN esm.sh
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://tksugsuzksoejtlxamw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_w3Ed49L4qfY6W-WsIoiN6g_ekcCyzTR";

// Прокидываем константы в окно, чтобы обойти баги авторизации SDK на iOS
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

// Инициализируем клиента облачной базы данных
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

console.log("Облако Supabase успешно подключено к Tyk Tyk! 🚀☁️");
