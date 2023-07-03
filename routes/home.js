const router = require("express").Router();
router.get("/",(req,res)=>{
    res.send("🎉 Home page")
})
// let mongoose = require("mongoose")
// let User = mongoose.model("User")
// User.find()
module.exports = router;