// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Substitua pelos dados do seu projeto Supabase
const supabaseUrl = 'https://sfaqtbhhbbvkfmgsryya.supabase.co'  // seu Project URL
const supabaseKey = 'SEU_ANON_KEY' // sua Chave anon

export const supabase = createClient(supabaseUrl, supabaseKey)
