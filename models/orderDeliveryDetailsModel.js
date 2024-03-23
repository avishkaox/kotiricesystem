const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema(
  {
    clientuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "clientUser",
    },
    orderid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PurchasedProduct",
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss", "Ms", "Dr"],
      required: [true, "Select Your Title"],
      trim: true,
    },
    firstname: {
      type: String,
      required: [true, "Please add a First Name"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Please add a Last Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter a Email address"],
      unique: true,
      trim: true,
      match: [
        /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    houseno: {
      type: String,
    },
    addresslineone: {
      type: String,
    },
    addresslinetwo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;
