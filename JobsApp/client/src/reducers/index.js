import { combineReducers } from "redux";
import authReducers from "./authReducers";
import errorReducers from "./errorReducers";
import jobReducers from "./jobReducers";

export default combineReducers({
  auth: authReducers,
  errors: errorReducers,
  jobR: jobReducers 
});

