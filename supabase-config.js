const SUPABASE_URL = "https://supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_w3Ed49L4qfY6W-WsIoiN6g_ekcCyzTR";

// Исправлено: корректно инициализируем глобальный клиент без конфликта имён
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Облако Supabase успешно подключено к Tyk Tyk! 🚀☁️");
