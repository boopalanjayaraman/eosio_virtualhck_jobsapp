const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.username = isEmpty(data.username) ? "" : data.username;
    data.loginId = isEmpty(data.loginId) ? "" : data.loginId;
    data.password = isEmpty(data.password) ? "" : data.password;
    data.password2 = isEmpty(data.password2) ? "" : data.password2;

    //// perform validations
    if(Validator.isEmpty(data.username)){
        errors.username = "UserName field is required.";
    }

    if(Validator.isEmpty(data.loginId)){
        errors.loginId = "LoginId (Email) field is required.";
    }
    else if(!Validator.isEmail(data.loginId)){
        errors.loginId = "Invalid LoginId (Email) value.";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required.";
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password field is required.";
    }

    if(!Validator.isLength(data.password, {min:8, max:20})){
        errors.password = "Password must contain at least 8 characters, and should be less than 20 characters.";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};