const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateJobContract(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data._id = isEmpty(data._id) ? "" : data._id;
    data.jobBidContract = isEmpty(data.jobBidContract) ? "" : data.jobBidContract;

    //// perform validations
    if(Validator.isEmpty(data._id)){
        errors._id = "Job Id is required.";
    }

    if(Validator.isEmpty(data.jobBidContract)){
        errors.jobBidContract = "JobBidContract field is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};