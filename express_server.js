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

// GET /
// app.get('/', (req, res) => {
//   res.redirect('http://www.example.com/')
// });

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  // console.log("the value of req.params.id: " + req.params.id)
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log("the value of req.body.longURL: " + req.body.longURL);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/" + shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params)
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/random", (req, res) => {
  res.send(generateRandomString());
})

//delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

//update
app.post("/urls/:id", (req, res) => {
  debugger;
  const newURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});