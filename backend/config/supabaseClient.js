const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

console.log("========== SUPABASE DEBUG ==========");
console.log("URL Loaded:", !!process.env.SUPABASE_URL);
console.log("KEY Loaded:", !!process.env.SUPABASE_ANON_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase Environment Variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase client created successfully ✅");

module.exports = supabase;