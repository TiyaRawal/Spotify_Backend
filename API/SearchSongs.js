const { connectDB } = require("../connection");

let SearchSong = async (req, res) => {
    try {
        let { query } = req.query;
        let db = await connectDB();
        let collection = db.collection("songs");
        let song = await collection.findOne({
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    artist: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    album: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        });
        if (!song) {
            return res.status(404).send({message: "Song not found"});
        }
        return res.status(200).send({message: "Song found",song});
    }
    catch (e) {
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { SearchSong };