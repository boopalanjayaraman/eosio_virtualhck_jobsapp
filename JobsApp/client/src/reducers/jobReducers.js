import { SET_CURRENT_JOB, BROWSE_JOBS, VIEW_JOB, VIEW_CREATED_JOBS, VIEW_APPLIED_JOBS, VIEW_PAST_JOBS } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    browseJobs : [],
    currentJob: {},
    viewJob: {},
    createdJobs: [],
    appliedJobs: [],
    pastJobs: []
};

function jobReducers(state= initialState, action) {
    switch(action.type) {
        case SET_CURRENT_JOB:
            return {
                ...state,
                currentJob : action.payload,
            };
        case BROWSE_JOBS:
            return {
                ...state,
                browseJobs : action.payload,
            };
        case VIEW_JOB:
            return {
                ...state,
                viewJob : action.payload,
            };
        default:
            return state;
    }
}

export default jobReducers;