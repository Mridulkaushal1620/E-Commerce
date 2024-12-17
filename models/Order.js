const { default: mongoose, Schema } = require('mongoose');

const orderSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Reference to the Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shipped"], // Enum values for the status
        default: "pending" // Default value
    },
    createdAt: {
        type: Date,
        default: Date.now // Default to the current timestamp
    }
});

module.exports = mongoose.model('order', orderSchema);
