var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment     = require("../models/comment");
var middleware = require("../middleware");
// ================================================================================
//                     Comment Routes
// ================================================================================

// SHOW Comments form
router.get("/new",middleware.isLoggedIn,function(req, res) {
    
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:campground});
        }
    });
});

// CREATE Comment
router.post("/",middleware.isLoggedIn,function(req,res){
   //lookup campgorund using id
   Campground.findById(req.params.id,function(err,campgorund){
       if(err){
           console.log(err);
           res.redirect('/campgrounds');
       } else{
           //create new comment
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   req.flash("error","Something went wrong");
                   console.log(err);
               } else{
                    //Add USERNAME AND ID to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    console.log(comment);
                    campgorund.comments.push(comment);
                    campgorund.save()
                    req.flash("success","Successfull added Comment");
                    res.redirect("/campgrounds/"+campgorund._id);
               }
           });
           //connect new comment to campground
           //redirect to campground page
       }
   });
});

// SHOW EDIT Comment
router.get("/:comment_id/edit",middleware.checkCommentOwenship,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        }
    });
});

//UPDATE Comment Route
router.put("/:comment_id",middleware.checkCommentOwenship,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// DELETE Comment Route
router.delete("/:comment_id",middleware.checkCommentOwenship,function(req,res){
    //findByIdAndDelete
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            res.render("back");
        } else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id); 
        }
    });
    
});

module.exports = router;