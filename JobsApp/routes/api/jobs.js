const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isEmpty = require("is-empty");
const passport = require("passport");
const dateFormat = require("dateformat");
const Validator = require("validator");

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
                //// validate if the user is the creator (authorization)
                if(!Validator.equals(job.postedBy, req.user.id)){
                    return res.status(401).json({ _id: "Unauthorized edit attempt."});
                }
                //// update the job details in db
                job.save()
                .then(job => {
                    var result = { _id: job._id, action: "updated" };
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
                });
            }
            else{
                return res.status(500).json({ _id: "Job with the given Id does not exist."});
            }
        }).catch(err => console.log(err));
    }
    //// create a new job here
    var newJob = new JobModel({
        _id : new mongoose.Types.ObjectId(),
        postedBy : req.user.id.toString() });
    //// assign other values
    assignJobValues(newJob, jobInput);
    //// save the job details to db
    newJob.save()
    .then(job => {
        var result = { _id: job._id, action: "created" };
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
    });

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
            .catch(err => {
                console.log(err);
                return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
            });
        }
        else{
            return res.status(500).json({ _id: "Job with the given Id does not exist."});
        }
    }).catch(err => console.log(err));
});

// @route POST api/jobs/get
// @desc Get Job
// @access Public
router.get("/get", passport.authenticate('jwt', {session: false}), (req, res)=>{
    var jobData = req.body;
    // perform form validation
    const errors = {};
    
    jobData._id = isEmpty(jobData._id)? "": jobData._id;
    if(Validator.isEmpty(jobData._id)){
        errors._id = "Job Id field is required.";
    }
    const isValid = isEmpty(errors);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }
    //// check if it is a existing & valid job
    JobModel.findOne({_id : jobData._id})
    .then(_job => {
        if(_job){
            res.json({ job: _job});
        }
        else{
            return res.status(500).json({ _id: "Job with the given Id does not exist."});
        }
    }).catch(err => console.log(err));
});

// @route POST api/jobs/browse
// @desc browse Jobs - input: {userId: xxxx, location: { city: xxxx, coordinates: {lon: xxx, lat: xxx} } }
// This method will return all jobs for now for Version-1.
// @access Public
router.get("/browse", passport.authenticate('jwt', {session: false}), (req, res)=>{
    var queryData = req.body;
    
    queryData.userId = isEmpty(queryData.userId)? "": queryData.userId;
    if(Validator.isEmpty(queryData.userId)){
        queryData.userId = req.user.id;
    }

    JobModel.find({})
    .then(_jobs => {
        if(_jobs){
            res.json({ jobs: _jobs});
        }
        else{
            res.json({ jobs:[] });
        }
    }).catch(err => console.log(err));
});

// @route POST api/jobs/get
// @desc Get Job
// @access Public
router.get("/bid", passport.authenticate('jwt', {session: false}), (req, res)=>{
    var bidData = req.body;
    // perform form validation
    const errors = {};
    
    bidData.userId = isEmpty(bidData.userId)? "": bidData.userId;
    if(Validator.isEmpty(bidData.userId)){
        errors.userId = "UserId field is required.";
    }
    bidData.jobId = isEmpty(bidData.jobId)? "": bidData.jobId;
    if(Validator.isEmpty(bidData.jobId)){
        errors.jobId = "JobId field is required.";
    }
    if(!Validator.equals(bidData.userId, req.user.id)){
        errors.userId = "Unauthorized bid.";
    }
    bidData.remarks = isEmpty(bidData.remarks)? "": bidData.remarks;
    
    const isValid = isEmpty(errors);

    // if validation failed, send back the errors to front end.
    if(!isValid){
        return res.status(400).json(errors);
    }
    //// check if it is a existing & valid job
    var jobId = bidData.jobId;
    JobModel.findOne({_id : jobId})
    .then(_job => {
        if(_job){
            var bids = _job.jobBids;
            if(bids){
                var bid;
                for(bid of bids){
                    if(bid.bidder == bidData.userId){
                        return res.status(500).json({ _id: "Cannot bid again. A bid has been already placed."});
                    }
                }
                _job.jobBids.push({ bidder: bidData.userId, remarks: bidData.remarks });
                _job.jobBidsCount += 1;
            }
            else {
                _job.jobBids = [{ bidder: bidData.userId, remarks: bidData.remarks }];
                _job.jobBidsCount = 1;
            }
            /// save changes
            _job.save()
            .then(job => {
                var result = { _id: job._id, bidder: bidData.userId, bidCount:job.jobBidsCount, action: "updated" };
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({save: "Error occurred. Could not save for unknown reasons."});
            });
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
        pingOutput: Date.now().toString(),
        user: req.user.id
    });

});

module.exports = router;