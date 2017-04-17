import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import user from "./user";
import data from "./data"

// main reducers
export const reducers = combineReducers({
	routing: routerReducer,
	user,
	data
});
