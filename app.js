
// all requireed packages:
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");

//connceting to mongodb local server:
mongoose.connect("mongodb://localhost:27017/bloggDB");

//dummy txt string:
const homeStartingContent="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
const contactContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const app = express();

//using ejs templates views:
app.set('view engine', 'ejs');

// using body-parser to feach data from submited action:
app.use(bodyParser.urlencoded({extended: true}));

//using static style sheet and many more using express static:
app.use(express.static("public"));

// using current date and year using js date prop:
var date=new Date();
var fullYear=date.getFullYear();

//storing data locally:
// var postArray=[];
var userData={
  userName:"",
  message:""
};

//using mongodb database to store data:
const postSchema=new mongoose.Schema({
  title: String,
  content: String
});
const Post=mongoose.model("post",postSchema);
const post1=new Post({
  title:"Day 1",
  content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates maxime nulla quasi consequatur quidem temporibus dignissimos amet at magnam, ex ipsa nostrum fuga illo eveniet dolorum exercitationem possimus debitis error consectetur reiciendis! Corporis consequatur porro ducimus doloremque amet eaque atque non maiores, ut quod! Veniam laboriosam quis voluptatem blanditiis dolores?"
});
const post2=new Post({
  title:"Day 2",
  content:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates maxime nulla quasi consequatur quidem temporibus dignissimos amet at magnam, ex ipsa nostrum fuga illo eveniet dolorum exercitationem possimus debitis error consectetur reiciendis! Corporis consequatur porro ducimus doloremque amet eaque atque non maiores, ut quod! Veniam laboriosam quis voluptatem blanditiis dolores?"
});




//getting request for root page access:
app.get("/",function(req,res){
  // console.log(postArray);
  Post.find({},function(err,docList){
    if(docList.length===0){
        Post.insertMany([post1,post2],function(err){
          if(!err){
            console.log("Insertmany successfull");
          }
          res.redirect("/");
        });
    }
    else{
      res.render("home",{homeContent:homeStartingContent,postArray:docList,year:fullYear});
    }
  });
});

//getting request for contact page access:
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent,year:fullYear});
});

//getting request for about page access:
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent,year:fullYear});
});

//getting request for composing/creating new post and publish it on root page :
app.get("/compose",function(req,res){
  res.render("compose",{year:fullYear});
});

//getting request for featching  content templates dynamically using express router:
app.get("/post/:topic", function(req,res){
  const reqTopic=_.lowerCase(req.params.topic);
  let flag=true; /* popout 404 page if match content not found */
  Post.find({},function(err,docList){
    docList.forEach(element => {
      const resTopic=_.lowerCase(element.title);
      if(resTopic===reqTopic){
        res.render("post",{title:element.title,content:element.content,year:fullYear});
        flag=false;
      }
    });
    if(flag){
      res.render("post",{title:"404! NOT FOUND",content:"The page you are looking for might have been removed or the name has been changed or may be it is unavailable right now.",year:fullYear});
    }
  });
});

//getting request for publishing new post on root page from submited action:
app.post("/compose",function(req,res){
  const newPost= Post({
    title:req.body.title,
    content:req.body.content
  });
  newPost.save();
  res.redirect("/");
});

//poping out the conforming page when feedback/message submited:
app.get("/success",function(req,res){
  res.render("success",{userName:userData.userName, yourMessage:userData.message,year:fullYear});
});

//getting data from contact page submited action and sending to success page:
app.post("/contact",function(req,res){
  userData.userName=req.body.name;
  userData.message=req.body.message;
  res.redirect("/success");
});

//getting result content using search bar:
app.post("/search",function(req,res){
  const reqTopic=req.body.queryTxt;
  res.redirect("/post/:"+reqTopic);
})






// Listening the server from localhost port2000:
app.listen(2000, function() {
  console.log("Server started on port 2000");
});
