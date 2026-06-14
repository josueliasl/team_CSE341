const express = require('express');
const app = express();
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const port = process.env.PORT || 3002

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', require('./routes/index'));

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Running on port ${port}`);
        });

    }
});

//app.listen(port, () => {console.log(`Running on port ${port}`)});