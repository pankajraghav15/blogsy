require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const Blog = require("./models/blog");


const checkForAuthenticationCookie = require("./middleware/authentication");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");



const app = express();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected")).catch((err) =>{
    console.error("MongoDB failed: ", err.message);
    process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));


//middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));


app.get("/home", async (req, res) => {

    res.render('home');
});

app.get("/", async (req, res) => {

    res.render('home', {
        user: req.user,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);




app.listen(PORT, () => console.log(`Server started at port :  ${PORT}`));