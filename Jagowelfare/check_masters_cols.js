const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://twkfpitdcjorrnwjkhbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a2ZwaXRkY2pvcnJud2praGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDUzNDAsImV4cCI6MjA4OTM4MTM0MH0.a1vMKhEoxVt-KJmPhT3TW_NoRFQbVpzLFtugvw5ZnDc";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase.from('masters').select('*').limit(1);
    if (error) {
        console.log("Error:", error.message);
    } else {
        if (data && data.length > 0) {
            console.log("Masters columns:", Object.keys(data[0]));
        } else {
            console.log("Masters table empty");
        }
    }
}
check();
