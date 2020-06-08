import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_JOB, BROWSE_JOBS, VIEW_JOB, VIEW_CREATED_JOBS, VIEW_APPLIED_JOBS, VIEW_PAST_JOBS } from "./types";

//// Create Job
export const createJobAction = (jobData, history) => dispatch => {
    axios
    .post("/api/jobs/save", jobData)
    .then(res => {
        const { _id } = res.data;
        dispatch(viewJob(_id));
        history.push("/viewJob");
    })  
    .catch(err => 
        dispatch(publishError(err))
        );
};

export const editJobAction = (jobData, history) => dispatch => {
    axios
    .post("/api/jobs/save", jobData)
    .then(res => {
        const { _id } = res.data;
        dispatch(viewJob(_id));
        history.push("/viewJob");
    })  
    .catch(err => 
        dispatch(publishError(err))
        );
};

export const getJobToViewAction = (jobId, callback) => dispatch => {
    axios
    .get("/api/jobs/get", { params:{ _id: jobId} })
    .then(res => {
        const { job } = res.data;
        dispatch(setCurrentJob(job));
        callback();
    })  
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const getJobToEditAction = (jobData, history) => dispatch => {
    axios
    .get("/api/jobs/get", { params:{ _id: jobData._id} })
    .then(res => {
        const { job } = res.data;
        dispatch(setCurrentJob(job));
    })  
    .catch(err => 
        dispatch(publishError(err))
        );
};

//// browse jobs
export const browseJobsAction = (userData, callback) => dispatch => {
    axios
    .get("/api/jobs/browse", { params:{ userId: userData.userId} } )   
    .then(res => {
        const { jobs } = res.data;
        dispatch(browseJobs(jobs));
        callback();
    })  
    .catch(err => {
        dispatch(publishError(err))
    });
};


//// set current job for view
export const setCurrentJob = (jobData) => {
    return {
            type: SET_CURRENT_JOB,
            payload: jobData
        };
};

//// set current job Id for view
export const viewJob = (jobId) => {
    return {
            type: VIEW_JOB,
            payload: { _id: jobId }
        };
};


//// act on error
export const publishError = (err) => {
    return {
            type: GET_ERRORS,
            payload: err.response.data
        };
};

//// set current job for view
export const browseJobs = (jobsData) => {
    return {
            type: BROWSE_JOBS,
            payload: { jobs: jobsData }
        };
};