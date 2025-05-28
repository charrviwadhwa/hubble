const mongoose = require('mongoose')
const Schema=new mongoose.Schema({
    name:String,
    description:String,
    logoUrl:String,
    admin:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    members:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
} ,{timestamps:true})

module.exports = mongoose.model("Society", Schema)