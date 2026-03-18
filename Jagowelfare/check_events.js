const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .limit(5);

  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkEvents();
