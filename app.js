const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB", {useNewUrlParser: true});
const ArticleSchema ={
    title: String,
    content: String
};
const Article = mongoose.model("Article", ArticleSchema);

// -------------------------------------TARGETING THE ARTICLE ROUTE-------------------------------------
app.route("/articles")
.get(function(req,res){
    Article.find().then(function(doc){
        res.send(doc);
    }).catch((err)=> console.log(err));
})
.post(function(req,res){
    const recivedTitle = req.body.title;
    const recivedcontent = req.body.content;
    const newArticle = new Article({
        title: recivedTitle,
        content: recivedcontent 
    }).save()
    .then(()=>{res.send("Successfully saved the sent data")})
    .catch((err)=> console.log(err));
})
.delete(function(req,res){
    Article.deleteMany()
    .then(()=>{res.send("Sucessfully Deleted")})
    .catch((err)=> console.log(err));
});


// ------------------------------------TARGETING THE SPECIFIC ROUTE-------------------------------------

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle})
    .then((doc)=> {
        if(doc === null){
            res.send("Article not found!");
        }else{
            res.send(doc);
        }
    })   
})
.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
    )
    .then((doc)=> {
        if(doc === null){
            res.send("Article not found!");
        }else{
            res.send("Article Updated Successfully.");
        }
    })
})
.patch(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then((doc)=>{
        if(doc === null){
            res.send("Article not found!");
        }else{
            res.send("Article Updated Successfully.");
        }
    })
})
.delete(function(req,res){
    Article.findOneAndDelete(
        {title: req.params.articleTitle}
    ).then((doc)=>{
        if(doc === null){
            res.send("Article not found!");
        }else{
            res.send("Article Deleted Successfully.");
        }
    })
})











app.listen(3000, ()=> console.log("Server running on Port:3000"));