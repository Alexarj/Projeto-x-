// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// URL e ANON KEY do seu projeto
const SUPABASE_URL = 'https://ynirlpziolginasusolb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY_AQUI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
