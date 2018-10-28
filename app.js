var Campground = require("./models/campground"),
    express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    seedDB     = require("./seeds"),
    app        = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

//mongodb setup
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
seedDB();

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds) {
    if(err) {
        console.log(err);
    } else {
        res.render("index", {campgrounds: allCampgrounds});
    }
    });
});

app.post("/campgrounds", function(req, res){
   var newCampground = {
       name: req.body.name,
       image: req.body.image,
       description: req.body.description
   };
   Campground.create(newCampground, function(err, newlyCreatedCampground) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
   });
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started...");
})