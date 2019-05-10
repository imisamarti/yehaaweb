var Campground = require ("../models/campground.js");
var Comment = require ("../models/comment.js");
var User = require ("../models/user.js");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCampground)=>{
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error","No permission granted");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You must be logged in");
       res.redirect("back");
    }
};

middlewareObj.checkProfileOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        User.findById(req.params.id,(err,foundUser)=>{
            if(err|| !foundUser){
                req.flash("error","User not found");
                res.redirect("back");
            } else {
                if(foundUser.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                req.flash("error","No permission granted");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You must be logged in");
       res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        req.flash("error","You must be logged in");
        res.redirect("/login");
}

module.exports = middlewareObj;