const {connectDB}=require("../connection");

let GetArtists=async(req,res)=>{
    try{
        let db= await connectDB();
        let collection=db.collection("artists");
        let artists= await collection.find().limit(10).toArray();
        return res.status(200).send({message:"Artists fetched successfully",artists:artists});
        
    }catch(e){
        return res.status(500).send({message:"Internal Server Error"})
    }
}

module.exports={GetArtists};