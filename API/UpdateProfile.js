const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let UpdateProfile = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("users");
        let update = {};
        if (req.body.username) {
            update.username = req.body.username;
        }
        if (req.body.profileImage) {
            update.profileImage = req.body.profileImage;
        }
        await collection.updateOne({_id: new ObjectId(req.user.id)},{$set: update});
        return res.status(200).send({message: "Profile updated successfully"});
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Internal Server Error"});
    }
}

module.exports = { UpdateProfile };