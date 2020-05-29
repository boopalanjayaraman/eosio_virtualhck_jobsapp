const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isEmpty = require("is-empty");
const passport = require("passport"); 
const dateFormat = require("dateformat");

//// load validations
const validateJobAgreementInput = require("../../validation/jobAgreementValidation");
//// load models
const JobAgreementModel = require("../../models/jobagreement");

// @route POST api/jobagreements/save
// @desc Save Job Agreement
// @access Public
router.post("/save", passport.authenticate('jwt', {session: false}), (req, res)=>{
    // perform form validation
    const { errors, isValid } = validateJobAgreementInput(req.body);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }

    var jobAgreementInput = req.body;
    var existingJobAgreement = !isEmpty(jobAgreementInput._id);
    if(existingJobAgreement){
        JobAgreementModel.findOne({_id: jobAgreementInput._id})
        .then(jobAgreement => {
            if(jobAgreement){
                assignJobValues(jobAgreement, jobAgreementInput);
                //// update the job agreement details in db
                jobAgreement.save()
                .then(jobAgreement => {
                    var result = { _id: jobAgreement._id, action: "updated" };
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
                });
            }
            else{
                return res.status(500).json({ _id: "Job Agreement with the given Id does not exist."});
            }
        }).catch(err => console.log(err));
    }
    //// create a new job agreement here
    var newJobAgreement = new JobModel({
        _id : new mongoose.Types.ObjectId()});
    assignJobValues(newJobAgreement, jobAgreementInput);
    //// save the job agreement details to db
    newJobAgreement.save()
    .then(jobAgreement => {
        var result = { _id: jobAgreement._id, action: "created" };
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
    });
});



//// function to assign job values from input
var assignJobAgreementValues = function(jobAgreement, jobAgreementInput){

    jobAgreement.poster = jobAgreementInput.poster;
    jobAgreement.winBidder= jobAgreementInput.winBidder;
    jobAgreement.jobInfo= jobAgreementInput.jobInfo;
    jobAgreement.startDate= jobAgreementInput.startDate;
    jobAgreement.endDate= jobAgreementInput.endDate;
    jobAgreement.jobContractAccount= jobAgreementInput.jobContractAccount;
    jobAgreement.insuranceProvided= jobAgreementInput.insuranceProvided;
    jobAgreement.insuranceContractAccount= jobAgreementInput.insuranceContractAccount;
    jobAgreement.startDateNumber= isEmpty(jobAgreementInput.startDate)? "" : dateFormat(jobAgreementInput.startDate,"yyyymmdd");
    jobAgreement.endDateNumber= isEmpty(jobAgreementInput.endDate)? "" : dateFormat(jobAgreementInput.endDate,"yyyymmdd");
    
    return jobAgreement;
};

// @route POST api/jobagreements/get
// @desc get Job Agreement
// @access Public
router.post("/get", passport.authenticate('jwt', {session: false}), (req, res)=>{
    var jobAgreementData = req.query;
    // perform form validation
    const errors = {};
    
    jobAgreementData._id = isEmpty(jobAgreementData._id)? "": jobAgreementData._id;
    if(Validator.isEmpty(jobAgreementData._id)){
        errors._id = "Job Agreement Id field is required.";
    }
    const isValid = isEmpty(errors);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }

    JobAgreementModel.findOne({_id: jobAgreementInput._id})
    .then(_jobAgreement => {
        if(_jobAgreement){
            res.json({ jobAgreement: _jobAgreement});
        }
        else{
            return res.status(500).json({ _id: "Job Agreement with the given Id does not exist."});
        }
    }).catch(err => console.log(err));
});

// @route GET api/jobagreements/ping
// @desc User Ping Api
// @access Public
router.get("/ping", passport.authenticate('jwt', {session: false}), (req, res) => {

    res.json({
        success: true,
        pingOutput: Date.now().toString()
    });

});

module.exports = router;