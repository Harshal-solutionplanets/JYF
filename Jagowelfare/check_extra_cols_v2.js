const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc"

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const result = {};
  
  const { data: teamData, error: teamError } = await supabase.from('team').select('*').limit(1);
  result.team = teamData && teamData[0] ? Object.keys(teamData[0]) : (teamError ? teamError.message : 'NONE');

  const { data: supportersData, error: supportersError } = await supabase.from('supporters').select('*').limit(1);
  result.supporters = supportersData && supportersData[0] ? Object.keys(supportersData[0]) : (supportersError ? supportersError.message : 'NONE');

  console.log(JSON.stringify(result, null, 2));
}

check();
