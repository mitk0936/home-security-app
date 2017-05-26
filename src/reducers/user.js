import * as actions from '../actions'
import config from '../config'

export const defaultState = {
	username: null,
	logged: false,
	reconnecting: false,
	logging: false
}

export default function user (state = defaultState, action) {
	switch (action.type) {
		case actions.CONNECT_MQTT:
			return Object.assign({}, state, {
				logging: !action.reconnect
			})
		case actions.USER_LOGGED:
			return Object.assign({}, state, {
				username: action.username,
				reconnecting: false,
				logging: false,
				logged: true
			})
		case actions.LOGIN_FAILED:
			return Object.assign({}, state, {
				logging: false
			})
		case actions.CONNECTION_LOST:
			return Object.assign({}, state, {
				reconnecting: true
			})
		case actions.USER_LOGOUT:
			return defaultState
	}

	return state
}