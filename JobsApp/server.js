const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const jobs = require("./routes/api/jobs");
const jobagreements = require("./routes/api/jobagreements");

const app = express();

//// use body parser middleware
app.use(
    bodyParser.urlencoded({extended: false})
);
app.use(bodyParser.json());

//// db config check
const db = require("./config/keys").mongoURI;
const pwd = require("./config/keys").mongoPwd;

//// connect to mongo db and check
mongoose
.connect(db, {pass : pwd, useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log("mongo db is connected successfully.."))
.catch(err => console.log(err));

//// use passport 
app.use(passport.initialize());

//// passport configurations
require("./config/passport")(passport);

//// map routes
app.use("/api/users", users);
//// map protected routes
app.use("/api/jobs", jobs);
app.use("/api/jobagreements", jobagreements);

const port = process.env.PORT || 5000;

//// listen
app.listen(port, () => console.log(`Server is up and running on port ${port} ..`));

