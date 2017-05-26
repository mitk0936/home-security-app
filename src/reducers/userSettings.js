import * as actions from '../actions'

export const defaultCachedState = {
	username: '',
	broker: '',
	port: ''
}
export const userCachedData = (state = defaultCachedState, action) => {
	switch (action.type) {
		case actions.USER_LOGGED:
			return Object.assign({}, {
				username: action.username,
				broker: action.broker,
				port: action.port
			})
	}

	return state
}

export const userAlertsSettings = (state = {}, action) => {
	switch (action.type) {
		case actions.SET_USER_ALERTS_SETTINGS:
			return Object.assign({}, action.settings)
		case actions.UPDATE_USER_ALERTS_SETTINGS:
			return Object.assign({}, state, {
				[action.deviceId]: action.flag
			})

	}

	return state
}