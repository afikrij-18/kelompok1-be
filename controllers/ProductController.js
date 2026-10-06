import Product from "../models/Product.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.update({
      name,
      description,
      price,
      stock,
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};