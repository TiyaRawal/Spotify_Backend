const {connectDB} = require("../connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let jwtSecret = process.env.JWT_SECRET;

let Login = async(req,res)=>{
    let db = await connectDB();
    let collection = db.collection("users");
    let {email}= req.body;
    let userExists = await collection.findOne({email});
    if(!userExists){
        return res.status(404).send({message:"Invalid user email"});
    }else{
        userdata={
            id:userExists._id,
            email:userExists.email,
        }
        let token = jwt.sign(userdata,jwtSecret,{expiresIn:"1h"});
        return res.status(200).send({message:"Login successful",token,user:userdata});
        }
}

module.exports={Login}; 