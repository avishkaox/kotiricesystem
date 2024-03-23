const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema(
  {
    clientuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "clientUser",
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

const Delivery = mongoose.model("delivery", deliverySchema);
module.exports = Delivery;
