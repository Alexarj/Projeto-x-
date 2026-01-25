// supabaseConfig.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'SUA_URL_SUPABASE'; // substitua pela sua URL do Supabase
const SUPABASE_KEY = 'SUA_API_KEY';       // substitua pela sua API Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
