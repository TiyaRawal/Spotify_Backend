const crypto = require("crypto");
const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

require("dotenv").config();

let VerifyPremiumPayment = async (req, res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, plan} = req.body;
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
            
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).send({message: "Payment Failed"});
        }
        let db = await connectDB();
        let collection = db.collection("users");
        await collection.updateOne({_id: new ObjectId(req.user.id)},{  $set: {premium: true,premiumPlan: plan,premiumDate: new Date()}});

        return res.status(200).send({message: "Premium Activated"});
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = { VerifyPremiumPayment };