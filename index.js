require("dotenv").config();
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const app = require("express")()


// constants
const PORT = process.env.PORT

// database connection 
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on("connected",()=>console.log("🚀 Database connected"))
mongoose.connection.on("error",()=>console.log("💡 Database Error"))

// Schema
require("./schema/user.schema")
require("./schema/post.schema")
// Routes
app.use(cors())
app.use(express.json());
app.use(require("./routes/home"));
app.use("/auth",require("./routes/auth"));
app.use("/post",require("./routes/post"));
app.use("/user",require("./routes/user"));
app.listen(PORT,()=>console.log("🎯 Server Started"));
