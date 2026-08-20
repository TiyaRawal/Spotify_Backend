const { ObjectId } = require("mongodb");
const { connectDB } = require("../connection");

let GetPlaylistById = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("playlists");
        let playlist = await collection.findOne({ _id: new ObjectId(req.params.id)});
        if (!playlist) {
            return res.status(404).send({message: "Playlist not found"});
        }
        return res.status(200).send({playlist});
    } catch (e) {
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { GetPlaylistById };