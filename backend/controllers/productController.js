const supabase = require("../config/supabaseClient");

// ==========================================
// Get All Products
// GET /api/v1/products
// ==========================================
exports.getAllProducts = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("products")
            .select("*")
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
            message: "Failed to fetch products",
            error: err.message
        });

    }
};

// ==========================================
// Get My Products
// GET /api/v1/products/my-products
// ==========================================
exports.getMyProducts = async (req, res) => {

    try {

        const seller_id = req.user.id;

        const { data, error } = await supabase
            .from("products")
            .select("*")
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
            message: "Failed to fetch your products",
            error: err.message
        });

    }

};

// ==========================================
// Get Product By ID
// GET /api/v1/products/:id
// ==========================================
exports.getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        res.status(404).json({
            success: false,
            message: "Product not found",
            error: err.message
        });

    }

};

// ==========================================
// Create Product
// POST /api/v1/products
// ==========================================
exports.createProduct = async (req, res) => {

    try {

        const seller_id = req.user.id;

        const {
            title,
            description,
            price,
            category
        } = req.body;

        if (!title || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, Price and Category are required."
            });
        }

        let image_url = null;

        // Upload image to Supabase Storage
        if (req.file) {

            const fileName = `${Date.now()}-${req.file.originalname}`;

            const { error: uploadError } = await supabase.storage
                .from("product-images") // Change if your bucket has a different name
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

            image_url = publicUrlData.publicUrl;
        }

        const { data, error } = await supabase
            .from("products")
            .insert([
                {
                    seller_id,
                    title,
                    description,
                    price,
                    category,
                    image_url,
                    status: "available"
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: data[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: err.message
        });

    }

};

// ==========================================
// Update Product
// PUT /api/v1/products/:id
// ==========================================
exports.updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("products")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: err.message
        });

    }

};

// ==========================================
// Delete Product
// DELETE /api/v1/products/:id
// ==========================================
exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: err.message
        });

    }

};

// ==========================================
// Toggle Product Status
// PATCH /api/v1/products/:id/status
// ==========================================
exports.toggleProductStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const { data, error } = await supabase
            .from("products")
            .update({ status })
            .eq("id", id)
            .select();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: "Product status updated",
            data: data[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: err.message
        });

    }

};