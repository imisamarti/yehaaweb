var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
    //routes
    var commentsRoute       = require("./routes/comments"),
        campgroundsRoute    = require("./routes/campgrounds"),
        authRoute           =  require("./routes/auth");
    
      
    var url= process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"RRR",
    resave:false,
    saveUninitialized:false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.info = req.flash("info");
   next();
});

app.use("/",authRoute);
app.use("/campgrounds",campgroundsRoute);
app.use("/campgrounds/:id/comments",commentsRoute);

app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("YELPCAMP SERVER UP");
});