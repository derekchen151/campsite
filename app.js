var User       = require("./models/user"),
    express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    // seedDB     = require("./seeds"),
    app        = express(),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    flash      = require("connect-flash");

var commentRoutes     = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(expressSession({
    secret: "This is a yelp camp app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.eMessage = req.flash("error");
   res.locals.sMessage = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);

//mongodb setup
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
// seedDB();

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started...");
})