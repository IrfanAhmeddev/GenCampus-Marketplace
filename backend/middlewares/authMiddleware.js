const supabase = require("../config/supabaseClient");

// ==========================================
// Authentication Middleware
// ==========================================

exports.protect = async (req, res, next) => {

    try {

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                error: "Not authorized. No token provided."

            });

        }

        // Extract JWT Token
        const token = authHeader.split(" ")[1];

        // Verify User with Supabase
        const {

            data: { user },

            error

        } = await supabase.auth.getUser(token);

        if (error || !user) {

            return res.status(401).json({

                success: false,

                error: "Invalid or expired token."

            });

        }

        // Store Authenticated User
        req.user = user;

        next();

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            error: err.message

        });

    }

};