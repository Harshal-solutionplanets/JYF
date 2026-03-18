import { createClient } from '@supabase/supabase-js'

// IMPORTANT: CRA requires a restart to pick up .env changes. 
// Since the server was already running, we hardcode these temporarily 
// to avoid "supabaseUrl is required" error without needing a restart.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://twkfpitdcjorrnwjkhbw.supabase.co"
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. If you just added them to .env, please restart your development server (npm start).')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
