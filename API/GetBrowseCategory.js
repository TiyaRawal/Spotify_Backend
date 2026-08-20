const {connectDB}=require("../connection");

let GetBrowseCategory=async(req,res)=>{
    try{
        let db= await connectDB();
        let collection=db.collection("BrowseCategory");
        let categories= await collection.find().toArray();
        return res.status(200).send({message:"Browse categories fetched successfully",browseCategory:categories});
        
    }catch(e){
        return res.status(500).send({message:"Internal Server Error"})
    }
}

module.exports={GetBrowseCategory};