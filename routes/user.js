const express = require("express");
// const { check, validationResult } = require("express-validator/check");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");
// const Image = require("../model/uploads");
const twilio = require('twilio');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

// twilio.accountSid=AC0eae5615545ef1fb55585917eea8bfcf
// twilio.authToken=829b84ab825d28c8e08c2afb204731b6
// twilio.phoneNumber=6382306217

const accountSid = 'AC0eae5615545ef1fb55585917eea8bfcf';
const authToken = '829b84ab825d28c8e08c2afb204731b6';
const twilioPhoneNumber = '+16193832659';
const client = twilio(accountSid, authToken);

// In-memory storage for user registration data (for demo purposes)
const registeredUsers = new Map();

// Serve static files (CSS, images, etc.) from the public directory


router.post('/register', async (req, res) => {
  const { phoneNumber } = req.body;

  // Generate and send OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    await sendOtp(phoneNumber, otp);

    // Store registration data in memory (you would typically use a database)
    registeredUsers.set({
      phoneNumber,
      otp,
    });
    await registeredUsers.save();
    res.render('verify', { phoneNumber });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.send('Error sending OTP. Please try again.');
  }
});


router.post('/verify', (req, res) => {
  const { email, otp } = req.body;

  // Check if the provided OTP matches the stored OTP
  const user = registeredUsers.get(email);

  if (user && user.otp == otp) {
    // Registration successful, you can save the user to the database here
    res.send('Registration successful!');
  } else {
    res.send('Invalid OTP. Please try again.');
  }
});



// Function to send OTP using Twilio
async function sendOtp(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP for registration: ${otp}`,
    from: twilioPhoneNumber,
    to: phoneNumber,
  });
}









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
