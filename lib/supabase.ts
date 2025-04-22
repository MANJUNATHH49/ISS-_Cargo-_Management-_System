import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
const supabaseUrl = "https://gfhptpxvviirykznakne.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaHB0cHh2dmlpcnlrem5ha25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzU4NDcsImV4cCI6MjA1OTQ1MTg0N30.5SEaNZqDBimPmyqS20b11Z4ePHCyBD9JZoosBSIOJ-g"

// Create a singleton pattern for the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a server-side client for API routes
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

