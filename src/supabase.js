import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ecgrtwmurxczjaxwzgis.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZ3J0d211cnhjempheHd6Z2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTE1MzksImV4cCI6MjA5NDk2NzUzOX0.ivwkySdyuUM1rI_q3g25zR58Nfjc4Flq7zPi5V8Ko-8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
