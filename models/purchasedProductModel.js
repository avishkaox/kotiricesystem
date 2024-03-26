const mongoose = require("mongoose");

const purchasedProductSchema = mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    purchasedDate: {
      type: Date,
      default: Date.now,
    },
    productStatus: {
      type: String,
      enum: [
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Ready for Takeaway",
      ],
      default: "Preparing",
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount:{
        type: Number,
    }
  },
  {
    timestamps: true,
  }
);

const PurchasedProduct = mongoose.model(
  "PurchasedProduct",
  purchasedProductSchema
);
module.exports = PurchasedProduct;
