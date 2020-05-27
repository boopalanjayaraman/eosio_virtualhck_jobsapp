const mongoose = require("mongoose");
const Schema = mongoose.Schema;

////create job agreement schema
var jobAgreementSchema = new Schema({
    _id : {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId() 
    },
    poster :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    winBidder :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    jobInfo :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs"
    },
    isActive: {
        type:Boolean,
        default:true
    },
    startDate:{
        type: Date
    },
    endDate:{
        type:Date
    },
    startDateNumber: {
        type: Number //yyyyMMdd
    },
    endDateNumber: {
        type: Number //yyyyMMdd
    },
    jobContractAccount:{
        type:String // blockchain smart contract account
    },
    insuranceProvided:{
        type: Boolean
    },
    insuranceContractAccount:{
        type: String // blockchain insurance contract account
    },
    insuranceClaimInitiated: {
        type: Boolean
    },
    paymentMade : {
        value: { 
            type: Number
        }
    },
    progress :{
        value: {
            type: Number
        },
        unit :{
            type: String // hours / days
        }
    },
    isOnHold :{
        type: Boolean
    },
    putOnHoldBy :{
        type: String // Poster / WinBidder
    },
    onHoldReason: {
        category: {
            type: String
        },
        reason: {
            type: String
        }
    },
});

var JobAgreement = mongoose.model("jobAgreements", jobAgreementSchema);
module.exports = JobAgreement;