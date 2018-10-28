var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middlewareObj = require("../middleware");
    
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//display all campgrounds route
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

//create new campground route
router.post("/", middlewareObj.isLoggedIn, function(req, res){
   var newCampground = {
       name: req.body.name,
       image: req.body.image,
       price: req.body.price,
       description: req.body.description,
       author: {
           id: req.user._id,
           username: req.user.username
       }
   };
   Campground.create(newCampground, function(err, newlyCreatedCampground) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
   });
});

//show specific campground route
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log(err);
        }
        res.redirect("/campgrounds/"+req.params.id);
    });
});

//delete campground route
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, updatedCampground) {
    if(err) {
        console.log(err);
    }
    res.redirect("/campgrounds");
    });
}) ;

module.exports = router;