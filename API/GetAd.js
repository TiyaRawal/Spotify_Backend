const { connectDB } = require("../connection");

let GetAd = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("ads");
        let ad = await collection.aggregate([
            {
                $match: {active: true }
            },
            {
                $sample: {size: 1}
            }
        ]).toArray();
        if (ad.length === 0) {
            return res.status(404).send({message: "No Advertisement Found"});
        }
        return res.status(200).send({message: "Advertisement fetched successfully", ad: ad[0] });
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error" });
    }
}

module.exports = { GetAd };