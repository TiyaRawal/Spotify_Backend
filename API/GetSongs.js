const {connectDB}=require("../connection");

let GetSongs=async(req,res)=>{
    try{
        let db= await connectDB();
        let collection=db.collection("songs");
        let songs= await collection.find().limit(15).toArray();
        return res.status(200).send({message:"Songs fetched successfully",songs:songs}); 
    }catch(e){
        return res.status(500).send({message:"Internal Server Error"})
    }
}

module.exports={GetSongs};