const express = require('express');
const router = express.Router();
const fetchUser = require('../middelware/fetchuser')
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");

// Route 1: Get logged-in user's products using GET: login required
// Endpoint: http://localhost:4000/api/products/fetchallproducts
router.get('/fetchallproducts', fetchUser, async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user.id });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// Route 2: Add a new product using POST: login required
// Endpoint: http://localhost:4000/api/products/addproduct
router.post('/addproduct', [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("price", "Price must be a number").isNumeric(),
    body("stock", "Stock must be a number").isNumeric(),
], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, stock } = req.body;
    try {
        const product = new Product({
            vendor: req.user.id,
            name,
            price,
            stock,
        });
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// Route 3: Update an existing product using PUT: login required
// Endpoint: http://localhost:4000/api/products/updateproduct/:id
router.put('/updateproduct/:id', fetchUser, async (req, res) => {
    const { name, price, stock } = req.body;

    // Create a new product object
    const updatedProduct = {};
    if (name) updatedProduct.name = name;
    if (price) updatedProduct.price = price;
    if (stock) updatedProduct.stock = stock;

    try {
        // Find the product to be updated
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found");
        }

        // Ensure the logged-in user is the vendor of the product
        if (product.vendor.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the product
        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updatedProduct },
            { new: true }
        );
        res.json({ product });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// Route 4: Delete an existing product using DELETE: login required
// Endpoint: http://localhost:4000/api/products/deleteproduct/:id
router.delete('/deleteproduct/:id', fetchUser, async (req, res) => {
    try {
        // Find the product to be deleted
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found");
        }

        // Ensure the logged-in user is the vendor of the product
        if (product.vendor.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Delete the product
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: "Product deleted successfully", product });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

module.exports = router;
