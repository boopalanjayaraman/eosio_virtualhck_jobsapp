import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browseJobsAction  } from "../../actions/jobActions";
import classnames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import dateFormat from 'dateformat'
import Select from '@material-ui/core/Select';

import locationProvider from "../../dataproviders/locationProvider";
import skillsProvider from "../../dataproviders/skillsProvider";


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


class BrowseJobs extends Component{
    //// constructor
    constructor(){
        super();

        this.skills = skillsProvider();
        this.locations = locationProvider();

        var now = new Date();

        this.state = {
            jobs: [],
            errors:{
            }
        };
        
        //bind the function
        this.onSetBrowseJobs = this.onSetBrowseJobs.bind(this);
    }

    componentDidMount() {
        //// fetch jobs list for browse jobs 
        var userData = { 
            userId: this.props.auth.user.id 
        };

        this.props.browseJobsAction(userData, this.onSetBrowseJobs);
    }

    onSetBrowseJobs(){
        var fetchedJobs = this.props.jobR.browseJobs;
        this.setState({
            jobs: fetchedJobs.jobs
        }) ;
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
                    <b>Explore Jobs</b> below
                </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                    
                <div class="row">
                    {/* <div className="col s12"> */}
                        {
                            this.state.jobs.map((_job) => {
                              return  <div class="col s12">
                                    <div class="col s8">
                                      <p style={{fontWeight:"bold"}}>{
                                        _job.description.length > 80? _job.description.substring(0, 80) + '..' : _job.description}</p>
                                    </div> 
                                    <div class="col s4" style={{paddingTop:"15px", textAlign:"right"}}>
                                    <label class="input-field" >{ "Starts on " + dateFormat(_job.startDate, format) }</label>
                                    </div>
                                  <div class="col s12">
                                    <label>   
                                        {
                                        _job.summary.length > 150? _job.summary.substring(0, 150) + '...' : _job.summary}
                                    </label>
                                  </div> 
                                  <div class="col s6" style={{paddingTop:"10px"}}>
                                        <label style={{color:"#32a8a6", fontWeight:"bold"}}>   
                                            {
                                            _job.estimatedTime.value ? 
                                                '[Est. time: ' + _job.estimatedTime.value + ' ' +  _job.estimatedTime.unit + '] ': 
                                                ' '}
                                        </label>
                                        <label style={{color:"#a85d32", fontWeight:"bold"}}>   
                                                    {
                                                    _job.estimatedValue.value ? 
                                                    '[Est. value: ' + _job.estimatedValue.value + ' ' +  _job.estimatedValue.currency + '] ': 
                                                        ' '}
                                                </label>
                                    </div>
                                    <div class="col s6" style={{paddingTop:"4px", textAlign:"right"}}>
                                        <Link to="/ViewJob" className="waves-effect">
                                            <i className="material-icons left" style={{marginRight:"5px"}}>preview</i><label style={{marginRight:"5px"}}>View</label>
                                        </Link>
                                        <Link to="/ViewJob" className="waves-effect">
                                            <i className="material-icons left" style={{marginRight:"5px"}}>send</i><label style={{marginRight:"5px"}}>Apply</label>
                                        </Link>
                                        <Link to="/ViewJob" className="waves-effect">
                                            <i className="material-icons left" style={{marginRight:"5px"}}>bookmark</i><label style={{marginRight:"5px"}}>Save</label>
                                        </Link>
                                    </div> 
                                    <div class="col s12">
                                        <div style={{borderBottom: "1px dotted rgba(0,0,0,0.42)"}}>&nbsp;</div>
                                    </div>
                                </div>
                            })
                        }
                    {/* </div> */}
                </div>
                </form>
            </div>
            </div>
        </div>
        );
    }

}

BrowseJobs.propTypes = {
    browseJobsAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    jobR: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({ //state --> denotes redux state
    errors: state.errors,
    auth: state.auth,
    jobR: state.jobR
  });

export default withStyles(useStyles)(
    connect(
    mapStateToProps,
    { browseJobsAction }
  )(withRouter(BrowseJobs))
  );