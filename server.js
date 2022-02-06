const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (whatId, whatPw, done) {
      console.log(whatId, whatPw);
      db.collection("login").findOne({ id: whatId }, function (err, result) {
        if (err) return done(err);

        if (!result)
          return done(null, false, { message: "Check your ID again" });
        if (whatPw == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, { message: "Wrong" });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.collection("login").findOne({ id: id }, function (err, result) {
    done(null, { result });
  });
});

let db;
MongoClient.connect(
  "mongodb+srv://rbduschdl:love022775!@cluster0.lwlgw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("todoapp");

    app.listen("8080", function () {
      console.log("listening on 8080");
    });
  }
);

function logined(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", logined, function (req, res) {
  console.log(req.user);
  let user = req.user;
  db.collection("post")
    .find({ writer: user.result.userName })
    .toArray(function (err, result) {
      console.log(result);
      res.render("home.ejs", { data: [result, user] });
    });
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/lists", function (req, res) {
  console.log(req.user);
  let user = req.user;
  db.collection("post")
    .find({ writer: user.result.userName })
    .toArray(function (err, result) {
      console.log(result);
      res.render("lists.ejs", { data: [result, user] });
    });
});

app.get("/write", logined, function (req, res) {
  let user = req.user;
  db.collection("post")
    .find({ writer: user.result.userName })
    .toArray(function (err, result) {
      res.render("write.ejs", { data: user });
    });
});

app.get("/detail/:id", function (req, res) {
  console.log(req.params.id);
  let id = parseInt(req.params.id);
  db.collection("post").findOne({ _id: id }, function (err, result) {
    console.log(result);
    res.render("detail.ejs", { data: result });
  });
});

app.get("/edit/:id", function (req, res) {
  let id = parseInt(req.params.id);
  db.collection("post").findOne({ _id: id }, function (err, result) {
    console.log(result);
    res.render("edit.ejs", { data: result });
  });
});

app.post("/add", function (req, res) {
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (err, result) {
      let allPosts = result.totalPost;

      db.collection("post").insertOne(
        {
          _id: allPosts + 1,
          title: req.body.title,
          date: req.body.date,
          detail: req.body.detail,
          writer: req.body.writer,
        },
        function (err, result) {
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (err, result) {
              console.log("changed");
            }
          );

          res.redirect("/");
        }
      );
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.post("/register", function (req, res) {
  db.collection("counter").findOne({ name: "유저" }, function (err, result) {
    console.log(result.to);
    let userCode = result.totalUser;
    db.collection("login").insertOne(
      {
        _id: userCode + 1,
        userName: req.body.userName,
        id: req.body.id,
        pw: req.body.pw,
      },
      function (err, result) {
        db.collection("counter").updateOne(
          { name: "유저" },
          { $inc: { totalUser: 1 } },
          function (err, result) {
            console.log("new Guy");
          }
        );
      }
    );
    res.redirect("/login");
  });
  console.log(req.body);
});

app.put("/edit", function (req, res) {
  db.collection("post").updateOne(
    { _id: parseInt(req.body.id) },
    {
      $set: {
        title: req.body.title,
        date: req.body.date,
        detail: req.body.detail,
      },
    },
    function (err, result) {
      console.log("EDITED");
    }
  );
  res.redirect("/");
});

app.delete("/delete", function (req, res) {
  console.log(req.body);
  let num = parseInt(req.body._id);
  db.collection("post").deleteOne({ _id: num }, function (err, result) {
    res.status(200).send({ message: "good" });
  });
});
