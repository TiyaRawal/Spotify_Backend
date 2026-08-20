const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let GetRecentlyPlayed = async (req, res) => {
    try {
        let db = await connectDB();
        let recentCollection = db.collection("recentlyplayed");
        let songsCollection = db.collection("songs");
        let recentlyPlayed = await recentCollection.find({userId: req.user.id}).sort({playedAt: -1 }).toArray();
        let songs = [];
        for (let item of recentlyPlayed) {
            let song = await songsCollection.findOne({_id: new ObjectId(item.songId)});
            if (song) {
                song.playedAt = item.playedAt;
                songs.push(song);
            }
        }
        return res.status(200).send({message: "Recently played fetched successfully", songs});
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { GetRecentlyPlayed };