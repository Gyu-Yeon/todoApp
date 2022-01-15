const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
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
  res.render("detail.ejs");
});

app.get("/edit", function (req, res) {
  res.render("edit.ejs");
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

          res.redirect("/write");
        }
      );
    }
  );
});

app.delete("/delete", function (req, res) {
  console.log(req.body);
  let num = parseInt(req.body._id);
  db.collection("post").deleteOne({ _id: num }, function (err, result) {
    if (err) {
      return err;
    } else console.log("good");
  });
});
