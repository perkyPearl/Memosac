const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
    photo:{
        data:Buffer,
        contentType:String
    },
    title:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    tags:[{
        type:String,
        trim:true
    }],
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const Gallery = mongoose.model("Gallery",gallerySchema);

module.exports = Gallery;