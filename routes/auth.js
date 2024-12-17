const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { find, findOne } = require("../models/Product");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'mridulisagoodb$oy';
const fetchUser = require("../middelware/fetchuser")

//Rout 1: creat a user using post request aut is not requierd without login,http://localhost:4000/api/auth/createuser
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if their are error return bad request and error massage
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check weather the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password,salt)
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      const data = {
        user:{
            id:user.id
        }
      }
      const authTokan = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success,authTokan})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);
//Rout 2: Authenticate a user using post request aut is not requierd without login http://localhost:4000/api/auth/login
router.post(
    "/login",
    [
      body("email","enter a valid email").isEmail(),
      body("password", "Password can not be blank").exists(),
    ],
    async (req, res) => {
      let success=false;
      //if their are error return bad request and error massage
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({success, errors: errors.array() });
      }
      const {email,password} = req.body;
      try {
        let user = await User.findOne({email});
        if(!user){
          success=false;
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
          success=false;
            return res.status(400).json({success,error:"Please try to login with correct credentials"})
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const authTokan = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authTokan})
      } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured");
      }
    }
);

// Route 3 Get logd in user details using Post:login http://localhost:4000/api/auth/getuser. login requier
router.post(
    "/getuser",
    fetchUser,
    async (req, res) => {
        try {
            const userid = req.user.id;
            const user = await User.findById(userid).select("-password");
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error occured");
          }
    }
);
module.exports = router;
