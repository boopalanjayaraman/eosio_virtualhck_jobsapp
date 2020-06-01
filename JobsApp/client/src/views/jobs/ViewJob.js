import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getJobToViewAction  } from "../../actions/jobActions";
import classnames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import dateFormat from 'dateformat'
import { DatePicker } from "react-materialize";
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

import locationProvider from "../../dataproviders/locationProvider";
import skillsProvider from "../../dataproviders/skillsProvider";
import axios from 'axios';


const useStyles = (theme) => ({
    formControl: {
            margin: theme.spacing(0),
            minWidth: 120,
            width: "100%"
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        }
  });
  
const format = "dd-mmm-yyyy";


class ViewJob extends Component{
    //// constructor
    constructor(){
        super();

        this.skills = skillsProvider();
        this.locations = locationProvider();

        this.timeUnits = [
            'hours',
            'days',
            'months'
        ];

        this.currencies = [
            'USD',
            'INR'
        ];

        this.insuranceTypes = ['Health', 'Medical', 'Life', 'Personal Accident'];

        

        var now = new Date();
        this.state = {
            job: {
                description: "",
                summary: "",
                jobType: "full_time",
                jobSubType: "", //
                workCategory: "",
                isRemote: false,
                expiresOn: dateFormat(now, format),
                startDate: dateFormat(now, format),
                endDate: dateFormat(now, format),
                skillsRequired: [],
                postedBy: "",
                postedOn: dateFormat(now, format),
                postingStatus: "new", 
                location: { name: "" },
                estimatedTime: { value: "", unit: "hours"},
                estimatedValue: {value: "", currency: "USD"},
                insuranceIncluded: false,
                insurance: {value: "", premium: "", insuranceType: "Health"},
                advancePayment: { value: "", unit: ""},
                billingMode: "",
            },
            errors:{
            }
        };
        
    }

    componentDidMount() { 
        var currentJob =this.props.jobR.viewJob;

        ////this.props.getJobToViewAction(currentJob, this.props.history);
        
        //// fetch the data
        axios
        .get("/api/jobs/get", { params:{ _id: '5ed0718a56be143118455626'} }) //currentJob._id //'5ed06d456419ba61a48a9150'
        .then(res => {
            var _job = res.data.job;
            
            _job.expiresOn = dateFormat(_job.expiresOn, format);
            _job.startDate = dateFormat(_job.startDate, format);
            _job.endDate = dateFormat(_job.endDate, format);

            this.setState({
                job: _job
            }) ;
        })  
        .catch(err => {
            throw err;
        });
         
    }

    componentWillReceiveProps(nextProps) {
        
    }

    //define onSubmit handler
    onSubmit = e => {
        e.preventDefault();
    };

