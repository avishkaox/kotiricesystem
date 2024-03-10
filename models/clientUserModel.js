const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientuserSchema = mongoose.Schema({

    firstname: {
        type: String,
        required: [true, "Please enter your First Name"]
    },
    lastname: {
        type: String,
        required: [true, "Please enter your last Name"]
    },
    email: {
        type: String,
        required: [true, "Please enter a email address"],
        unique: true,
        trim: true,
        match: [
            /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Password must be at least 6 characters"],
    },

    image: {
        type: Object,
        required: [true, "Please add an image"],
        default: {},
    },
    phone: {
        type: String,
        trim: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
    },

}, {

    timestamps: true,

});


//encrypted password

clientuserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});


const clientUser = mongoose.model('clientUser', clientuserSchema)
module.exports = clientUser