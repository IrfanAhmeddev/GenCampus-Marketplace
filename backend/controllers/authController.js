const supabase = require("../config/supabaseClient");

/**
 * ==========================================
 * Student Signup
 * POST /api/v1/auth/signup
 * ==========================================
 */

exports.signup = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            phone,
            college_id
        } = req.body;

        // Validation
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Full name, email and password are required."
            });
        }

        // Create Auth User
        const { data: authData, error: authError } =
            await supabase.auth.admin.createUser({

                email,
                password,
                email_confirm: true

            });

        if (authError) {
            throw authError;
        }

        const user = authData.user;

        // Insert Profile
        const { error: profileError } = await supabase
            .from("profiles")
            .insert([
                {
                    id: user.id,
                    full_name,
                    email,
                    phone: phone || null,
                    college_id: college_id || null
                }
            ]);

        if (profileError) {
            throw profileError;
        }

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
};

/**
 * ==========================================
 * Student Login
 * POST /api/v1/auth/login
 * ==========================================
 */

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                error: "Email and Password are required."
            });

        }

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email,
                password

            });

        if (error) {

            return res.status(401).json({
                success: false,
                error: "Invalid Credentials"
            });

        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

        return res.status(200).json({

            success: true,

            token: data.session.access_token,

            user: {

                id: data.user.id,
                email: data.user.email,
                profile

            }

        });

    } catch (err) {

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};

/**
 * ==========================================
 * Current User
 * GET /api/v1/auth/me
 * ==========================================
 */

exports.getMe = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,
            user: req.user

        });

    } catch (err) {

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};