import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

import { issueTokens } from "../../smartcontractops/jobContractOperations"


class TestJobContract extends Component{
    constructor(){
        super();
         
        this.state = {
            issue: {
                issuer: "",
                to: "",
                quantity: "",
                response: ""
            },
            errors: {}
        };
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

    onIssueChange = e => {
        //alert(JSON.stringify({ issue:{...this.state.issue, [e.target.id]: e.target.value}}));
        this.setState({ issue:{...this.state.issue, [e.target.id]: e.target.value}});
    };

    onIssueClick = e => {
        e.preventDefault();
        var _response = issueTokens(this.state.issue.to, this.state.issue.quantity);
        var responseVal = JSON.stringify(_response);
        this.setState({  issue: {...this.state.issue, response : responseVal }});
    };


    render(){
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
                <b>JobContract Actions</b> below
            </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
            <div class="row">
                <div className="input-field col s12">
                    <input
                    onChange={this.onIssueChange}
                    value={this.state.issue.issuer}
                    id="issuer"
                    type="text"
                    />
                    <label htmlFor="issue_issuer">Issuer</label>
                </div>
            </div>
            <div class="row">
                <div className="input-field col s12">
                    <input
                    onChange={this.onIssueChange}
                    value={this.state.issue.to}
                    id="to"
                    type="text"
                    />
                    <label htmlFor="issue_to">To</label>
                </div>
            </div>
            <div class="row">
                <div className="input-field col s12">
                    <input
                    onChange={this.onIssueChange}
                    value={this.state.issue.quantity}
                    id="quantity"
                    type="text"
                    />
                    <label htmlFor="issue_quantity">Quantity</label>
                </div>
                <span id="issue_response">{this.state.issue.response}</span>
            </div>  
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                        style={{
                            width: "200px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem",
                            marginRight: "1rem"
                        }}
                        onClick={this.onIssueClick}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                        Issue
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
        )};
}

export default (withRouter(TestJobContract))