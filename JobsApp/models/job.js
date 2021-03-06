const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create Job Schema
const jobSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId() 
    },
    description:{
        type: String,
        required: true,
        validate: {
            validator: function(text){
                return !(text===null || text==="null" || text.length < 10 || text.length > 100);
            },
            message: "Invalid Job Description. Should be non-empty and Should not exceed 100 characters. Should be of minimum 10 characters."
        }
    },
    summary: {
        type: String,
        required: true,
        validate: {
            validator: function(text){
                return !(text===null || text==="null" || text.length < 10 || text.length > 500);
            },
            message: "Invalid Job Summary. Should be non-empty and Should not exceed 500 characters. Should be of minimum 10 characters."
        }
    },
    jobType:{
        type: String,
        required: true,
        validate: {
            validator: function(text){
                return ((text == "full_time") || (text == "part_time") || (text == "consulting") || (text == "services"));
            },
            message: "Invalid Job Type. Should be either full_time or part_time or consulting."
        }
    },
    jobSubType:{
        type: String,
        required: false
    },
    workCategory: {
        type: String,
        required: true
    },
    isRemote : {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    postedOn : {
        type: Date,
        required: true
    },
    expiresOn : {
        type: Date, 
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate : {
        type: Date
    },
    startDateNumber: {
        type: Number //yyyyMMdd
    },
    endDateNumber: {
        type: Number //yyyyMMdd
    },
    skillsRequired: [
        { type: String }
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    jobBidContract: {
        type: String, // blockchain smart contract account
    },
    postingStatus:{
        type: String,
        required: true,
        validate: {
            validator: function(text){
                return ((text == "new") || (text == "processing") || (text == "filled") || (text == "closed")|| (text == "expired"));
            },
            message: "posting status should be new / processing / filled / closed / expired."
        }
    },
    jobBids : [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        remarks: {
            type: String
        }
    }],
    jobBidsCount :{
        type: Number
    },
    location: {
        name: {
            type: String
        },
        zipcode: { 
            type: String
        },
        coordinates:{
            lon: {
                type: String
            },
            lat: {
                type: String
            }
        }
    },
    estimatedTime:{
        value: {
            type: Number
        },
        unit: {
            type: String
        } // Hours / Days / Months.
    },
    estimatedValue:{
        value: { 
            type: Number 
        },
        currency: {
            type: String
        } // Currency
    },
    insuranceIncluded: {
        type:Boolean,
        default: false
    },
    insurance: {
        value:{
            type: Number
        },
        premium:{
            type: Number
        },
        insuranceType:
        {
            type: String // medical/health, life
        }
    },
    advancePayment : {
        value: {
            type: Number
        },
        unit : {
            type: String // Absolute / Percentage
        }
    },
    billingMode : {
        type: String // fixed, hourly, monthly, daily
    }
});

var Job = mongoose.model("jobs", jobSchema);

module.exports = Job;