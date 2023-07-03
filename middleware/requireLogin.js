const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
let requireLogin = (req, res, next) => {
  console.log("🧨 middleware requireLogin");
  let { authorization } = req.headers;
  if (!authorization) {
    return res.json({ status: "error", msg: "Login to use Feature" });
  }

  const userToken = authorization.replace("Bearer", "").trim();
  try{
    jwt.verify(userToken, process.env.JWT, (err, payload) => {
      if(err) return res.json({status:"error",msg:"Token Invalid"})
      // console.log(payload)
      let {_id} = payload;
      User.findOne({_id}).then(userDetails=>{
        req.user = userDetails;
        next();
      })
    });
  }catch(err){
    console.log("Middleware - requireLogin - unable to auth")
    return res.send("Token Invalid")
  }
  
};

module.exports = requireLogin;
