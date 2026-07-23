// Подключение официального SDK Supabase через стабильный CDN esm.sh
import { createClient } from 'https://esm.sh';

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_w3Ed49L4qfY6W-WsIoiN6g_ekcCyzTR";

// Прокидываем в окно, чтобы другие скрипты видели SDK клиента
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

console.log("Облако Supabase успешно подключено к Tyk Tyk! 🚀☁️");
