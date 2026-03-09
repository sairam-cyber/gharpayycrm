import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we are using placeholder credentials
export const isMock = !supabaseUrl || 
                      !supabaseAnonKey || 
                      supabaseUrl.includes('example.supabase.co') || 
                      supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlkIjoiMSJ9');

if (isMock) {
  console.warn("⚠️ Using Mock Data. Supabase credentials are not configured or are placeholders in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);