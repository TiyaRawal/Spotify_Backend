const { ObjectId } = require("mongodb");
const { connectDB } = require("../connection");

let GetSongDescription = async (req, res) => {  
    try {
        let db = await connectDB()
        let collection = db.collection("songs")
        let {id } = req.params;
        let songDescription = await collection.find({ _id: ObjectId.createFromHexString(id) }).toArray()
        if (songDescription.length === 0) {
            return res.status(404).send({ message: "Song not found" })
        }
        else {
            return res.status(200).send({ message: "Song found", songDescription })
        }
    }
    catch (e) {
        return res.status(500).send({ message: "Internal server error" })
    }
     
}
module.exports = { GetSongDescription }