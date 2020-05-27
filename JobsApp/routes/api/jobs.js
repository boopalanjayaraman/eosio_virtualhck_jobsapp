const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isEmpty = require("is-empty");
const passport = require("passport");
const dateFormat = require("dateformat");

//// load validations
const validateJobInput = require("../../validation/jobValidation");
const validateUpdateJobContract = require("../../validation/updateJobContractValidation");
//// load models
const JobModel = require("../../models/job");

// @route POST api/jobs/save
// @desc Save Job
// @access Public
router.post("/save", passport.authenticate('jwt', {session: false}), (req, res)=>{
    // perform form validation
    const { errors, isValid } = validateJobInput(req.body);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }

    var jobInput = req.body;
    var existingJob = !isEmpty(jobInput._id);
    if(existingJob){
        JobModel.findOne({_id : jobInput._id})
        .then(job => {
            if(job){
                assignJobValues(job, jobInput);
                //// update the job details in db
                job.save()
                .then(job => {
                    var result = { _id: job._id, action: "updated" };
                    res.json(result);
                })
                .catch(err => console.log(err));
            }
            else{
                return res.status(500).json({ _id: "Job with the given Id does not exist."});
            }
        }).catch(err => console.log(err));
    }
    //// create a new job here
    var newJob = new JobModel({
        _id : new mongoose.Types.ObjectId()});
    assignJobValues(newJob, jobInput);
    //// save the job details to db
    newJob.save()
    .then(job => {
        var result = { _id: job._id, action: "created" };
        res.json(result);
    })
    .catch(err => console.log(err));

});

//// function to assign job values from input
var assignJobValues = function(job, jobInput){

    job.description = jobInput.description;
    job.summary= jobInput.summary;
    job.jobType= jobInput.jobType;
    job.jobSubType= jobInput.jobSubType;
    job.workCategory= jobInput.workCategory;
    job.isRemote= jobInput.isRemote;
    job.postedOn= jobInput.postedOn;
    job.expiresOn= jobInput.expiresOn;
    job.startDate= jobInput.startDate;
    job.endDate= jobInput.endDate;
    job.startDateNumber= isEmpty(jobInput.startDate)? "" : dateFormat(jobInput.startDate,"yyyymmdd");
    job.endDateNumber= isEmpty(jobInput.endDate)? "" : dateFormat(jobInput.endDate,"yyyymmdd");
    job.skillsRequired= jobInput.skillsRequired;
    job.postedBy= jobInput.postedBy;
    job.postingStatus= jobInput.postingStatus;
    job.location= jobInput.location;
    job.estimatedTime= jobInput.estimatedTime;
    job.estimatedValue= jobInput.estimatedValue;
    job.insurance= jobInput.insurance;
    job.advancePayment= jobInput.advancePayment;
    
    return job;
};



// @route POST api/jobs/save
// @desc Save Job
// @access Public
router.post("/updateContract", passport.authenticate('jwt', {session: false}), (req, res)=>{
    var contractInput = req.body;
    // perform form validation
    const { errors, isValid } = validateUpdateJobContract(req.body);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }
    //// check if it is a existing & valid job
    JobModel.findOne({_id : contractInput._id})
    .then(job => {
        if(job){
            job.jobBidContract = contractInput.jobBidContract;
            //// update the job details in db
            job.save()
            .then(job => {
                var result = { _id: job._id, action: "updated" };
                res.json(result);
            })
            .catch(err => console.log(err));
        }
        else{
            return res.status(500).json({ _id: "Job with the given Id does not exist."});
        }
    }).catch(err => console.log(err));
});


// @route GET api/jobs/ping
// @desc User Ping Api
// @access Public
router.get("/ping", passport.authenticate('jwt', {session: false}), (req, res) => {

    res.json({
        success: true,
        pingOutput: Date.now().toString()
    });

});

module.exports = router;