    //// implement render 
    render(){
        const { classes } = this.props;

        

        return(
            <div className="container">
            <div className="row">
            <div className="col s8 offset-s2">
                <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                    <b>Job details</b> below
                </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div class="row">
                    <div className="col s12">
                        <label htmlFor="description">Description / Title</label>
                        <input
                        value={this.state.job.description}
                        type="text"
                        id="description"
                        disabled={true}
                        />
                    </div>
                </div>
                <div class="row">
                    <div className="col s12">
                        <label htmlFor="summary">Summary</label>
                        <textarea
                        value={this.state.job.summary}
                        id="summary"
                        type="text"
                        class="materialize-textarea"
                        style={{overflow:"auto"}}
                        rows = "5"
                        cols = "40"
                        disabled={true}
                        ></textarea>
                    </div>
                </div>
                <div class="row">
                    <div className="input-field col s12">
                    <FormControl className={classes.formControl} disabled={true}  >
                            <InputLabel htmlFor="jobType">Job Type</InputLabel>
                            <Select
                                id="jobType"
                                value={ this.state.job.jobType}
                                className={classnames("input-field col s12", {})}
                                >
                                    <MenuItem value="full_time">Full Time</MenuItem>
                                    <MenuItem value="part_time">Part Time</MenuItem>
                                    <MenuItem value="consulting">Consulting</MenuItem>
                            </Select>
                    </FormControl>
                    </div>
                </div>
                <div class="row">
                        <div className="input-field col s12">
                        <FormControl className={classes.formControl} disabled={true} >
                        <InputLabel htmlFor="workCategory">Work Category</InputLabel>
                            <Select
                                id="workCategory"
                                value={ this.state.job.workCategory}
                                className={classnames("input-field col s12", {})}
                                >
                                    <MenuItem value="construction">Construction</MenuItem>
                                    <MenuItem value="construction_labour">Construction - Labour</MenuItem>
                                    <MenuItem value="construction_masonry">Construction - Masonry</MenuItem>
                                    <MenuItem value="construction_plumbing">Construction - Plumbing</MenuItem>
                                    <MenuItem value="construction_sanitary">Construction - Sanitary Engineering</MenuItem>
                                    <MenuItem value="construction_painting">Construction - Painting</MenuItem>
                                    <MenuItem value="carpentry">Carpentry</MenuItem>
                                    <MenuItem value="electrician">Electrician</MenuItem>
                                    <MenuItem value="gardening">Gardening</MenuItem>
                                    <MenuItem value="housekeeping">Housekeeping</MenuItem>
                                    <MenuItem value="agriculture">Agriculture</MenuItem>
                                    <MenuItem value="maintenance">Maintenance</MenuItem>
                                    <MenuItem value="maintenance_hardware">Maintenance - Hardware</MenuItem>
                                    <MenuItem value="maintenance_appliances">Maintenance - Appliances</MenuItem>
                                    <MenuItem value="cooking">Cooking</MenuItem>
                                    <MenuItem value="teaching">Teaching</MenuItem>
                                    <MenuItem value="driving">Driving</MenuItem>
                                    <MenuItem value="driving_commercial">Driving - Commercial</MenuItem>
                                    <MenuItem value="petcare">Pet Care</MenuItem>
                                    <MenuItem value="babysitting">Babysitting</MenuItem>
                                    <MenuItem value="sports_coaching">Sports Coaching</MenuItem>
                                    <MenuItem value="catering">Catering</MenuItem>
                                    <MenuItem value="administration">Administration</MenuItem>
                                    <MenuItem value="administration_assistant">Administration - Assistant</MenuItem>
                                    <MenuItem value="administration_receptionist">Administration - Receptionist</MenuItem>
                                    <MenuItem value="administration_cashier">Administration - Cashier</MenuItem>
                                    <MenuItem value="administration_accountant">Administration - Accountant</MenuItem>
                                    <MenuItem value="hospitality_maintenance">Hospitality - Maintenance</MenuItem>
                                    <MenuItem value="hospitality_foodservice">Hospitality - Food Service</MenuItem>
                                    <MenuItem value="hospitality_management">Hospitality - Management</MenuItem>
                                    <MenuItem value="transport">Transport</MenuItem>
                                    <MenuItem value="automobile_mechanic">Automobile Mechanic</MenuItem>
                                    <MenuItem value="computer_operator">Computer Operator</MenuItem>
                                    <MenuItem value="home_health_aide">Home Health Aide</MenuItem>
                                    <MenuItem value="gardening_and_landscaping">Gardening and Landscaping</MenuItem>
                                    <MenuItem value="machine_operator">Machine Operator</MenuItem>
                                    <MenuItem value="welder">Welder</MenuItem>
                                    <MenuItem value="content_writer">Content Writer</MenuItem>
                                    <MenuItem value="others">Others</MenuItem>
                            </Select>
                            </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.job.isRemote}
                                    name="isRemote"
                                    color="primary"
                                    disabled = {true}
                                />
                                }
                                label="Is a remote job?"
                            />
                        </div>
                        <div className="input-field col s6">
                            <DatePicker
                                label="Posting Expires on"
                                value={this.state.job.expiresOn}
                                id="expiresOn"
                                disabled = {true}
                                format = "dd-MMM-yyyy" />
                                
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                        <DatePicker
                                label="Job starts on"
                                value={this.state.job.startDate}
                                id="startDate"
                                disabled = {true}
                                format = "dd-MMM-yyyy" />
                        </div>
                        <div className="input-field col s6">
                            <DatePicker
                                label="Job ends on"
                                value={this.state.job.endDate}
                                id="endDate"
                                disabled = {true}
                                format = "dd-MMM-yyyy" />
                        </div>
                </div>
                <div class="row">
                    <div className="input-field col s12">
                    <FormControl className={classes.formControl} disabled = {true}>
                        <InputLabel id="skillsRequiredLabel">Skills Required (Select multiple)</InputLabel>
                        <Select
                            labelId="skillsRequiredLabel"
                            id="skillsRequired"
                            multiple
                            value={this.state.job.skillsRequired}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                                </div>
                            )}
                            >
                            {this.skills.map((skill) => (
                                <MenuItem key={skill} value={skill}>
                                {skill}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </div>
                </div>
                <div class="row">
                        <div className="input-field col s12">
                        <FormControl className={classes.formControl} disabled = {true}>
                        <InputLabel htmlFor="location">Location</InputLabel>
                            <Select
                                id="location"
                                value={ this.state.job.location.name}
                                className={classnames("input-field col s12", {})}
                                >
                                    {this.locations.map((location) => (
                                        <MenuItem key={location} value={location}>
                                        {location}
                                        </MenuItem>
                                    ))}
                            </Select>
                            </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="col s6">
                        <label htmlFor="estimatedTime">Estimated Time</label>
                            <input
                            value={this.state.job.estimatedTime.value}
                            id="estimatedTime"
                            type="text"
                            className={classnames("", {})}
                            disabled = {true}
                            />
                        
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl} disabled = {true}>
                            <InputLabel htmlFor="estimatedTimeUnit">Unit</InputLabel>
                                <Select
                                    id="estimatedTimeUnit"
                                    value={ this.state.job.estimatedTime.unit}
                                    >
                                        {this.timeUnits.map((unit) => (
                                            <MenuItem key={unit} value={unit}>
                                            {unit}
                                            </MenuItem>
                                        ))}
                                </Select>
                                </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="col s6">
                            <label htmlFor="estimatedValue">Estimated Value</label>
                            <input
                            disabled = {true}
                            value={this.state.job.estimatedValue.value}
                            id="estimatedValue"
                            type="text"
                            className={classnames("", {})}
                            />
                        
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl} disabled = {true}>
                            <InputLabel htmlFor="estimatedValueCurrency">Currency</InputLabel>
                                <Select
                                    id="estimatedValueCurrency"
                                    value={ this.state.job.estimatedValue.currency}
                                    >
                                        {this.currencies.map((currency) => (
                                            <MenuItem key={currency} value={currency}>
                                            {currency}
                                            </MenuItem>
                                        ))}
                                </Select>
                                </FormControl>
                        </div>
                </div>
                <div class="row" style={{paddingBottom: "15px"}}>
                        <div className="input-field col s6">
                            <FormControlLabel 
                                control={
                                <Checkbox
                                    checked={this.state.job.insuranceIncluded}
                                    name="insuranceIncluded"
                                    color="primary"
                                    disabled = {true}
                                />
                                }
                                label="Include Medical Insurance?"
                            />
                        </div>
                </div>
                <div class="row">
                        <div className="col s6">
                        <label htmlFor="insuranceValue">Insurance Value</label>
                            <input
                            value={this.state.job.insurance.value}
                            id="insuranceValue"
                            type="text"
                            className={classnames("", {})}
                            disabled = {true}
                            />
                        
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl} disabled = {true}> 
                            <InputLabel htmlFor="insuranceType">Type</InputLabel>
                                <Select
                                    id="insuranceType"
                                    value={ this.state.job.insurance.insuranceType}
                                    disabled = {true}
                                    >
                                        {this.insuranceTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                            {type}
                                            </MenuItem>
                                        ))}
                                </Select>
                                </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="col s12">
                        <label htmlFor="advancePayment">Advance Payment (if offered)</label>
                            <input
                            value={this.state.job.advancePayment.value}
                            id="advancePayment"
                            type="text"
                            className={classnames("", {})}
                            disabled = {true}
                            />
                        
                        </div>
                </div>
                </form>
            </div>
            </div>
        </div>
        );
    }

}

ViewJob.propTypes = {
    getJobToViewAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    jobR: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    jobR: state.jobR
  });

export default withStyles(useStyles)(
    connect(
    mapStateToProps,
    { getJobToViewAction }
  )(withRouter(ViewJob))
  );