const { connectDB } = require("../connection");

let AddRecentlyPlayed = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("recentlyplayed");
        let { songId } = req.body;
        let userId = req.user.id;
        let alreadyPlayed = await collection.findOne({userId, songId});
        if (alreadyPlayed) {
            await collection.updateOne(
                {
                    _id: alreadyPlayed._id
                },
                {
                    $set: {playedAt: new Date()}
                });
            return res.status(200).send({message: "Recently played updated"});
        }
        await collection.insertOne({
            userId,
            songId,
            playedAt: new Date()
        });
        return res.status(200).send({ message: "Added to recently played" });
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error" });
    }
}

module.exports = { AddRecentlyPlayed };