const { connectDB } = require("../connection");

let LikeSong = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("likedsongs");
        let { songId } = req.body;
        let userId = req.user.id;
        let alreadyLiked = await collection.findOne({userId: userId, songId: songId});

        if (alreadyLiked) {
            await collection.deleteOne({_id: alreadyLiked._id});
            return res.status(200).send({message: "Song removed from liked songs"});
        }
        await collection.insertOne({userId: userId, songId: songId, dateAdded: new Date()});
        
        return res.status(200).send({message: "Song added to liked songs"});
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports = { LikeSong };