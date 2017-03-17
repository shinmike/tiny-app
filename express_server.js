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
};

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Debugging: log entire users database for every request:
// app.use((req, res, next) => {
//   console.log("users database:", users);
//   next();
// });

app.get("/", (req, res) => {
  res.redirect('/urls');
})

app.get("/urls", (req, res) => {
  let userId = req.cookies.userId;
  let templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userId = req.cookies.userId
  res.render("urls_new", {user: users[userId]});
});

app.get("/urls/:id", (req, res) => {
  let userId = req.cookies.userId
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params)
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
    // console.log("validateUniqueEmail: in the loop")
    // console.log("email:", email)
    // console.log("user:", user.email)
    if (user.email === email) {
      return false;
    }
  }
  return true;
}

app.post("/register", (req, res) => {
  // console.log("registration submitted");
  // console.log(req.body);

  // "I wish I had a function that could check an email and password and return true or false"
  // validateEmailAndPassword(email, password) => bool
  if (!validateEmailAndPassword(req.body.email, req.body.password)) {
    res.status(400).send("Invalid email and/or password");
    return;
  }
  // "I wish I had a function that could check an email for duplicate and return true or false"
  if (!validateUniqueEmail(req.body.email)) {
    res.status(400).send("This email has already been registered");
    return;
  }

  var userId = generateRandomString();

  var newUser = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  }

  users[userId] = newUser;

  console.log('userId: ', userId);
  res.cookie("userId", userId);
  res.redirect('/');
})

// POST /register endpoint adds new user object in global users object

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});