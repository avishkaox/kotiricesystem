const express = require('express');
const {
    registerclientUser,
    loginclientUser,
    logoutclientUser,
    getclientUser,
    loginclientStatus,
    updateclientUser,
    updateclientPassword,
    forgotclientPassword,
    resetPassword,
    updateclientUserById,
} = require('../controllers/userClientController.js');
const protectclient = require('../middleWare/authclientMiddleware.js');
const router = express.Router();
const { upload } = require("../utils/fileUpload");


router.post("/registerclient", upload.single("image"),  registerclientUser);
router.post("/loginclient", loginclientUser);
router.get("/logoutclient", logoutclientUser);
router.get("/getclientUser", protectclient, getclientUser);
router.get("/loggedinclient", loginclientStatus);
router.patch("/updateclientuser", protectclient, updateclientUser);
router.patch("/updateclientuser/:id", protectclient,  updateclientUserById);
router.patch("/updatclientpassword", protectclient, updateclientPassword);
router.post("/forgotclientpassword", protectclient, forgotclientPassword);
router.put("/resetpassword/:resetToken", protectclient, resetPassword);

module.exports = router;