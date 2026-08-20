const { ObjectId } = require("mongodb");
const { connectDB } = require("../connection");

let GetDashboard = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("users");
        let user = await collection.findOne({ _id: ObjectId.createFromHexString(req.user.id) },{ projection: { password: 0 } } );
        if (!user) {
            return res.status(404).send({success: false, message: "User not found" });
        }
        return res.status(200).send({success: true, message: "Dashboard loaded successfully", data: user});
    } catch (e) {
        return res.status(500).send({success: false, message: "Internal Server Error" });
    }
}

module.exports = { GetDashboard };