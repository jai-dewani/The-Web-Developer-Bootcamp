var express          = require("express");
var app              = express();
var methodOverride   = require("method-override");
var expressSanitizer = require("express-sanitizer");
var bodyParser       = require("body-parser");
var mongoose         = require("mongoose");
app.use(express.static('public'))
// app CONFIG
mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"));


// mongoose MODEL
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    res.redirect("/blogs")
})
//Index ROUTE
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
      if(err){
          console.log(err);
      } else{
          res.render("index",{blogs: blogs}); 
      }
   });
});

//New ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

// Create ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var data=req.body.blog;
    Blog.create(data,function(err,newBlog){
       if(err){
           res.render("new");
       } else{
           //redirect to the index
           res.redirect("/blogs");
       }
    });
});

//Show ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show",{blog:blog}); 
        }
    });
});

//Edit ROUTE
app.get("/blogs/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/blogs/");
        } else{
            res.render("edit",{blog:blog}); 
        }
    });
    
});

//Edit and Update ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedg){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete ROUTE
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs");
       }
   })
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("BlogApp has started!");
})
