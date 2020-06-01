import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();    
    };

    onBrowseClick = e => {
        e.preventDefault();
        this.props.history.push("/browseJobs");
    };

    onCreateClick = e => {
        e.preventDefault();
        this.props.history.push("/createJob"); 
    };

    onTestContractClick =e=>{
        e.preventDefault();
        this.props.history.push("/testJobContract"); 
    };

    render() {
        const { user } = this.props.auth;

        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                <div className="col s12 center-align">
                    <h4>
                    <b>Hey there,</b> {user.name.split(" ")[0]} <span style={{fontSize:"15px"}}>{(user.accountName)? "("+ user.accountName+ "@" + user.authority+")" : ""}</span>
                    <p className="flow-text grey-text text-darken-1">
                        You are now into the world of jobs - {" "}
                        <span style={{ fontFamily: "monospace" }}>Worksout</span>.
                    </p>
                    </h4>
                    <button
                    style={{
                        width: "200px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem",
                        marginRight: "1rem"
                    }}
                    onClick={this.onBrowseClick}
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Browse Jobs
                    </button>
                    <button
                    style={{
                        width: "200px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem",
                        marginRight: "1rem"
                    }}
                    onClick={this.onCreateClick}
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Create one
                    </button>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    onClick={this.onTestContractClick}
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Test Contract
                    </button>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    onClick={this.onLogoutClick}
                    className="btn btn-large waves-effect waves-light hoverable red accent-3"
                    >
                    Log out
                    </button>
                </div>
                </div>
            </div>
        );
    }
}


Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser })(Dashboard);