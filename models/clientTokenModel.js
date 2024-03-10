const mongoose = require('mongoose');


const clienttokenSchema = mongoose.Schema({

    clientuserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'clientUser'
    },

    clienttoken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
})

const clientToken = mongoose.model("clientToken", clienttokenSchema);

module.exports = clientToken;