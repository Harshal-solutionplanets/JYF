const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function runSql() {
  // PostgREST/anon key usually can't run ALTER TABLE. 
  // I'll try to use the rpc if they have an exec SQL function, 
  // but if not, I'll just tell the user.
  // Actually, I'll check if they have any RPC first.
  const { data, error } = await supabase.from('causes').select('*').limit(1);
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Columns before:', Object.keys(data[0] || {}));
  }
}

runSql();
