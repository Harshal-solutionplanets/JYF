const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  const { data: events } = await supabase.from('events').select('*').limit(1);
  const { data: causes } = await supabase.from('causes').select('*').limit(1);
  const { data: news } = await supabase.from('news').select('*').limit(1);

  console.log("Events Keys:", events && events[0] ? Object.keys(events[0]) : "Empty");
  console.log("Causes Keys:", causes && causes[0] ? Object.keys(causes[0]) : "Empty");
  console.log("News Keys:", news && news[0] ? Object.keys(news[0]) : "Empty");
}

checkSchema();
