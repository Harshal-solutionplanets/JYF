const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRest() {
  const { data: team } = await supabase.from('team').select('*').limit(1);
  const { data: testimonials } = await supabase.from('testimonials').select('*').limit(1);
  const { data: gallery } = await supabase.from('gallery').select('*').limit(1);

  console.log("Team Keys:", team && team[0] ? Object.keys(team[0]) : "Empty");
  console.log("Testimonials Keys:", testimonials && testimonials[0] ? Object.keys(testimonials[0]) : "Empty");
  console.log("Gallery Keys:", gallery && gallery[0] ? Object.keys(gallery[0]) : "Empty");
}

checkRest();
