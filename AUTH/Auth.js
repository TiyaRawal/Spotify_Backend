let jwt = require("jsonwebtoken");
require("dotenv").config();
let jwt_secret = process.env.JWT_SECRET;

let AuthMiddleWare = (req,res,next)=>{
    let authHeaders = req.headers["authorization"];
    if(!authHeaders){
        return res.status(401).send({success:false,message:"Unauthorized access! Headers not provided."})
    }
    let token =  authHeaders && authHeaders.split(" ")[1];
    if(!token){
        return res.status(401).send({success:false,message:"Unauthorized access! Token not provided."})
    }

    try{
        let decoded = jwt.verify(token,jwt_secret);
        req.user = decoded;
        next();
    }catch(e){
        return res.status(401).send({success:false,message:"Unauthorized access! Invalid token."})
    }
}

module.exports = AuthMiddleWare;