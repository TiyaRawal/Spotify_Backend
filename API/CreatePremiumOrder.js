const Razorpay = require("razorpay");
const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const razorpay = new Razorpay({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET});

let CreatePremiumOrder = async (req, res) => {
  try {
    let db = await connectDB();
    let collection = db.collection("users");
    let user = await collection.findOne({_id: new ObjectId(req.user.id)});

    if (
      user && user.premium && user.premiumExpiryDate && new Date(user.premiumExpiryDate) > new Date()
    ) {
      return res.status(400).send({message: "Your Premium subscription is already active."});
    }
    if (user && user.premium) {
      await collection.updateOne({_id: new ObjectId(req.user.id)},{$set: {premium: false}});
    }

    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `premium_${Date.now()}`,
    });

    return res.status(200).send({message: "Order created successfully", order, key: process.env.RAZORPAY_KEY_ID});
  } catch (e) {
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = { CreatePremiumOrder };