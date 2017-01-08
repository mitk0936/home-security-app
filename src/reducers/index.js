import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import users from "./users";

// main reducers
export const reducers = combineReducers({
	routing: routerReducer,
	users: users,
});
