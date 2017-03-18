var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');

// Configuration
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

function makeNewUser(email, password, id = generateRandomString()) {
  return {
    id,
    email,
    password
  }
}


function makeNewUrl(longUrl, user_id, shortUrl = generateRandomString()) {
  return {
    shortUrl,
    longUrl,
    user_id
  }
}

function storeUser(user) {
  const id = user.id;
  users[id] = user;
  return id;
}

function storeUrl(url) {
  const id = url.shortUrl;
  urlDatabase[id] = url;
  return id;
}

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function doesUrlBelongToUser(shortUrl, urlDatabase) {
  if (urlDatabase[shortUrl].user_id === req.cookies.userId) {
    return true;
  } return false;
}

var urlDatabase = {
  "b2xVn2": makeNewUrl("http://www.lighthouselabs.ca", "userRandomID", "b2xVn2"),
  "9sm5xK": makeNewUrl("http://www.google.com", "user2RandomID", "9sm5xK")
};

const users = {
  "userRandomID": makeNewUser("user@example.com", "purple-monkey-dinosaur", "userRandomID"),
  "user2RandomID": makeNewUser("user2@example.com", "dishwasher-funk", "user2RandomID")
};

function getUrlById(id) {
  return urlDatabase.find(function(x) { return x.id === id; });
}

app.get("/", (req, res) => {
  res.redirect('/login');
})

app.get("/urls", (req, res) => {
  let userId = req.cookies.userId;
  let templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };
  //console.log(templateVars.user.id);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userId = req.cookies.userId;
    if (users[userId]) {
    res.render("urls_new", {user: users[userId]})
  } else {
    res.redirect("/login")
  };
});

app.get("/urls/:id", (req, res) => {
  let userId = req.cookies.userId
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//---------------------------------------------------------------LOGIN

app.get("/login", (req, res) => {
  console.log("we are in login page");
  res.render("login_page");
})

app.post("/login", (req, res) => {
  let user;
  for (var userId in users) {
    if (users[userId].email === req.body.user) {
      user = users[userId]
    }
  }
  if (user && user.password === req.body.password) {
    //setting the cookie value to the user id if the email and password are ok.
    res.cookie("userId", user.id);
    console.log('Cookies: ', user.id);
    res.redirect("/urls")
  } else {
    res.status(403).send("Bad credentials");
  }
})

//---------------------------------------------------------------LOGOUT

app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/");
})

//---------------------------------------------------------------REGISTER

app.get("/register", (req, res) => {
  console.log("we are in registration page");
  res.render("registration_page");
})

function validateEmailAndPassword(email, password) {
  return (password.length > 0 && email.includes('@'));
}

function validateUniqueEmail(email) {
  for (var userId in users) {
    var user = users[userId]
    if (user.email === email) {
      return false;
    }
  }
  return true;
}

app.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!validateEmailAndPassword(email, password)) {
    res.status(400).send("Invalid email and/or password");
    return;
  }

  if (!validateUniqueEmail(email)) {
    res.status(400).send("This email has already been registered");
    return;
  }

  const user = makeNewUser(email, password);
  const id = storeUser(user);

  res.cookie("userId", id);
  res.redirect('/urls');

})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  var shortURL = storeUrl(makeNewUrl(longURL, req.cookies.userId));
  res.redirect("/urls/" + shortURL);
});

//update
app.post("/urls/:id", (req, res) => {

  const newURL = req.body.longURL;
  const shortURL = req.params.id;

  storeUrl(makeNewUrl(newURL, req.cookies.userId, shortURL));

  res.redirect("/urls");
});

//delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/data', (req, res) => {
  res.json({users, urlDatabase});
})