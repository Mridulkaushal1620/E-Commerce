const express = require('express');
const router = express.Router();
const fetchUser = require('../middelware/fetchuser')
const Order = require('../models/Order');
const Product = require('../models/Product');

// Route 1: List all orders for the vendor’s products using GET: login required
// Endpoint: http://localhost:4000/api/orders/getorders
router.get('/getorders', fetchUser, async (req, res) => {
    try {
        // Find all products for the logged-in vendor
        const products = await Product.find({ vendor: req.user.id }).select('_id');
        const productIds = products.map(product => product._id);

        // Find all orders for the vendor's products
        const orders = await Order.find({ product: { $in: productIds } }).populate('product');
        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

// Route 2: Mark an order as shipped using PUT: login required
// Endpoint: http://localhost:4000/api/orders/addorder:id
router.put('/addorder:id', fetchUser, async (req, res) => {
    try {
        // Find the order by ID
        let order = await Order.findById(req.params.id).populate('product');

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Ensure the logged-in user is the vendor of the product in the order
        if (order.product.vendor.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the order status to "shipped"
        order.status = "shipped";
        const updatedOrder = await order.save();

        res.json({ success: "Order status updated to 'shipped'", order: updatedOrder });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred");
    }
});

module.exports = router;
