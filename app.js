if(process.env.NODE_ENV !="production"){
    require('dotenv').config();

}
//console.log(process.env.CLOUD_API_SECRET);

const express = require('express');
const app = express();
const port = 8080;
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const { listingSchema } = require("./schema.js");
//const Review = require("./models/review.js");
//const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;


const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// getting-started.js
const mongoose = require('mongoose');


//const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL;


main().then(()=>console.log("coonected to DB")) 
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


//store
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
//session
const sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};





app.use(session(sessionOptions));
app.use(flash());

// password authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "webdev-student"
//     });
//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })

//listing
app.use("/listings", listingRouter);
//review
app.use("/listings/:id/reviews", reviewRouter);
//user
app.use("/",userRouter);

//root routenode 
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});
app.use((err,req,res, next)=>{
    let {statusCode = 500, message= "someting is wrong!"} =err; 
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
    //res.send("someting is wrong!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});