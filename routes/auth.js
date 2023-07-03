const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let requireLogin = require("../middleware/requireLogin");
let User = mongoose.model("User");

router.get("/test", () => console.log("🎲 auth route tested", User));

// register
router.post("/register", (req, res) => {
  let { email, password, name } = req.body;
  User.findOne({ email }).then((userFound) => {
    // if user found
    if (userFound) {
      res.json({
        msg: "User Exists Try with new mail",
        status: "error",
      });
      return;
    }
    // if no user found
    bcrypt.hash(password, 10).then((hashPassword) => {
      const newUser = new User({ email, password: hashPassword, name });
      newUser
        .save()
        .then((user) => {
          console.log("🔑 Route Register-", email);
          res.json({ status: "success", msg: "New user saved", newUser });
        })
        .catch((error) => console.log(error));
    });
  });
});

// login
router.post("/login", (req, res) => {
  let { email, password } = req.body;
  User.findOne({ email })
    .then((savedUser) => {
      // no user found
      if (!savedUser) {
        return res.json({ status: "error", msg: "invalid details" });
      }

      // if user found then comparing
      let hashedPassword = savedUser.password;
      bcrypt.compare(password, hashedPassword).then((verified) => {
        if (verified) {
          const token = jwt.sign({ _id: savedUser._id }, process.env.JWT);
          console.log("🔑 Route Login-", email);
          return res.json({
            status: "success",
            msg: "verified",
            email,
            token,
            userId: savedUser._id,
          });
        }
        return res.json({ status: "error", msg: "invalid details" });
      });
    })
    .catch((error) => console.log(error));
});

// forget
router.post("/forget", (req, res) => {
  let { email } = req.body;
  User.findOne({ email }).then((userFound) => {
    if (!userFound) return res.json({status:"error",msg:"user not exist"})
    async function sendEmail() {
      try {
        // Create a transporter using your email provider's SMTP settings
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'devrahul200229@gmail.com',
            pass: 'Karan@123'
          }
        });
    
        // Configure the email details
        const mailOptions = {
          from: 'devrahul200229@gmail.com',
          to: 'developerkaran025@gmail.com',
          subject: 'Your Email Subject',
          text: 'Hello, this is the content of the email.'
        };
    
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        res.json({ status: "successs", msg: "sending email" });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
    
  });
});

// protected
router.post("/protected", requireLogin, (req, res) => {
  res.json(req.user);
});

// all user
router.get("/allUser", (req, res) => {
  User.find().then((data) => res.json(data));
});
module.exports = router;
