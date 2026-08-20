const { ObjectId } = require("mongodb");
const { connectDB } = require("../connection");

let AddSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        let db = await connectDB();
        let playlistCollection = db.collection("playlists");
        let songsCollection = db.collection("songs");
        let song = await songsCollection.findOne({_id: new ObjectId(songId) });
        if (!song) {
            return res.status(404).send({ message: "Song not found"});
        }
        await playlistCollection.updateOne(
            { _id: new ObjectId(playlistId) },
            {
                $push: {songs: song}
            }
        );
        return res.status(200).send({message: "Song added successfully"});
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { AddSongToPlaylist };