const mongoose = require('mongoose');
const {model} = mongoose;

const UserSchema = new mongoose.Schema({
    username:{type: String , required : true, min:4 , unique : true},
    password:{type: String},
    email : {type: String},
    profilePic:{type:String,default: "../assets/DefaultUserImg.png"},
    DOB:{type:Date}
});

const UserModel = model('User',UserSchema);

module.exports = UserModel;