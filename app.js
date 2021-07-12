const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
	title : String,
	content : String
};

const Article = mongoose.model("article",articleSchema);

////////////////////////////Request targeting all articles/////////////////////////////////////////
app.route("/articles")
   .get(function(req,res) {

     Article.find({},function(err,foundArticles) {
     	if(!err){
     		res.send(foundArticles);
     	}
     	else{
     		res.send(err);
     	}
        
     });
})
   .post(function(req,res) {
	const newArticle = new Article({  //CREATE in mongoose
		title: req.body.title,
		content:req.body.content
    });
    newArticle.save(function(err){
    	if(!err){
    		res.send("successfully added a new article");
    	}
    	else{
    		res.send(err);
    	}
    });
}) 
   .delete(function(req,res) {
    Article.deleteMany({},function(err) {
    	if(!err){
    		res.send("successfully deleted article");
    	}
    	else{
    		res.send(err);
    	}

    });
});

// //////////////////////////////////Request targeting a specific article////////////////////////////////
app.route("/articles/:articleTitle")   //Route parameters
   .get(function(req,res) {
      Article.findOne({title: req.params.articleTitle},function(err,foundArticle) {
         if(foundArticle){
         	res.send(foundArticle);
         }
         else{
         	res.send("No article matching that title was found");
         }
      });
   })
   .put(function(req,res) {
   	  Article.update({title : req.params.articleTitle},
   	  	             {title : req.body.title,content : req.body.content},
   	  	             {overwrite : true}, //This tells mongoDB  that we want to overwrite the entire document with what is specified in the update
   	  	             function(err){
                        if(!err){
                        	res.send("successfully updated all articles");
                        }
                        else{
                        	res.send(err);
                        }
   	 });
   })
   .patch(function(req,res) {
   	  Article.update({title : req.params.articleTitle},
   	  	             {$set :req.body},  //title and content
   	  	             function(err) {
   	  	             	if(!err){
   	  	             		res.send("successfully updated article");
   	  	             	}
   	  	             	else{
   	  	             		res.send(err);
   	  	             	}
   	  	             });
   })
   .delete(function(req,res){
      	Article.deleteOne({title: req.params.articleTitle},
      		               function(err){
      		               	if(!err){
      		               		res.send("successfully deleted article");
      		               	}
      		               	else{
      		               		res.send(err);
      		               	}
      		               });
   });

app.listen(3000,function() {
	console.log("server is running at port 3000");
});

// {
//     "_id" : "60ec547f6dd3c91d103e1f01",
//     "title" : "Rohit saraf",
//     "content" : "Being a foodie, Rohit Saraf loves eating Pizza, Momo, North Indian Food, and the best is Mexican Food which is one of the most favorite for him."
// }


