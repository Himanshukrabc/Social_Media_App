const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts.js");
const multer = require('multer');
const path = require('path');

dotenv.config();
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},(err)=>{
    if(err)console.log(err);
    else console.log("Connected to MongoDB");
});

app.use("/images",express.static(path.join(__dirname,"public/images")));

// Middleware q
app.use(cors());
app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false}));
app.use(morgan("common"));
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },  
    filename: (req,file,cb)=>{
        cb(null,req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        console.log(req.body);
        return res.status(200).send("File Uploaded");
    }
    catch(err){
        console.log(err);
    }
});

app.listen(8000,()=>{
    console.log("Listening to port 8000");
});
