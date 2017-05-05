import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
import user from "./user"
import messagingData from "./messagingData"
import { userCachedData, userAlertsSettings } from './userSettings'

// main reducers
export const reducers = combineReducers({
	userCachedData,
	userAlertsSettings,
	routing: routerReducer,
	user,
	messagingData
});
