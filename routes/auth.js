const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // error handling
  try {
    const { name, email, mobile, password } = req.body;
    // valid check
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    // check if user already exists
    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // write a check for mobile number also

    const hashedPassword = await bcrypt.hash(password, 10);

    // write into the database
    const userDate = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    const userResponse = await userDate.save();

    const token = await jwt.sign(
      { userId: userResponse._id },
      process.env.JWTSECRET_KEY
    );
    res.json({
      message: "User registered successfully",
      token: token,
      name: name,
    });
  } catch (err) {
    console.log(err);
  }

  // joi and yup optional
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Bad Request! Invalid credentials" });
    }

    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = await jwt.sign(
      {
        userId: userDetails._id,
      },
      process.env.JWTSECRET_KEY
    );

    res.json({
      message: "loggedIn Successfully!",
      token: token,
      name: userDetails.name,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
