const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const CartSchema = mongoose.Schema(
  {
    clientuser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientUser",
      required: true,
    },
    items: [cartItemSchema]
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
