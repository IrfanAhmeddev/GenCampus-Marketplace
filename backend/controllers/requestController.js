const supabase = require("../config/supabaseClient");

// ==========================================
// Create Request
// POST /api/v1/requests
// ==========================================
exports.createRequest = async (req, res) => {

    try {

        const buyer_id = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {

            return res.status(400).json({
                success: false,
                error: "Product ID is required."
            });

        }

        // Get Product
        const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", product_id)
            .single();

        if (productError || !product) {

            return res.status(404).json({
                success: false,
                error: "Product not found."
            });

        }

        // Buyer cannot request own product
        if (product.seller_id === buyer_id) {

            return res.status(400).json({
                success: false,
                error: "You cannot request your own product."
            });

        }

        const { data, error } = await supabase
            .from("requests")
            .insert([
                {
                    product_id,
                    buyer_id,
                    seller_id: product.seller_id,
                    status: "pending"
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({

            success: true,
            message: "Request sent successfully.",
            data: data[0]

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: "Failed to create request.",
            error: err.message

        });

    }

};

// ==========================================
// Get All Requests
// GET /api/v1/requests
// ==========================================
exports.getAllRequests = async (req, res) => {

    try {

        const seller_id = req.user.id;

        const { data, error } = await supabase
            .from("requests")
            .select(`
                *,
                product:products!requests_product_id_fkey(
                    id,
                    title,
                    price,
                    image_url
                ),
                buyer:profiles!requests_buyer_id_fkey(
                    id,
                    full_name,
                    email
                )
            `)
            .eq("seller_id", seller_id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch requests.",
            error: err.message
        });

    }

};