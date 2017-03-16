var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");

// Configuration
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));

function generateRandomString() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log(text);
    return text;
}
generateRandomString();

//Methods for testing only

app.get("/sayHello", (req, res) => {
  console.log("we are in the sayHello Method");
  res.render("sayhello", {myname:"Rohit", myjob:"Architect"});
});

app.get("/sayToMe/:name", (req, res) => {
  console.log("we are in the sayToMe Method");
  console.log("the value of the params name is:"+req.params.name);
  res.render("sayhello", {myname:req.params.name, myjob:"Project Manager"});
});

app.get("/sayToMe/:name/:job", (req, res) => {
  console.log("we are in the sayToMe Method");
  console.log("the value of the params name is:"+req.params.name);
  res.render("sayhello", {myname:req.params.name, myjob:req.params.job});
});

app.post("/register", (req,res) =>{
  console.log("We are in the Register action with Post");
  console.log(req.body.myname);
  console.log(req.body.myjob);
  res.render("registeruser",{name:req.body.myname, job:req.body.myjob})
});


//Trying it by myself

app.get("/getnumbers", (req, res) => {
  console.log("we are in get numbers");
  res.render("getnumbers");
});

app.post("/sumnumbers", (req,res) => {
  console.log("we are summing two numbers");
  console.log("first number"+req.body.firstno);
  console.log("second number:"+req.body.secondno);

  var c = parseInt(req.body.firstno) + parseInt(req.body.secondno);
  console.log(c);
  res.render("sumnumbersshow",{total:c});
});
//


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});