const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
