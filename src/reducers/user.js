import * as actions from '../actions'
import config from '../config'

const defaultState = {
	username: null,
	logged: false,
	reconnecting: false
}

export default function user (state = defaultState, action) {
	switch (action.type) {
		case actions.USER_LOGGED:
			return Object.assign({}, state, {
				username: action.username,
				reconnecting: false,
				logged: true
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