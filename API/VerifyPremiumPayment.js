
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const plans = {
    Standard: 119,
    Premium: 299
};

let VerifyPremiumPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).send({
                message: "Payment details are required"
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).send({
                message: "Payment Failed"
            });
        }

        const order = await razorpay.orders.fetch(
            razorpay_order_id
        );

        const plan = order.notes?.plan;

        if (
            !plans[plan] ||
            String(order.notes?.userId) !== String(req.user.id) ||
            order.amount !== plans[plan] * 100 ||
            order.status !== "paid"
        ) {
            return res.status(400).send({
                message: "Invalid payment order"
            });
        }

        let db = await connectDB();
        let collection = db.collection("users");

        let user = await collection.findOne({
            _id: new ObjectId(req.user.id)
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (
            user.premium &&
            user.premiumExpiryDate &&
            new Date(user.premiumExpiryDate) > new Date()
        ) {
            return res.status(400).send({
                message: "Your current paid plan is already active."
            });
        }

        let premiumDate = new Date();
        let premiumExpiryDate = new Date();

        premiumExpiryDate.setMonth(
            premiumExpiryDate.getMonth() + 1
        );

        await collection.updateOne(
            { _id: new ObjectId(req.user.id) },
            {
                $set: {
                    premium: true,
                    premiumPlan: plan,
                    premiumDate: premiumDate,
                    premiumExpiryDate: premiumExpiryDate
                }
            }
        );

        return res.status(200).send({
            message: `${plan} Activated Successfully`,
            premium: true,
            premiumPlan: plan,
            premiumDate: premiumDate,
            premiumExpiryDate: premiumExpiryDate
        });

    } catch (e) {
        console.log(e);

        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

module.exports = { VerifyPremiumPayment };
