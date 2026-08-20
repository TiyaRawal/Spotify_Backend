let express=require("express");
let cors=require("cors");
let app=express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Spotify Backend Running 🚀");
});

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:8000',
    'https://spotify-frontend-o19e.onrender.com'
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

const{connectDB}=require("./connection");
const{Signup}=require("./API/Signup");
const{Login}=require("./API/Login");
const{GetBrowseCategory}=require("./API/GetBrowseCategory");
const{GetSongs}=require("./API/GetSongs");
const{GetArtists}=require("./API/GetArtists");
const{GetSongDescription}=require("./API/GetSongDescription");
const{GetDashboard}=require("./API/Dashboard");
const{SearchSong}=require("./API/SearchSongs");
const AuthMiddleWare = require("./AUTH/Auth");
const { LikeSong } = require("./API/LikeSong");
const { GetLikedSongs } = require("./API/GetLikedSongs");
const { GetProfile } = require("./API/GetProfile");
const { UpdateProfile } = require("./API/UpdateProfile");
const { AddRecentlyPlayed } = require("./API/AddRecentlyPlayed");
const { GetRecentlyPlayed } = require("./API/GetRecentlyPlayed");
const { CreatePremiumOrder } = require("./API/CreatePremiumOrder");
const { VerifyPremiumPayment } = require("./API/VerifyPremiumPayment");
const { GetAd } = require("./API/GetAd");
const { CreatePlaylist } = require("./API/CreatePlaylist");
const { GetPlaylist } = require("./API/GetPlaylist");
const { AddSongToPlaylist } = require("./API/AddSongToPlaylist");
const { GetPlaylistById } = require("./API/GetPlaylistById");

let port=process.env.PORT || 8000;
require("dotenv").config();

connectDB();

app.post("/signup",Signup);
app.post("/login",Login);
app.get("/browseCategory",GetBrowseCategory);
app.get("/songs",GetSongs);
app.get("/artists",GetArtists);
app.get("/songDescription/:id",GetSongDescription);
app.get("/dashboard",AuthMiddleWare,GetDashboard);
app.get("/ad", GetAd);
app.get("/search",SearchSong);
app.post("/likedsong",AuthMiddleWare,LikeSong);
app.get("/getlikedsong",AuthMiddleWare,GetLikedSongs);
app.get("/profile", AuthMiddleWare, GetProfile);
app.put("/profile", AuthMiddleWare, UpdateProfile);
app.post("/recentlyplayed", AuthMiddleWare, AddRecentlyPlayed);
app.get("/recentlyplayed", AuthMiddleWare, GetRecentlyPlayed);
app.post("/premiumorder", AuthMiddleWare, CreatePremiumOrder);
app.post("/premiumverify", AuthMiddleWare, VerifyPremiumPayment);
app.post("/playlist", AuthMiddleWare, CreatePlaylist);
app.get("/playlist", AuthMiddleWare, GetPlaylist);
app.post("/playlist/addsong", AuthMiddleWare, AddSongToPlaylist);
app.get("/playlist/:id", AuthMiddleWare, GetPlaylistById);

app.listen(port,()=>{
    console.log("Server is running on port " + port);
})