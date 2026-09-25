const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let GetPremiumStatus = async (req, res) => {
  try {
    let db = await connectDB();
    let collection = db.collection("users");
    let user = await collection.findOne({_id: new ObjectId(req.user.id),});

    if (!user) {
      return res.status(404).send({message: "User not found"});
    }

    if (
      user.premium && user.premiumExpiryDate && new Date(user.premiumExpiryDate) > new Date()
    ) {
      return res.status(200).send({premium: true,
        premiumPlan: user.premiumPlan,
        premiumDate: user.premiumDate,
        premiumExpiryDate: user.premiumExpiryDate,
      });
    }

    if (user.premium) {
      await collection.updateOne(
        {_id: new ObjectId(req.user.id)},
        {$set: {premium: false,}},
      );
    }

    return res.status(200).send({premium: false, premiumPlan: null, premiumDate: null, premiumExpiryDate: null});
  } catch (e) {
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = { GetPremiumStatus };