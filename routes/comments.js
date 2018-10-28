var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Comment    = require("../models/comment"),
    Campground = require("../models/campground"),
    middlewareObj = require("../middleware");

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
          var newComment = {
              text: req.body.text,
              author: {
                  id: req.user._id,
                  username: req.user.username
              }
          };
          Comment.create(newComment, function(err, comment) {
              if(err) {
                  console.log(err);
              } else {
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  res.redirect("/campgrounds/"+foundCampground._id);
              }
          });
       }
    });  
});

//edit comment
router.get("/:cid/edit", middlewareObj.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
     if(err) {
         console.log(err);
     } 
     Comment.findById(req.params.cid, function(err, foundComment) {
     if(err) {
        console.log(err);
     }
     res.render("comments/edit", {campground: foundCampground, comment: foundComment});
    });
  });
});

//update comment
router.put("/:cid", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findOneAndUpdate(
        {_id:req.params.cid}, 
        {
            text: req.body.text,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        },
        function(err, updatedComment) {
            if(err) {
                console.log(err);
            } else {
            res.redirect("/campgrounds/"+req.params.id);
    }}); 
});

router.delete("/:cid", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findOneAndRemove({_id:req.params.cid}, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;
