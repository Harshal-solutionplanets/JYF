const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('causes').select('*').limit(1);
  if (error) {
    console.log('Error:' + JSON.stringify(error));
  } else {
    console.log('DATA:' + JSON.stringify(data && data[0] ? Object.keys(data[0]) : 'NONE'));
  }
}

check();
