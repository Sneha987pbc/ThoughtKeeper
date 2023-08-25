const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
require('dotenv').config()
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');

const { checkForAuthenticationCookie } = require("./middleware/authentications");

const app = express();
const PORT = 8000;

mongoose.connect(process.env.DB).then(() => console.log("MongoDB connected")).catch((e)=>{
    console.log("got error");
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token")); // here token is the name of our cookie
app.use(express.static(path.resolve('./public')))

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));


app.get("/", async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, ()=> console.log(`Server started at PORT: ${PORT}`));