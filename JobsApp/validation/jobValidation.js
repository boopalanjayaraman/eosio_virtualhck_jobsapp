const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobInput(data){

    //// initialize errors object
    let errors = {};

    //// convert empty fields into empty string values
    data.description = isEmpty(data.description) ? "" : data.description;
    data.summary = isEmpty(data.summary) ? "" : data.summary;
    data.jobType = isEmpty(data.jobType) ? "" : data.jobType;
    data.workCategory = isEmpty(data.workCategory) ? "" : data.workCategory;
    data.postedOn =  isEmpty(data.postedOn) ? "" : data.postedOn;
    data.expiresOn =  isEmpty(data.expiresOn) ? "" : data.expiresOn;
    data.startDate =  isEmpty(data.startDate) ? "" : data.startDate;
    data.postingStatus =  isEmpty(data.postingStatus) ? "" : data.postingStatus;

    //// perform validations
    if(Validator.isEmpty(data.description)){
        errors.description = "Description field is required.";
    }

    if(Validator.isEmpty(data.summary)){
        errors.summary = "Summary field is required.";
    }

    if(Validator.isEmpty(data.jobType)){
        errors.jobType = "Job Type field is required.";
    }

    if(Validator.isEmpty(data.workCategory)){
        errors.workCategory = "Work Category field is required.";
    }

    if(Validator.isEmpty(data.postedOn)){
        errors.postedOn = "Posted On field is required.";
    }

    if(Validator.isEmpty(data.expiresOn)){
        errors.expiresOn = "Expires On field is required.";
    }

    if(Validator.isEmpty(data.startDate)){
        errors.startDate = "Start Date field is required.";
    }

    if(!data.skillsRequired){
        errors.skillsRequired = "Skills Required field is required.";
    }

    if(!data.estimatedTime || !data.estimatedTime.value){
        if(!data.estimatedValue || !data.estimatedValue.value){
            errors.estimatedTime = "Either estimated time / estimated value is required.";
            errors.estimatedValue = "Either estimated time / estimated value is required.";
        }
    }

    if(!data.location || !data.location.name){
        errors.location = "Location field is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};