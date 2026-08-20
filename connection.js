require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URL;
let client;
let db;

const connectDB = async () => {
    if (db) {
        return db;
    }
    client = new MongoClient(url);
    await client.connect();
    console.log("Spotify DB Connected");
    db = client.db("SpotifyDB");
    return db;
};

module.exports = { connectDB };