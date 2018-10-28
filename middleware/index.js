var Comment = require("../models/comment.js"),
    Campground = require("../models/campground.js");
    
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("back");
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.cid, function(err, foundComment){
          if(err) {
              res.redirect("back");
          } else {
              if(foundComment.author.id.equals(req.user._id)) {
                 return next(); 
              } else {
                  res.redirect("back");
              }
          }
        });
    }
    res.redirect("back");
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
          if(err) {
              res.redirect("back");
          } else {
              if(foundCampground.author.id.equals(req.user._id)) {
                 return next(); 
              } else {
                  res.redirect("back");
              }
          }
        });
    }
    res.redirect("back");
};

module.exports = middlewareObj;