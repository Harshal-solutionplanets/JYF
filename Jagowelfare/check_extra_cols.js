const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function check() {
  const result = {};
  
  const { data: teamData, error: teamError } = await supabase.from('team').select('*').limit(1);
  result.team = teamData && teamData[0] ? Object.keys(teamData[0]) : (teamError ? teamError.message : 'NONE');

  const { data: supportersData, error: supportersError } = await supabase.from('supporters').select('*').limit(1);
  result.supporters = supportersData && supportersData[0] ? Object.keys(supportersData[0]) : (supportersError ? supportersError.message : 'NONE');

  console.log(JSON.stringify(result, null, 2));
}

check();
