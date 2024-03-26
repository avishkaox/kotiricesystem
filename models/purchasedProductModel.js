const mongoose = require("mongoose");

const purchasedProductSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        purchasedDate: {
            type: Date,
            default: Date.now,
        },
        productStatus: {
            type: String,
            enum: ["Preparing", "Out for Delivery" , "Delivered", "Ready for Takeaway"],
            default: "Preparing",
        },
        quantity: {
            type: Number,
            default: 1,
        },
        clientuser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "clientUser",
        },
    },
    {
        timestamps: true,
    }
);

const PurchasedProduct = mongoose.model("PurchasedProduct", purchasedProductSchema);
module.exports = PurchasedProduct;