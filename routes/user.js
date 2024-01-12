const express = require("express");
// const { check, validationResult } = require("express-validator/check");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");
// const Image = require("../model/uploads");
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

// twilio.accountSid=AC0eae5615545ef1fb55585917eea8bfcf
// twilio.authToken=829b84ab825d28c8e08c2afb204731b6
// twilio.phoneNumber=6382306217


// Twilio Configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


router.post('/register', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user data to MongoDB
    const user = new User({
      phoneNumber,
      otp,
    });

    await user.save();

    // Send OTP via Twilio
    const message = await twilioClient.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`OTP sent to ${phoneNumber}: ${message.sid}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  }
  catch (e) {
    res.status(500).send({ message: e.message });
  }
});









module.exports = router;
