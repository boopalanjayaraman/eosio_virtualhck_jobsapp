import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { logout } from "../utils/scatterfunctions"

import { GET_ERRORS, USER_LOADING, SET_CURRENT_USER } from "./types";

//// Register user
export const registerUser = (userData, history) => dispatch => {
    axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login")) //redirecting to login on successful register
    .catch(err => 
        dispatch(publishError(err))
        );
};

//// Login user
export const loginUser = userData => dispatch => {
    axios
    .post("api/users/login", userData)
    .then(res => {
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        //// set auth token to header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
        dispatch(publishError(err))
      );
};


// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    try{
        logout();
    }catch(err){
        console.log(err);
    }   
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };

// Set logged in user
export const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };

// User loading
export const setUserLoading = () => {
return {
    type: USER_LOADING
    };
};

//// act on error
export const publishError = (err) => {
    return {
            type: GET_ERRORS,
            payload: err.response.data
        };
};