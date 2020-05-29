import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createJobAction  } from "../../actions/jobActions";
import classnames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid';
import dateFormat from 'dateformat'
import { DatePicker } from "react-materialize";
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';


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

class CreateJob extends Component{
    //// constructor
    constructor(){
        super();
        var now = new Date();
        this.state = {
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
            location: { name: ""},
            estimatedTime: { value: "", unit: "hours"},
            estimatedValue: {value: "", currency: "USD"},
            insuranceIncluded: false,
            insurance: {value: "", premium: "", insuranceType: "Health"},
            advancePayment: { value: "", unit: ""},
            billingMode: "",
            errors: {}
        };

        this.skills = [
            'Automobile Repairing',
            'Brick Masonry',
            'Carpentry',
            'Custodian',
            'Electrical Repair',
            'Home Health Aiding',
            'Machinist',
            'Painting',
            'Office Administration',
            'Plumbing',
            'Roofing',
            'Welding',
            'Machine Handling',
            'First Aid',
            'Supervising',
            'Building Repair',
            'Equipment Maintenance',
            'Accounting',
            'Tutoring',
            'Teaching',
            'Parenting',
            'Clinical nursing',
            'Baking',
            'Cooking',
            'Safe food handling',
            'Catering',
            'Language skills',
            'Food service',
            'Beverage preparation',
            'Food preparation',
            'Management'
        ];

        this.locations = [
            'Coimbatore, India',
            'Bangalore, India',
            'Chennai, India',
            'Pune, India',
            'New York, United States',
            'Los Angeles, United States'
        ];

        this.timeUnits = [
            'hours',
            'days',
            'months'
        ];

        this.currencies = [
            'USD',
            'INR'
        ];

        this.billingModes = ['hourly', 'daily', 'weekly', 'monthly'];
        this.advancePaymentUnits = ['percent'];
        this.insuranceTypes = ['Health', 'Medical', 'Life', 'Personal Accident'];
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    // define onChange handler
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    // define onChange handler
    onJobTypeChange = e => {
        this.setState({ jobType : e.target.value });
    };

    onWorkCategoryChange = e => {
        this.setState({ workCategory : e.target.value });
    };

    onIsRemoteChange = e => {
        this.setState({ isRemote : e.target.checked });
    };

    onInsuranceIncludedChange= e => {
        this.setState({ insuranceIncluded : e.target.checked });
    };

    onExpiresOnChange = date => {
        this.setState({ expiresOn : dateFormat(date, format) });
    };

    onStartDateChange = date => {
        this.setState({ startDate : dateFormat(date, format) });
    };

    onEndDateChange = date => {
        this.setState({ endDate : dateFormat(date, format) });
    };

    onSkillsRequiredChanged = e => {
        this.setState({ skillsRequired : e.target.value });
    };

    onLocationChange = e => {
        this.setState({ location : { name: e.target.value } });
    };

    onEstimatedTimeChange = e => {
        var _unit = this.state.estimatedTime.unit;
        this.setState({ estimatedTime : { value: e.target.value, unit: _unit } });
    };

    onEstimatedTimeUnitChange = e => {
        var _value = this.state.estimatedTime.value;
        this.setState({ estimatedTime : { value: _value, unit: e.target.value } });
    };

    onEstimatedValueChange = e => {
        var _curr = this.state.estimatedValue.currency;
        this.setState({ estimatedValue : { value: e.target.value, currency: _curr } });
    };

    onEstimatedValueCurrencyChange = e => { 
        var _value = this.state.estimatedValue.value;
        this.setState({ estimatedValue : { value: _value, currency: e.target.value } });
    };

    onInsuranceValueChange = e => {
        var _type = this.state.insurance.insuranceType;
        this.setState({ insurance : { value: e.target.value, insuranceType: _type } });
    };

    onInsuranceTypeChange = e => { 
        var _value = this.state.insurance.value;
        this.setState({ insurance : { value: _value, insuranceType: e.target.value } });
    };

    onAdvancePaymentChange = e =>{
        this.setState({ advancePayment : { value: e.target.value, unit: "" } });
    };

    //define onSubmit handler
    onSubmit = e => {
        e.preventDefault();

        var now = new Date();
        var newJob = {
            description: this.state.description,
            summary: this.state.summary,
            jobType: this.state.jobType,
            workCategory: this.state.workCategory,
            isRemote: this.state.isRemote,
            expiresOn: this.state.expiresOn,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            skillsRequired: this.state.skillsRequired,
            postingStatus: "new", 
            postedBy: this.props.auth.user.id,
            postedOn: dateFormat(now, format),
            location: this.state.location,
            estimatedTime: this.state.estimatedTime,
            estimatedValue: this.state.estimatedValue,
            insuranceIncluded: this.state.insuranceIncluded,
            insurance: this.state.insurance,
            advancePayment: this.state.advancePayment,
        };
        console.log(newJob);
        this.props.createJobAction(newJob, this.props.history);
    };

    //// implement render 
    render(){
        const { errors } = this.state;
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
                    <b>Create a Job</b> below
                </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div class="row">
                    <div className="input-field col s12">
                        <input
                        onChange={this.onChange}
                        value={this.state.description}
                        error={errors.description}
                        id="description"
                        type="text"
                        className={classnames("", {
                            invalid: errors.description
                        })}
                        />
                        <label htmlFor="description">Description / Title</label>
                        <span className="red-text">{errors.description}</span>
                    </div>
                </div>
                <div class="row">
                    <div className="input-field col s12">
                        <textarea
                        onChange={this.onChange}
                        value={this.state.summary}
                        error={errors.summary}
                        id="summary"
                        type="text"
                        class="materialize-textarea"
                        data-length="120"
                        rows = "5"
                        cols = "40"
                        ></textarea>
                        <label htmlFor="summary">Summary</label>
                        <span className="red-text">{errors.summary}</span>
                    </div>
                </div>
                <div class="row">
                    <div className="input-field col s12">
                    <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="jobType">Job Type</InputLabel>
                            <Select
                                id="jobType"
                                value={ this.state.jobType}
                                onChange={ this.onJobTypeChange}
                                inputProps={{
                                    name: 'jobType',
                                    id: 'jobType',
                                  }}
                                className={classnames("input-field col s12", {
                                    invalid: errors.jobType
                                })}
                                >
                                    <MenuItem value="full_time">Full Time</MenuItem>
                                    <MenuItem value="part_time">Part Time</MenuItem>
                                    <MenuItem value="consulting">Consulting</MenuItem>
                            </Select>
                            <span className="red-text">{errors.jobType}</span>
                    </FormControl>
                    </div>
                </div>
                <div class="row">
                        <div className="input-field col s12">
                        <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="workCategory">Work Category</InputLabel>
                            <Select
                                id="workCategory"
                                value={ this.state.workCategory}
                                onChange={ this.onWorkCategoryChange}
                                inputProps={{
                                    name: 'workCategory',
                                    id: 'workCategory',
                                    }}
                                className={classnames("input-field col s12", {
                                    invalid: errors.workCategory
                                })}
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
                                <span className="red-text">{errors.workCategory}</span>
                            </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.isRemote}
                                    onChange={this.onIsRemoteChange}
                                    name="isRemote"
                                    color="primary"
                                />
                                }
                                label="Is a remote job?"
                            />
                        </div>
                        <div className="input-field col s6">
                            <DatePicker
                                label="Posting Expires on"
                                value={this.state.expiresOn}
                                id="expiresOn"
                                onChange={this.onExpiresOnChange}
                                format = "dd-MMM-yyyy" />
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                        <DatePicker
                                label="Job starts on"
                                value={this.state.startDate}
                                id="startDate"
                                onChange={this.onStartDateChange}
                                format = "dd-MMM-yyyy" />
                        </div>
                        <div className="input-field col s6">
                            <DatePicker
                                label="Job ends on"
                                value={this.state.endDate}
                                id="endDate"
                                onChange={this.onEndDateChange}
                                format = "dd-MMM-yyyy" />
                        </div>
                </div>
                <div class="row">
                    <div className="input-field col s12">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="skillsRequiredLabel">Skills Required (Select multiple)</InputLabel>
                        <Select
                            labelId="skillsRequiredLabel"
                            id="skillsRequired"
                            multiple
                            value={this.state.skillsRequired}
                            onChange={this.onSkillsRequiredChanged}
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
                        <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="location">Location</InputLabel>
                            <Select
                                id="location"
                                value={ this.state.location.name}
                                onChange={ this.onLocationChange}
                                inputProps={{
                                    name: 'location',
                                    id: 'location',
                                    }}
                                className={classnames("input-field col s12", {
                                    invalid: errors.location
                                })}
                                >
                                    {this.locations.map((location) => (
                                        <MenuItem key={location} value={location}>
                                        {location}
                                        </MenuItem>
                                    ))}
                            </Select>
                                <span className="red-text">{errors.location}</span>
                            </FormControl>
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                            <input
                            onChange={this.onEstimatedTimeChange}
                            value={this.state.estimatedTime.value}
                            error={errors.estimatedTime}
                            id="estimatedTime"
                            type="text"
                            className={classnames("", {
                                invalid: errors.estimatedTime
                            })}
                            />
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <span className="red-text">{errors.estimatedTime}</span>
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="estimatedTimeUnit">Unit</InputLabel>
                                <Select
                                    id="estimatedTimeUnit"
                                    value={ this.state.estimatedTime.unit}
                                    onChange={ this.onEstimatedTimeUnitChange}
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
                        <div className="input-field col s6">
                            <input
                            onChange={this.onEstimatedValueChange}
                            value={this.state.estimatedValue.value}
                            error={errors.estimatedValue}
                            id="estimatedValue"
                            type="text"
                            className={classnames("", {
                                invalid: errors.estimatedValue
                            })}
                            />
                        <label htmlFor="estimatedValue">Estimated Value</label>
                        <span className="red-text">{errors.estimatedValue}</span>
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="estimatedValueCurrency">Currency</InputLabel>
                                <Select
                                    id="estimatedValueCurrency"
                                    value={ this.state.estimatedValue.currency}
                                    onChange={ this.onEstimatedValueCurrencyChange}
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
                                    checked={this.state.insuranceIncluded}
                                    onChange={this.onInsuranceIncludedChange}
                                    name="insuranceIncluded"
                                    color="primary"
                                />
                                }
                                label="Include Medical Insurance?"
                            />
                        </div>
                </div>
                <div class="row">
                        <div className="input-field col s6">
                            <input
                            onChange={this.onInsuranceValueChange}
                            value={this.state.insurance.value}
                            error={errors.insurance}
                            id="insuranceValue"
                            type="text"
                            className={classnames("", {
                                invalid: errors.insurance
                            })}
                            disabled={!this.state.insuranceIncluded}
                            />
                        <label htmlFor="insuranceValue">Insurance Value</label>
                        <span className="red-text">{errors.insurance}</span>
                        </div>
                        <div className="input-field col s4">
                            <FormControl className={classes.formControl} disabled={!this.state.insuranceIncluded}> 
                            <InputLabel htmlFor="insuranceType">Type</InputLabel>
                                <Select
                                    id="insuranceType"
                                    value={ this.state.insurance.insuranceType}
                                    onChange={ this.onInsuranceTypeChange}
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
                        <div className="input-field col s12">
                            <input
                            onChange={this.onAdvancePaymentChange}
                            value={this.state.advancePayment.value}
                            error={errors.advancePayment}
                            id="advancePayment"
                            type="text"
                            className={classnames("", {
                                invalid: errors.advancePayment
                            })}
                            />
                        <label htmlFor="advancePayment">Advance Payment (if offered)</label>
                        <span className="red-text">{errors.advancePayment}</span>
                        </div>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                    Create
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        );
    }

}

CreateJob.propTypes = {
    createJobAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth
  });

export default withStyles(useStyles)(
    connect(
    mapStateToProps,
    { createJobAction }
  )(withRouter(CreateJob))
  );