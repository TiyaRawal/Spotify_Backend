const Razorpay = require("razorpay");
const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const razorpay = new Razorpay({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET});
const plans = {Standard: 119, Premium: 299};

let CreatePremiumOrder = async (req, res) => {
    try {
        let db = await connectDB();
        let collection = db.collection("users");
        let user = await collection.findOne({_id: new ObjectId(req.user.id)});
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }

        if (
            user.premium &&
            user.premiumExpiryDate &&
            new Date(user.premiumExpiryDate) > new Date()
        ) {
            return res.status(400).send({message: "Your current paid plan is already active."});
        }

        const { plan } = req.body;
        if (!plans[plan]) {
            return res.status(400).send({message: "Invalid subscription plan"});
        }

        const order = await razorpay.orders.create({
            amount: plans[plan] * 100,
            currency: "INR",
            receipt: `premium_${Date.now()}`,
            notes: {userId: String(req.user.id), plan: plan}
        });

        return res.status(200).send({message: "Order created successfully", order, key: process.env.RAZORPAY_KEY_ID});
    } catch (e) {
        return res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports = { CreatePremiumOrder };