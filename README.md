# todoApp

# Today's lessons.

## 1. How to make server in Node.js

- write npm install express in your terminal( ` + ctrl)
- make a new js file name server.js and write this on the top of file.
  <br> const express = require("express");
  <br> const app = express();
- and write app.listen to connect to port you want.
  <br> ex)
  <br> app.listen("8080", function () {
  <br> console.log("listening on 8080");
  <br> });
- write node server.js in your terminal.
- open any browser and go to localhost:8080
- if the page says cannot get / you are ready to start.

  2022.01.15

## 2. How to send delete request to server from HTML.

- first you need jquery cdn or jqeury script file.
- write the ajax method between script tag.
  <br> ex)
  <br> < script >
  <br> $.ajax({
  <br> method: "DELET",
  <br> url: '/delete',
  <br> data; { \_id: e.target.dataset.id}  
  <br> }).done(function() {
  <br> $( this ).addClass( "done" );
  <br> });
  <br> < script >
- for data write down what you want to send to server with ajax request.
- for url write down the path that this request will run.
- for method choose the kind of request you want to send.

  2022.01.16

## 3. How to make Login function.

- npm install passport passport-local express-session
- const passport = require('passport');
  <br> const LocalStrategy = require('passport-local').Strategy;
  <br> const session = require('express-session');
  <br> app.use(session({secret : 'secretCode', resave : true, saveUninitialized: false}));
  <br> app.use(passport.initialize());
  <br> app.use(passport.session());
- app.get('/login', function(req, res){
  <br> req.render('login.ejs')
  <br>});

  2022.01.30

