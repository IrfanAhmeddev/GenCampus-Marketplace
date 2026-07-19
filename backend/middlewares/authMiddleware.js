const supabase = require("../config/supabaseClient");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

   const { data, error } = await supabase.auth.getUser(token);

console.log("========== AUTH DEBUG ==========");
console.log("Received Token:", token);
console.log("Supabase User:", data.user);
console.log("Supabase Error:", error);
console.log("===============================");

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }

    req.user = data.user;
    next();

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};