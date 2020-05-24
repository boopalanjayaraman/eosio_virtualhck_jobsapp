const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const mongoose = require("mongoose");

//// load validations
const validateRegisterInput = require("../../validation/registerValidation");
const validateLoginInput = require("../../validation/loginValidation");
//// load models
const UserModel = require("../../models/user");

// @route POST api/users/register
// @desc Register User
// @access Public
router.post("/register", (req, res)=>{
    // perform form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }

    UserModel.findOne({email: req.body.loginId})
    .then(user => {
        if(user){
            return res.status(500).json({ loginId: "loginId (email) already exists."});
        }
        else{
            console.log('creating a new user');
            var freshUser = new UserModel({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.username,
                email: req.body.loginId,
                password: req.body.password,
                userType: req.body.userType
            });
            //// add salt & hash password before saving.
            bcrypt.genSalt(12, (err, salt) => {
                freshUser.pwdsalt = salt;
                // perform the hash operation
                bcrypt.hash(freshUser.password, salt, (err, hash) => {
                    if(err){
                        throw err;
                    }
                    freshUser.password = hash;
                    // save the user into db
                    freshUser.save()
                    .then(user => {
                        var result = { _id: user._id, loginId: user.email, name: user.name };
                        res.json(result);
                    })
                    .catch(err => console.log(err));
               }); //hash closure
            }); //gensalt closure
        }
    }).catch(err => console.log(err));

});

// @route POST api/users/login
// @desc Login User
// @access Public
router.post("/login", (req, res) => {
    // do validation of form fields
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const loginId = req.body.loginId;
    const password = req.body.password;

    UserModel.findOne({email: loginId})
    .then(user => {
        if(!user){
            return res.status(500).json({error: "Authentication Failed. Invalid Credentials."});
        }

        //// verify the password
        bcrypt.compare(password, user.password)
        .then(matched => {
            if(matched){
                //// create the payload
                const payload = {
                    id: user._id,
                    name: user.name,
                    loginId: user.email
                };

                console.log('Login success. Creating token. Logging in user: ' + user.name.toString());
                //// sign the token
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 259200 }, (err, token)=> {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            }
            else{
                return res.status(500).json({error: "Authentication Failed. Invalid Credentials."});
            }
        });
    })
    .catch(err => console.log(err));

});

module.exports = router;