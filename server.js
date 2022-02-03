const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

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

app.get("/", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (err, result) {
      res.render("home.ejs", { data: result });
    });
});

app.get("/lists", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (err, result) {
      res.render("lists.ejs", { data: result });
    });
});

app.get("/write", function (req, res) {
  res.render("write.ejs");
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
