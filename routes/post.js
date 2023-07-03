const router = require("express").Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");
router.get("/allPost", (req, res) => {
  console.log("📃 Route allPost");
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((data) => res.send(data));
});
router.post("/myPost", (req, res) => {
  Post.find({ postedBy: req.body.postedBy })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((data) => {
      console.log("📃 Route myPosts - ", req.body);
      res.send(data);
    });
});
router.post("/newPost", requireLogin, (req, res) => {
  if (!req.user) return res.json({ status: "error", msg: "user not exist" });
  let { title, body, image } = req.body;
  let { email } = req.user;
  let newObj = {};

  (newObj.title = title), (newObj.body = body), (newObj.image = image);
  newObj.postedBy = req.user._id;
  newObj.postedByEmail = req.user.email;
  req.user.password = undefined;

  let newPost = new Post(newObj);
  newPost
    .save()
    .then((data) => {
      res.json({ email, msg: "new Post Uploaded", status: "success", data });
      console.log("📃 Route newPost-", email);
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: "error", msg: "unable to create post" });
    });
});
router.post("/delete", (req, res) => {
  let postId = req.body._id;
  console.log(postId);
  Post.findByIdAndDelete(postId)
    .then((result) => {
      console.log("post deeted");
      res.json({ status: "success", msg: "will be deleted soon", result });
    })
    .catch((error) => {
      return res.json({ status: "success", msg: "not Exist" });
    });
});
router.put("/like", (req, res) => {
  let postId = req.body._id;
  // console.log("first")
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: req.body.userId },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => {
      return res.json({ status: "error", msg: "post Not Found", error });
    });
});
router.put("/dislike", (req, res) => {
  let postId = req.body._id;
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: req.body.userId },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => {
      return res.json({ status: "error", msg: "post Not Found" });
    });
});
router.put("/save", (req, res) => {
  let userId = req.body.userId;
  let postId = req.body._id;
  User.findByIdAndUpdate(
    userId,
    {
      $push: { saved: postId },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      // console.log("result", result);
      return res.send(result);
    })
    .catch((error) => {
      return res.json({ status: "error", msg: "Login to save" });
    });
});
router.put("/unsave", (req, res) => {
  let userId = req.body.userId;
  let postId = req.body._id;
  User.findByIdAndUpdate(
    userId,
    {
      $pull: { saved: postId },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      // console.log("result", result);
      return res.send(result);
    })
    .catch((error) => {
      return res.json({ status: "error", msg: "Login to save" });
    });
});
router.put("/comment", (req, res) => {
  let comment = {
    text: req.body.text,
    postedBy: req.body.userId,
  };
  // console.log(comment);
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      return res.json({ status: "error", msg: "Login to comment" });
    });
});
router.get("/savedPost/:id", (req, res) => {
  let userId = req.params.id;
  User.findById(userId)
    .populate("saved")
    .populate(
      {
        path: "saved",
        populate: {
          path: "comments.postedBy",
        },
      }
    )
    .then((result) => {
      let { saved, remaining } = result;
      res.json(saved);
    })
    .catch((error) => {
      res.json(error);
    });
});
router.get("/explore", (req, res) => {
  Post.find({}).then((result) => {
    let imagesArray = [];
    result.map((e) => {
      imagesArray.push(e.image);
      res.json({ imagesArray });
    });
  });
});
module.exports = router;
