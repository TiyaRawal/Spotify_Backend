const { connectDB } = require("../connection");
const { ObjectId } = require("mongodb");

let SelectBasicPlan = async (req, res) => {
  try {
    let db = await connectDB();
    let collection = db.collection("users");

    await collection.updateOne(
      { _id: new ObjectId(req.user.id) },
      {
        $set: {
          premium: false,
          premiumPlan: "Basic",
          premiumDate: new Date(),
          premiumExpiryDate: null
        }
      }
    );

    return res.status(200).send({
      message: "Basic Plan Activated Successfully",
      premium: false,
      premiumPlan: "Basic",
      premiumDate: new Date(),
      premiumExpiryDate: null
    });

  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  }
};

module.exports = { SelectBasicPlan };