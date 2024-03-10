const asyncHandler = require('express-async-handler');
const clientUser = require('../models/clientUserModel');
const jwt = require('jsonwebtoken');


const protectclient = asyncHandler(
    async (req, res, next) => {

        try {
            const clienttoken = req.cookies.clienttoken
            if (!clienttoken) {
                res.status(401)
                throw new Error('Not authorized')
            }

            // Verify the token
            const verified = jwt.verify(clienttoken, process.env.JWT_SECRET);

            // Get user id from the token
            const clientuser = await clientUser.findById(verified.id).select("-password")

            if (!clientuser) {
                res.status(401)
                throw new Error('user not found')
            }
            req.clientuser = clientuser;
            next();

        }
        catch (error) {
            res.status(401);
            throw new Error("Not authorized please try again")
        }

    }
);


module.exports = protectclient