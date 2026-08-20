const { connectDB } = require("../connection");

let GetPlaylist = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("playlists");
        let playlists = await collection.find({ userId: req.user.id}).toArray();
        return res.status(200).send({playlists});
    } catch (e) {
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { GetPlaylist };