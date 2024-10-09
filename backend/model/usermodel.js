const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["owner","customer","restaurant"],
        default:"customer"
    },
},
{
    timestamps:true
});

const user=mongoose.model("user",schema);

module.exports=user;