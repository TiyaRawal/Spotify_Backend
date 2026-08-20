const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let GetLikedSongs = async (req, res) => {
    try {
        let db = await connectDB();
        let likedCollection = db.collection("likedsongs");
        let songsCollection = db.collection("songs");
        let userId = req.user.id;
        let likedSongs = await likedCollection.find({ userId: userId }).toArray();
        let songs = [];
        for (let item of likedSongs) {
            let song = await songsCollection.findOne({ _id: new ObjectId(item.songId)});
            if (song) {
                song.dateAdded = item.dateAdded;
                songs.push(song);
            }
        }
        return res.status(200).send({message: "Liked songs fetched successfully", songs });
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error" });
    }
}

module.exports = { GetLikedSongs };