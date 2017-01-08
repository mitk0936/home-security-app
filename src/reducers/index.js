import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import user from "./user";

// main reducers
export const reducers = combineReducers({
	routing: routerReducer,
	user: user,
});
