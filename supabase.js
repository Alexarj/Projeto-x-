// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://SEU_PROJECT_ID.supabase.co'  // substitua pelo seu ID
const supabaseKey = 'SEU_ANON_KEY' // substitua pela sua chave anon
export const supabase = createClient(supabaseUrl, supabaseKey)
