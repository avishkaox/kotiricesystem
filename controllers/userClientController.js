const asyncHandler = require("express-async-handler");
const clientUser = require("../models/clientUserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const clientToken = require("../models/clientTokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("../utils/cloudinary");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @desc Register user
const registerclientUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, phone, image } = req.body;

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "user images",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // validate email
  if (!email || !firstname || !lastname || !phone || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  //Check if the user email already exists

  const clientuserExists = await clientUser.findOne({ email });

  if (clientuserExists) {
    res.status(400);
    throw new Error("This email has already been registered");
  }

  // check if the phone number already excisted registerid already exists
  const phoneExists = await clientUser.findOne({ phone });

  if (phoneExists) {
    res.status(400);
    throw new Error("This Phone Number has already been registered");
  }

  // Create new user
  const clientuser = await clientUser.create({
    firstname,
    lastname,
    email,
    password,
    phone,
    image: fileData,
  });

  //Genarate token
  const clienttoken = generateToken(clientuser._id);

  // Save token to database
  const tokenData = {
    clientuserId: clientuser._id,
    clienttoken: clienttoken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 86400), //1day
  };

  await clientToken.create(tokenData);

  // Set token as HTTP-only cookie
  res.cookie("clienttoken", clienttoken, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true, // secure
  });

  if (clientuser) {
    const { _id, email, password, firstname, lastname, phone } = clientuser;
    res.status(201).json({
      _id,
      email,
      password,
      firstname,
      lastname,
      image: fileData,
      phone,
      clienttoken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data received");
  }
});

//login user

const loginclientUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate email
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // Check if user exists
  const clientuser = await clientUser.findOne({ email });

  if (!clientuser) {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, clientuser.password);

  //Genarate token
  const clienttoken = generateToken(clientuser._id);

  //send HTTP-only cookie
  res.cookie("clienttoken", clienttoken, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true, // secure
  });

  if (clientuser && passwordIsCorrect) {
    const { _id, email, password, firstname, lastname, image, phone } =
      clientuser;
    res.status(200).json({
      _id,
      email,
      password,
      firstname,
      lastname,
      image,
      phone,
      clienttoken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//logout user
const logoutclientUser = asyncHandler(async (req, res) => {
  res.cookie("clienttoken", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// get user profile

const getclientUser = asyncHandler(async (req, res) => {
  const clientuser = await clientUser.findById(req.clientuser._id);
  if (clientuser) {
    const { _id, firstname, lastname, email, phone, image } = clientuser;
    res.status(201).json({
      _id,
      firstname,
      lastname,
      email,
      phone,
      image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get Login status

const loginclientStatus = asyncHandler(async (req, res) => {
    const clienttoken = req.cookies.clienttoken;
    if (!clienttoken) {
      return res.json(false);
    }
  
    try {
      // Verify the token
      const verified = jwt.verify(clienttoken, process.env.JWT_SECRET);
      if (verified){
        return res.json(true);
      }
    
    } catch (error) {
      // Token verification failed
      return res.json(false);
    }
  });

//Update user profile

const updateclientUser = asyncHandler(async (req, res) => {
  const clientuser = await clientUser.findById(req.clientuser._id);

  if (clientuser) {
    const { firstname, lastname, email, phone, image } = clientuser;
    clientuser.email = email;
    clientuser.firstname = req.body.firstname || firstname;
    clientuser.lastname = req.body.lastname || lastname;
    clientuser.phone = req.body.phone || phone;
    clientuser.image = req.body.image || image;

    const updateclientUser = await clientuser.save();

    res.status(200).json({
      _id: updateclientUser._id,
      firstname: updateclientUser.firstname,
      lastname: updateclientUser.lastname,
      email: updateclientUser.email,
      phone: updateclientUser.phone,
      image: updateclientUser.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Update user password
const updateclientPassword = asyncHandler(async (req, res) => {
  const clientuser = await clientUser.findById(req.clientuser._id);

  const { oldPassword, password } = req.body;

  // Validate User
  if (!clientuser) {
    res.status(404);
    throw new Error("User not found , Please sign in");
  }

  //Validate password
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Validate oldpassword
  const oldPasswordMatching = await bcrypt.compare(
    oldPassword,
    clientuser.password
  );

  if (clientuser && oldPasswordMatching) {
    clientuser.password = password;
    await clientuser.save();
    res.status(200).json({ message: "Password updated successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid Old password");
  }
});

// forgot password

const forgotclientPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const clientuser = await clientUser.findOne({ email });

  if (!clientuser) {
    res.status(404);
    throw new Error("User not found");
  }

  // delete token if it exists
  let clienttoken = await clientToken.findOne({ clientuserId: clientuser._id });
  if (clienttoken) {
    await clienttoken.deleteOne();
  }

  // create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + clientuser._id;

  // Hash token before saving password

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save Token to database

  await new clientToken({
    clienttoken: hashedToken,
    clientuserId: clientuser._id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * (60 * 1000),
  }).save();

  // Construct new url
  const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

  // Reset Email

  const message = `<h2> Hello ${clientuser.firstname} </h2>
        
        <p> Please click on the following link to reset your password:</p>
        <a title="Click to visit" href="${resetUrl}" clicktravking = "off" >${resetUrl}</a>
        `;

  const subject = "Your password reset request";
  const send_to = clientuser.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Email reset request failed please try again");
  }
});

// Reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token then compare against token in db

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in database
  const clientuserToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!clientuserToken) {
    res.status(404);
    throw new Error("Token not found");
  }

  // find the user

  const clientuser = await clientUser.findOne({
    _id: clientuserToken.clientuserId,
  });
  clientuser.password = password;
  await clientuser.save();
  res.status(200).json({ message: "Password updated successfully" });
});

// Update user details by ID
const updateclientUserById = asyncHandler(async (req, res) => {
  const { id } = req.params; // User ID to update

  const clientuserToUpdate = await clientUser.findById(id);

  if (!clientuserToUpdate) {
    res.status(404);
    throw new Error("User to update not found");
  }

  // Update user details
  clientuserToUpdate.firstname =
    req.body.firstname || clientuserToUpdate.firstname;
  clientuserToUpdate.lastname =
    req.body.lastname || clientuserToUpdate.lastname;
  clientuserToUpdate.email = req.body.email || clientuserToUpdate.email;
  clientuserToUpdate.phone = req.body.phone || clientuserToUpdate.phone;
  clientuserToUpdate.image = req.body.image || clientuserToUpdate.image;

  const clientupdatedUser = await clientuserToUpdate.save();

  res.status(200).json({
    _id: clientupdatedUser._id,
    firstname: clientupdatedUser.firstname,
    lastname: clientupdatedUser.lastname,
    email: clientupdatedUser.email,
    phone: clientupdatedUser.phone,
    image: clientupdatedUser.image,
  });
});

module.exports = {
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
};
