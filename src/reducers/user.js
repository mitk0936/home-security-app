import * as actions from '../actions'

export default function user (state = {
	username: null,
	logged: false,
	messages: {}
}, action) {
	switch (action.type) {
		case actions.USER_LOGGED:
			return Object.assign({}, state, {
				username: action.username,
				logged: true
			})
		case actions.MESSAGE_ARRIVED:
			const { deviceId, topic, message } = action
			const { value, timestamp, retained } = message

			const deviceData = state.messages[deviceId] || {}

			return Object.assign({}, state, {
				messages: Object.assign({}, state.messages, {
					[deviceId]: Object.assign({}, deviceData, {
						[topic]: Object.assign({}, deviceData[topic], {
							[timestamp]: { value, timestamp, retained }
						})
					})
				})
			})
		case actions.CONNECTION_LOST:
		case actions.USER_LOGOUT:
			return Object.assign({}, state, {
				username: null,
				logged: false
			})
	}

	return state
}