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

    if (error) {
    console.log("========== SUPABASE INSERT ERROR ==========");
    console.log(error);
    console.log("===========================================");
    throw error;
}
        res.status(201).json({

            success: true,
            message: "Request sent successfully.",
            data: data[0]

        });

    }

 catch (err) {

    console.log("========== REQUEST CONTROLLER ERROR ==========");
    console.log(err);
    console.log("==============================================");

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

// ==========================================
// Get My Purchases
// GET /api/v1/requests/my-purchases
// -----------------------------------------
// No separate "purchases" table — a purchase
// is just a request the current user made as
// a buyer that the seller has accepted.
// ==========================================
exports.getMyPurchases = async (req, res) => {

    try {

        const buyer_id = req.user.id;

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
                seller:profiles!requests_seller_id_fkey(
                    id,
                    full_name,
                    email
                )
            `)
            .eq("buyer_id", buyer_id)
            .eq("status", "accepted")
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {

        console.log("========== GET MY PURCHASES ERROR ==========");
        console.log(err);
        console.log("==============================================");

        res.status(500).json({
            success: false,
            message: "Failed to fetch purchases.",
            error: err.message
        });

    }

};

// ==========================================
// Accept Request
// PATCH /api/v1/requests/:id/accept
// ==========================================
exports.acceptRequest = async (req, res) => {

    try {

        const seller_id = req.user.id;
        const { id } = req.params;

        // Get Request (must belong to this seller)
        const { data: request, error: requestError } = await supabase
            .from("requests")
            .select("*")
            .eq("id", id)
            .eq("seller_id", seller_id)
            .single();

        if (requestError || !request) {

            return res.status(404).json({
                success: false,
                error: "Request not found."
            });

        }

        // Mark request as accepted
        const { error: updateRequestError } = await supabase
            .from("requests")
            .update({ status: "accepted" })
            .eq("id", id);

        if (updateRequestError) throw updateRequestError;

        // Mark product as sold
        const { error: updateProductError } = await supabase
            .from("products")
            .update({ status: "sold" })
            .eq("id", request.product_id);

        if (updateProductError) throw updateProductError;

        res.status(200).json({
            success: true,
            message: "Request accepted."
        });

    } catch (err) {

        console.log("========== ACCEPT REQUEST ERROR ==========");
        console.log(err);
        console.log("===========================================");

        res.status(500).json({
            success: false,
            message: "Failed to accept request.",
            error: err.message
        });

    }

};

// ==========================================
// Reject Request
// PATCH /api/v1/requests/:id/reject
// ==========================================
exports.rejectRequest = async (req, res) => {

    try {

        const seller_id = req.user.id;
        const { id } = req.params;

        const { data: request, error: requestError } = await supabase
            .from("requests")
            .select("*")
            .eq("id", id)
            .eq("seller_id", seller_id)
            .single();

        if (requestError || !request) {

            return res.status(404).json({
                success: false,
                error: "Request not found."
            });

        }

        const { error: updateError } = await supabase
            .from("requests")
            .update({ status: "rejected" })
            .eq("id", id);

        if (updateError) throw updateError;

        res.status(200).json({
            success: true,
            message: "Request rejected."
        });

    } catch (err) {

        console.log("========== REJECT REQUEST ERROR ==========");
        console.log(err);
        console.log("===========================================");

        res.status(500).json({
            success: false,
            message: "Failed to reject request.",
            error: err.message
        });

    }

};