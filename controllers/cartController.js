const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const path = require("path");

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productid, quantity } = req.body;
    console.log(quantity)
    const product = await Product.findById(productid);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({ clientuser: req.clientuser.id });
 
    if (!cart) {
        cart = await Cart.create({ clientuser: req.clientuser.id, items: [] });
    }

    let existingItem = cart.items.find(item => item.productid.toString() === productid);
    if (existingItem) {
        // If the item exists, update the quantity
        existingItem.quantity += quantity;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({ productid: productid, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
});

// Get cart items
const getCartItems = asyncHandler(async (req, res) => {
    // Fetch cart for the current user
    const cart = await Cart.findOne({ clientuser: req.clientuser.id }).populate({
        path: "items.productid",
        model: Product,
    });

    res.status(200).json(cart);
});

// Update cart item quantity
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ clientuser: req.clientuser.id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    const item = cart.items.find(item => item._id.toString() === itemId);
    if (!item) {
        res.status(404);
        throw new Error("Item not found");
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json(cart);
});

// Remove item from cart
const removeCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ clientuser: req.clientuser.id });
    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();

    res.status(200).json(cart);
});

module.exports = {
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
};
