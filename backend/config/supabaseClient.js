const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

console.log("========== SUPABASE DEBUG ==========");
console.log("URL Loaded:", !!process.env.SUPABASE_URL);
console.log("SERVICE ROLE Loaded:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase Environment Variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase client created successfully ✅");
console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log("SERVICE ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));

module.exports = supabase;