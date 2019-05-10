var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            avatar:req.body.avatar,
        });
    if(req.body.adminCode === 'secret123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
    router.get("/logout", function(req, res){
       req.logout();
       req.flash("info", "Logged you out!");
       res.redirect("/campgrounds");
    });

// user profile get
    
    router.get("/users/:id",middleware.isLoggedIn,function(req,res){
       User.findById(req.params.id,function(err,foundUser){
          if(err || !foundUser){
              req.flash("error","User not found");
              req.redirect("/campgrounds");
          } else {
              Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
                  if(err){
                      req.flash("error","Not found");
                      req.redirect("/campgrounds");
                  } else {
                  res.render("users/show",{user:foundUser,campgrounds:campgrounds});
                  }
              });
          } 
      });
    });    
    
// user profile edit form
 router.get("/users/:id/edit", function(req,res){
     User.findById(req.params.id, function(err,foundUser){
            res.render("users/edit", {user:foundUser}) 
    });
 });
 
// user profile update
router.put("/users/:id", function(req, res){
    // find and update the correct user
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/users/" + req.params.id);
       }
    });
});

router.put("/users/:id", function(req, res){
    var newData = {firstName: req.body.firstName, lastName: req.body.lastName, avatar: req.body.avatar, info: req.body.info};
    User.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/user/" + user._id);
        }
    });
});

module.exports = router;