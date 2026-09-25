const { connectDB } = require("../connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let jwtSecret = process.env.JWT_SECRET;

let Login = async (req, res) => {
  let db = await connectDB();
  let collection = db.collection("users");
  let { email, password } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).send({ message: "Password is required" });
  }

  let userExists = await collection.findOne({ email });
  if (!userExists) {
    return res.status(404).send({ message: "Invalid user email" });
  } else {
    let passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid password" });
    }

    userdata = {
      id: userExists._id,
      email: userExists.email,
    };

    let token = jwt.sign(userdata, jwtSecret, { expiresIn: "1h" });
    return res.status(200).send({ message: "Login successful", token, user: userdata });
  }
};

module.exports = { Login };