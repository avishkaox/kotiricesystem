const express = require("express");
const router = express.Router();


const {
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
} = require("../controllers/cartController");

const protect = require("../middleWare/authclientMiddleware");

router.route("/add").post(protect, addToCart);
router.route("/").get( protect,  getCartItems);
router.route("/:itemId").put( updateCartItemQuantity).delete(protect, removeCartItem);


module.exports = router;