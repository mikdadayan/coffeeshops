const path = require('path');

const express = require("express");
// const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const mongodb = require('mongodb')

const User = require('./models/user');
const errorController = require('./controllers/error');


const app = express(); 

const MONGODB_URI = 
    'mongodb+srv://miqo-1:hovomiqo1@cluster1-5cqle.mongodb.net/coffeShop?retryWrites=true&w=majority';

const storeSession = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})


// //CONFIG APP
app.set('views', 'views');
app.set("view engine", "ejs");

const shopRoutes = require('./routes/coffeeshop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: ' My secret meessege for',
  resave: false,
  saveUninitialized: false,
  store: storeSession
}))


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  console.log(req.session.user)
  if(req.session.user){
    res.locals.email = req.session.user.email
  } 
  next();
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

mongoose
.connect(
  MONGODB_URI,
  { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
  })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });