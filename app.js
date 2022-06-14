

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");

const homeStartingContent="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
const contactContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var postArray=[
  
];
var date=new Date();
var fullYear=date.getFullYear();

var userData={
  userName:"",
  message:""
};


app.get("/",function(req,res){
  // console.log(postArray);
  res.render("home",{homeContent:homeStartingContent,postArray:postArray,year:fullYear});
});
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent,year:fullYear});
});
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent,year:fullYear});
});
app.get("/compose",function(req,res){
  res.render("compose",{year:fullYear});
});
app.get("/post/:topic", function(req,res){
  // res.send(req.params.topic);
  postArray.forEach(function(e){
    const postE=_.lowerCase(e.title);
    const reqE=_.lowerCase(req.params.topic);
    if(postE===reqE){
      // console.log("Match");
      res.render("post",{title:e.title,content:e.content,year:fullYear});
    }
  }); 
});

app.post("/compose",function(req,res){
  let newPost={
     title:req.body.title,
     content:req.body.content
  };
  postArray.push(newPost);
  res.redirect("/");
});


app.get("/success",function(req,res){
  res.render("success",{userName:userData.userName, yourMessage:userData.message,year:fullYear});
})
app.post("/contact",function(req,res){
  userData.userName=req.body.name;
  userData.message=req.body.message;
  res.redirect("/success");
})









app.listen(2000, function() {
  console.log("Server started on port 2000");
});
