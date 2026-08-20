const Razorpay = require("razorpay");
require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

let CreatePremiumOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `premium_${Date.now()}`
        });
       return res.status(200).send({message: "Order created successfully", order, key: process.env.RAZORPAY_KEY_ID});
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Internal Server Error"});
    }
}

module.exports = { CreatePremiumOrder };