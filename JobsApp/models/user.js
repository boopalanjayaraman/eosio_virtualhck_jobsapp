const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// create user schema
const userSchema = new Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: new mongoose.Types.ObjectId() 
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pwdsalt:{
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    publickey: {
        type: String,
        default: ''
    },
    isActive: {
      type: Boolean,
      default: true  
    },
    userType: {
        type: String // individual / organization
    },
    personalAttributes: {
        title: {
            type: String
        },
        address: {
            type: String
        },
        zipcode: {
            type: String
        },
        identityNumber:{
            type: String // Social Security Number / Aadhar
        }
    },
    organizationAttributes : { // as a poster
        name: {
            type: String
        },
        orgId: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    jobAttributes: {
        selectedLocation : {
            name: {
                type: String
            },
            zipcode: {
                type: String
            },
            coordinates: {
                lat: String,
                lon: String
            }
        },
        isOnJob : { 
            type: Boolean,
            default: false
        },
        isOnPartTimeJob : {
            type: Boolean,
            default: false
        },
        currentJobs: [{
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Jobs'
            }
        }],
        currentPartTimeJobs: [{
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Jobs'
            }
        }],
        rating : {
            type: Number
        },
        skills : [
            {
                skill: { type: String },
                experienceMonths: { type: Number },
                expertiseLevel: { type: String },
                finishedJobs : { type: Number }
            }
        ],
        billingRate :{
            type: Number
        }
    },
    posterAttributes : {
        rating : {
            type: Number
        },
        paymentVerified : {
            type: Boolean,
            default: false
        },
        offeredInsurance : {
            type: Boolean
        }
    },
    bankAccountDetails:{
        accountNumber : {
            type: String
        },
        code :{
            type: String //ifsc code, routing number, swift code
        },
        accountName: {
            type: String
        }
    } 
    });

var User = mongoose.model("users", userSchema);

module.exports = User;