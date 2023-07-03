let router = require("express").Router();
let mongoose = require("mongoose");
let User = mongoose.model("User");
router.post("/userDetails", (req, res) => {
  let _id = req.body._id;
  User.findById(_id)
    .then((result) => res.send(result))
    .catch((error) => res.json({ status: "error", msg: "user not found" }));
});

router.put("/updateProfile", (req, res) => {
  console.log("🎭 Route - User - UpdateProfile - Pending ");
  let { newName, newAbout, newImage, userId } = req.body;
  // console.log(req.body);
  User.findOne({ _id: userId })
    .then((userFound) => {
      // console.log(userFound)
      userFound.pic = newImage;
      userFound.name = newName;
      userFound.description = newAbout;
      userFound
        .save()
        .then((updatedUser) => {
          console.log("🎭 Route - User - UpdateProfile - 🥇 done ");
          // console.log("newDetails",updatedUser)
          return res.json({ status: "success", msg: "uploaded", updatedUser });
        })
        .catch((error) => {
          console.log("🎭 Route - User - UpdateProfile - 🎏 rejected ");
          return res.json({
            status: "error",
            msg: "unable to save your new details",
          });
        });
    })
    .catch((error) => {
      console.log("🎭 Route - User - UpdateProfile - 🎏 rejected ");
      res.json({ status: "error", msg: "no user found" });
    });
});
router.post("/followUser", (req, res) => {
  // userId - followig array add
  // targetUserId - follers array add
  let { userId, targetUserId } = req.body;
  console.log(
    "🎃 Route - user - followUser pending ⌚ reqUser targetUser",
    userId + targetUserId
  );
  User.findByIdAndUpdate(
    userId,
    {
      $push: { following: targetUserId },
    },
    {
      new: true,
    }
  )
    .then((reqUser) => {
      User.findByIdAndUpdate(
        targetUserId,
        {
          $push: { followers: userId },
        },
        { new: true }
      ).then((result) => {
        console.log(
          "🎃 Route - user - followUser reqUser",
          userId,
          "targetUser",
          targetUserId,
          "🥇 accepted"
        );
        return res.json({ status: "success", msg: "new user followed" });
      });
    })
    .catch((error) => {
      console.log(
        "🎃 Route - user - followUser reqUser",
        userId,
        "targetUser",
        targetUserId,
        "🎏 rejected by requser"
      );
      return res.json({ status: "error" });
    });
});
router.post("/unFollowUser", (req, res) => {
  // userId - followig array add
  // targetUserId - follers array add
  let { userId, targetUserId } = req.body;
  console.log(
    "🎃 Route - user - followUser reqUser ",
    userId,
    " targetUser ",
    targetUserId,
    " pending "
  );
  User.findByIdAndUpdate(
    userId,
    {
      $pull: { following: targetUserId },
    },
    {
      new: true,
    }
  )
    .then((reqUser) => {
      User.findByIdAndUpdate(
        targetUserId,
        {
          $pull: { followers: userId },
        },
        { new: true }
      ).then((result) => {
        console.log(
          "🎃 Route - user - followUser reqUser",
          userId,
          "targetUser",
          targetUserId,
          "🥇 accepted"
        );
        return res.json({ status: "success", msg: "unfollowed user" });
      });
      // .catch((error) => {
      //   console.log(
      //     "🎃 Route - user - followUser reqUser",
      //     userId,
      //     "targetUser",
      //     targetUserId,
      //     "🎏 rejected by target"
      //   );
      //   return res.json({ status: "error" });
      // })
    })
    .catch((error) => {
      console.log(
        "🎃 Route - user - followUser reqUser",
        userId,
        "targetUser",
        targetUserId,
        "🎏 rejected by requser"
      );
      return res.json({ status: "error" });
    });
});
router.get("/getFollers/:id", (req, res) => {
  let userId = req.params.id;
  User.findById(userId)
    .populate("followers", "name email pic")
    .then((userFound) => {
      let { followers } = userFound;

      res.json(followers);
    });
});
router.get("/getFollowing/:id", (req, res) => {
  let userId = req.params.id;
  User.findById(userId)
    .populate("following", "name email pic")
    .then((userFound) => {
      let { following } = userFound;

      res.json(following);
    });
});
router.get("/search/:email", (req, res) => {
  let emailId = req.params.email
  User.findOne({ email: emailId })
    .then((user) => {
      if(user){
        return res.json({status:"success",msg:"user Found",user});
      }
      return res.json({status:"error",msg:"user not Found",user})
    })
    .catch((error) => {
      res.send("no user found");
    });
});
router.get("/find/allUsers",(req,res)=>{
  console.log("😎 Route User allUser ")
  User.find({}).sort("-createdAt").then(allUser=>{
    res.send(allUser)
  })
})
router.get("/:email", (req, res) => {
  let email = req.params.email;
  console.log("🎃 User ", email);
  User.findOne({ email })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ status: "error", msg: "User not Exist", error });
    });
});
module.exports = router;
