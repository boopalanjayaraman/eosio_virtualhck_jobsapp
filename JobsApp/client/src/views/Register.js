import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'

//scatter js
import { logout, connectToScatter, loginToScatter} from '../utils/scatterfunctions'

const useStyles = (theme) => ({
    select: {
      margin : theme.spacing(2),
    }
  });
  

class Register extends Component{
    //// constructor
    constructor(){
        super();

        this.state = {
          username: "",
          loginId: "",
          password: "",
          password2: "",
          userType: "individual",
          accountName: "",
          publicKey: "",
          authority: "",
          errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
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
    onUserTypeChange = e => {
        this.setState({ userType : e.target.value });
    };

    onScatterLoginClick = e =>{
        e.preventDefault();
        connectToScatter("Whatsout-JobsApp")
        .then(() => { 
                var result = loginToScatter().then((result)=>{
                this.setState({ accountName: result.name, authority: result.authority, publicKey: result.publicKey  });
            }).catch(err=> { console.log(err);  }); 
        })
        .catch(err=> { console.log(err);  })
    };

    //define onSubmit handler
    onSubmit = e => {
        e.preventDefault();

        const freshUser = {
            username: this.state.username,
            loginId: this.state.loginId,
            password: this.state.password,
            password2: this.state.password2,
            userType: this.state.userType
        };

        this.props.registerUser(freshUser, this.props.history);
    };

    //// implement render 
    render(){
        const { errors } = this.state;
        const { classes } = this.props;

        return(
            <div className="container">
            <div className="row">
            <div className="col s8 offset-s2">
                <Link to="/" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                    <b>Register</b> below
                </h4>
                <p className="grey-text text-darken-1">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    id="username"
                    type="text"
                    className={classnames("", {
                        invalid: errors.username
                      })}
                    />
                    <label htmlFor="username">Full Name</label>
                    <span className="red-text">{errors.username}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.loginId}
                    error={errors.loginId}
                    id="loginId"
                    type="text"
                    className={classnames("", {
                        invalid: errors.loginId
                      })}
                    />
                    <label htmlFor="loginId">LoginId (Email)</label>
                    <span className="red-text">{errors.loginId}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password
                      })}
                    />
                    <label htmlFor="password">Password</label>
                    <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password2
                      })}
                    />
                    <label htmlFor="password2">Confirm Password</label>
                    <span className="red-text">{errors.password2}</span>
                </div>
                <div className="input-field col s12">
                        {/* <InputLabel id="userTypeLabel" style={{padding: "2px" }}>User Type</InputLabel> */}
                        <Select
                            labelId="userTypeLabel"
                            id="userType"
                            value={ this.state.userType}
                            onChange={ this.onUserTypeChange}
                            className={classnames("input-field col s12", {
                                invalid: errors.userType
                              })}
                            >
                                <MenuItem value="individual">Individual</MenuItem>
                                <MenuItem value="organization">organization</MenuItem>
                        </Select>
                        <span className="red-text">{errors.userType}</span>
                        {/* <label htmlFor="userType">User Type</label> */}
                </div>
                <div className="row">
                    <div className="input-field col s4">
                        <InputLabel id="connectScatterLabel">Connect to Scatter</InputLabel>
                    </div>
                    <div className="input-field col s2" style={{paddingTop: "8px"}}>
                    <Link to="/" onClick={this.onScatterLoginClick} >Connect</Link>
                    {/* <button
                            style={{
                                width: "100px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem",
                                marginRight: "1rem"
                            }}
                            onClick={this.onScatterLoginClick}
                            className="btn btn-large waves-effect waves-light hoverable"
                            >
                            Connect
                        </button> */}
                    </div>
                    <div className="input-field col s6" >
                    <label>{ this.state.accountName? "[" + this.state.accountName: "" } { this.state.authority? "@"+this.state.authority : "" } 
                            { this.state.publicKey? ", PubKey:"+ this.state.publicKey.substring(0, 15) + "...]" : "" } </label>
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
                    Sign up
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        );
    }

}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

export default withStyles(useStyles)(
    connect(
    mapStateToProps,
    { registerUser }
  )(withRouter(Register))
  );