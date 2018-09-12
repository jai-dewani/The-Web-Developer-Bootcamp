var express = require("express");
var router = express.Router();

var User = require("../models/user");
var passport = require("passport");


router.get("/",function(req,res){
    res.render("home");
});

// ================================
// AUTH ROUTES
// ================================

//Show SignUp page
router.get("/register",function(req, res) {
    res.render("register");
});

//  Hanfel SignUp Logic
router.post("/register",function(req, res) {
    console.log(req.body);
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to  YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// SHOW login page
router.get("/login",function(req, res) {
    res.render("login",{message:req.flash("error")});
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req, res) {
    
});

// LOGOUT ROUTE
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out!!");
    res.redirect("/campgrounds");
});


module.exports = router;