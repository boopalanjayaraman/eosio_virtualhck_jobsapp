const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobAgreementInput(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.poster = isEmpty(data.poster) ? "" : data.poster;
    data.winBidder = isEmpty(data.winBidder) ? "" : data.winBidder;
    data.jobInfo = isEmpty(data.jobInfo) ? "" : data.jobInfo;
    data.startDate = isEmpty(data.startDate) ? "" : data.startDate;
    data.endDate =  isEmpty(data.endDate) ? "" : data.endDate;
    data.jobContractAccount =  isEmpty(data.jobContractAccount) ? "" : data.jobContractAccount;
    data.insuranceProvided =  isEmpty(data.insuranceProvided) ? "" : data.insuranceProvided;
    data.insuranceContractAccount =  isEmpty(data.insuranceContractAccount) ? "" : data.insuranceContractAccount;

    //// perform validations
    if(Validator.isEmpty(data.poster)){
        errors.poster = "Poster field is required.";
    }

    if(Validator.isEmpty(data.winBidder)){
        errors.winBidder = "WinBidder field is required.";
    }

    if(Validator.isEmpty(data.jobInfo)){
        errors.jobInfo = "JobInfo field is required.";
    }

    if(Validator.isEmpty(data.startDate)){
        errors.startDate = "Start Date field is required.";
    }

    if(Validator.isEmpty(data.jobContractAccount)){
        errors.jobContractAccount = "JobContractAccount field is required.";
    }

    if(Validator.isEmpty(data.insuranceProvided)){
        errors.insuranceProvided = "InsuranceProvided field is required.";
    }

    if(Validator.isEmpty(data.insuranceContractAccount)){
        errors.insuranceContractAccount = "InsuranceContractAccount field is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};