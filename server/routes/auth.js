const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Get Password for noreply@vida.co.uk from Max
    user: "dayne.voller@vida.co.uk",
    pass: "orkjiHh41Afh",
  },
});

// Protected Route Test
router.get('/protected', requireLogin, (req, res) => {
    res.send("Hello user.")
})

// Signup Route
router.post("/signup", (req, res) => {
  const { name, email, password, organisation } = req.body;
  if (!name || !email || !password || !organisation) {
    return res.status(422).json({ error: "Please complete all fields." });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists." });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          organisation,
        });
        user
          .save()
          .then((user) => {
            transport.sendMail({
              to: user.email,
              from: "dayne.voller@vida.co.uk",
              subject: "Welcome to Vida Customer Portal",
              html: `<h3>Welcome to the Vida Family!</h3> <a href='http://localhost:3000/login'>You can now login here.</a>`,
            });
            res.json({ message: "Saved successfully, please check your email." });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Login Route 
router.post("/login", (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "Please provide Email and Password." })
    }
    User.findOne({ email: email })
    .then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password." })
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                // res.json({ message: "You have successfully Logged in." })
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, email } = savedUser
                res.json({ token, user: { _id, name, email } });
            } else {
                return res
                  .status(422)
                  .json({ error: "Invalid Email or Password." });
            }
        })
        .catch(err => {
            console.log(err)
        }) 
    })
})

// Reset Password Route 
router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex")
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "No user found with that email of password." })
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then((result) => {
        transport.sendMail({
          to: user.email,
          from: "dayne.voller@vida.co.uk",
          subject: "Password Reset",
          html: `
            <p>You have requested a password reset.</p>
            <h5>Click this <a href="http://localhost:3000/reset-password/${token}">Link</a> to reset your password.</h5>
          `,
        })
        res.json({ message: "Check your email to create a new password." });
      })
    })
  })
})

// Update Password Route 
router.post("/new-password", (req, res) => {
  const PasswordReset = req.body.password
  const sentToken = req.body.token
  User.findOne({ resetToken:sentToken, expireToken: {$gt: Date.now()} })
  .then(user => {
    if (!user) {
      return res.status(422).json({ error: "Please try again, you session has expired." })
    }
    bcrypt.hash(PasswordReset, 12).then(hashedpassword => {
      user.password = hashedpassword
      user.resetToken = undefined
      user.expireToken = undefined
      user.save().then((saveduser) => {
        res.json({ message: "Your password has been updated."})
      })
    })
  }).catch(err => {
    console.log(err)
  })
});

// Logout Route 
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.json({
    auth: false
  })
})

module.exports = router;
