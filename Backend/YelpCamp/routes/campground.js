var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");
// INDEX - Home page

router.get("/", function(req,res){
    Campground.find({},function(err,allcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allcamp});
        }
    });
});


router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var imageurl = req.body.image;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    var newcampground = {name:name, image:imageurl,author:author, description: desc};
    
    Campground.create(newcampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

// CREATE - new CampGround
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});


// SHOW - Show more info about a campground
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log("Found Campground: "+foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            //console.log(err);
            res.redirect(""+req.params.id);
        }
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});
// UPDATE Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the corrent campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            req.flash("success","You updated this Campground");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// DESTROY Campfround Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds/")
        }
    })
    
});

module.exports = router;
