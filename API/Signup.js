const{connectDB} = require("../connection");

let Signup = async (req, res) => {
    try{
        let db = await connectDB();
        let collection = db.collection("users");
        let {email}= req.body;
        if(!email){
            return res.status(400).send({message:"Email is required"})
        }
        let userExists = await collection.findOne({email});
        if(userExists){
        return res.status(400).send({message:"User already exists"});
        }
        let user= {
            email,
            username: "",
            profileImage: "",
            createdAt: new Date()
        }
        let insertUser = await collection.insertOne(user);
        if(insertUser.acknowledged){
            return res.status(201).send({message:"Signup successful"})
        }
    }catch(e){
        return res.status(500).send({message:"Internal Server Error"})
        }
    }

    module.exports={ Signup };