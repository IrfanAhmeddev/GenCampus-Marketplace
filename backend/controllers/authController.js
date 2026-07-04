const supabase = require("../config/supabaseClient");

/**
 * ==========================================
 * Student Signup
 * POST /api/v1/auth/signup
 * ==========================================
 */

exports.signup = async (req, res) => {
  try {
    const { email, password, full_name, college_name } = req.body;

    // Validation
    if (!email || !password || !full_name || !college_name) {
      return res.status(400).json({
        success: false,
        error: "All fields are required."
      });
    }

  // Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        success: false,
        error: "Please enter a valid email address."
    });
}

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          college_name
        }
      }
    });

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      user: data.user,
      session: data.session
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
 * Student Login
 * POST /api/v1/auth/login
 * ==========================================
 */

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({

        success:false,

        error:"Email and Password are required."

      });

    }

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email,

        password

      });

    if (error) {

      return res.status(401).json({

        success:false,

        error:"Invalid Credentials"

      });

    }

    // Fetch Profile

    const { data: profile } =
      await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return res.status(200).json({

      success:true,

      token:data.session.access_token,

      user:{

        id:data.user.id,

        email:data.user.email,

        profile

      }

    });

  }

  catch(err){

    return res.status(500).json({

      success:false,

      error:err.message

    });

  }

};

/**
 * ==========================================
 * Current User
 * GET /api/v1/auth/me
 * ==========================================
 */

exports.getMe = async (req,res)=>{

  try{

    return res.status(200).json({

      success:true,

      user:req.user

    });

  }

  catch(err){

    return res.status(500).json({

      success:false,

      error:err.message

    });

  }

};