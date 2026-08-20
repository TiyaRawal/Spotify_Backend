const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let GetProfile = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("users");
        let profile = await collection.findOne({ _id: new ObjectId(req.user.id) },{projection: {password: 0}});
        if (!profile) {
            return res.status(404).send({message: "User not found"});
        }
        if (profile.createdAt) {
            profile.joinedDate = new Date(profile.createdAt).toLocaleString( "default",{ month: "short", year: "numeric"});
        }
        return res.status(200).send({message: "Profile fetched successfully", profile});
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { GetProfile };