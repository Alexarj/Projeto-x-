// supabaseConfig.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// URL do projeto
const SUPABASE_URL = 'https://sfaqtbhhbbvkfmgsryya.supabase.co';

// Chave segura para front-end (publishable key / anon public key)
const SUPABASE_KEY = 'sb_publishable_FHz_NEx7CSY_giqOqjl03A_q2-CtA5w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
