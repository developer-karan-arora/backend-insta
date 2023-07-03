const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/krnblog05-insta/image/upload/v1687781072/logo_gjwki2_exrl06_tpslqb_jow961_utk8tg.png",
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    saved: [{ type: ObjectId, ref: "Post"}],
  },
  {
    timestamps: true,
  }
);

mongoose.model("User", userSchema);
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDkzZDk5NDBjODE4NTRkZWQ1NmQyYjciLCJpYXQiOjE2ODc0MTM0MjV9.o3DO9jNxLEYitKbBtGPf_i9TCe4cWkepJDxqVuz2Q9s"
