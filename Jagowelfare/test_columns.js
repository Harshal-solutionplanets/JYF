
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc"

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
    try {
        const { data, error } = await supabase.from('event_registrations').select('*').limit(1);
        if (error) {
            console.error("Error fetching rows:", error);
        } else if (data && data.length > 0) {
            console.log("Columns found in first row:", Object.keys(data[0]));
        } else {
            console.log("No rows found in table.");
        }
    } catch (e) {
        console.error("Catch error:", e);
    }
}

checkColumns();
