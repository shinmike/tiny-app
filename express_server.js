var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");

// Configuration
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

function generateRandomString() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log(text);
    return text;
}
generateRandomString();

// app.get('/', (req, res) => {
//   res.redirect('http://www.example.com/')
// });

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.redirect('/urls');
})

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies["username"]});
});

app.get("/urls/:id", (req, res) => {
  // console.log("the value of req.params.id: " + req.params.id)
  // if(req.cookies.username === undefined) {
  //   return res.status(401).send('You are not logged in.');
  // }
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params)
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  console.log("we are in registration page");
  res.render("registration_page");
})

app.post("/urls", (req, res) => {
  // console.log("the value of req.body.longURL: " + req.body.longURL);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/" + shortURL);
});

//update
app.post("/urls/:id", (req, res) => {
  debugger;
  const newURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

//delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

//cookie
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  console.log('Cookies: ', req.body.username);
  res.redirect("/urls")
})

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});