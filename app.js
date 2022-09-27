//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express()
const port = 3000

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/userDB';
mongoose.connect(mongoDB, { useNewUrlParser: true });
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets");
        }
    });

});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
    
        User.findOne({email: username}, function (err, foundUser) {
            if (err) {
                console.log(err)
            } else {
                if(foundUser && foundUser.password == password){
                    res.render("secrets");
                }
            }
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})