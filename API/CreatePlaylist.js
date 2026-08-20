const { connectDB } = require("../connection");

let CreatePlaylist = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("playlists");
        let count = await collection.countDocuments({userId: req.user.id});
        let playlist = {
            userId: req.user.id,
            title: `My Playlist #${count + 1}`,
            image: "",
            songs: [],
            createdAt: new Date()
        };
        let result = await collection.insertOne(playlist);
        playlist._id = result.insertedId;
        return res.status(200).send({message: "Playlist created successfully", playlist});
    } catch (e) {
        return res.status(500).send({ message: "Internal Server Error"});
    }
}

module.exports = { CreatePlaylist };