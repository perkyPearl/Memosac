const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./modules/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'jhdbw';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://memosac:memosacAdmin@memosac.peali.mongodb.net/?retryWrites=true&w=majority&appName=Memosac');

app.post("/register",(req,res)=>{
    const {username, password} = req.body;
    try{
        const userDoc = User.create({
            username, 
            password:bcrypt.hashSync(password,salt)
        })
        res.json(userDoc)
    }catch{ 
        res.status(400).json({message: "User already exists"})
    }
})

app.post("/login",async(req,res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password,userDoc.password)
    
    if(passOk){
        const token = jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err) throw err
            res.cookie('token',token).json({
                id:userDoc._id,
                username
            })
        });
    }else{
        res.status(400).json({message: "Invalid credentials"})
    }
})

app.get("/profile",(req,res)=>{
    const {token} = req.cookies;

    jwt.verify(token,secret,{},()=>{
        if (err) throw err
        res.json(info)
    })
})

app.listen(4000, () => {
    console.log('Server running on port 4000');
});