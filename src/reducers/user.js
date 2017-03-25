import * as actions from '../actions'
import config from '../config'

const defaultDeviceState = {
	[config.topics.data.connectivity]: false,
	[config.topics.data.motion]: null,
	[config.topics.data['temp-hum']]: {
		temperature: 0,
		humidity: 0
	},
	[config.topics.data.gas]: 0
}

const defaultState = {
	username: null,
	logged: false,
	reconnecting: false,
	messages: {},
	devicesState: {}
}

export default function user (state = defaultState, action) {
	switch (action.type) {
		case actions.USER_LOGGED:
			return Object.assign({}, state, {
				username: action.username,
				reconnecting: false,
				logged: true
			})
		case actions.MESSAGE_ARRIVED:
			const { deviceId, topic, message } = action
			const { value, timestamp, retained } = message

			const deviceData = state.devicesState[deviceId] || defaultDeviceState
			const messagesByTopic = state.messages[deviceId] || {}

			return Object.assign({}, state, {
				devicesState: Object.assign({}, state.devicesState, {
					[deviceId]: deviceData
				}),
				messages: Object.assign({}, state.messages, {
					[deviceId]: Object.assign({}, messagesByTopic, {
						[topic]: Object.assign({}, messagesByTopic[topic], {
							[timestamp]: { value, timestamp, retained }
						})
					})
				})
			})
		case actions.SET_DEVICE_STATE:
			return Object.assign({}, state, {
				devicesState: Object.assign({}, state.devicesState, {
					[action.deviceId]: Object.assign({}, state.devicesState[action.deviceId], {
						[action.topic]: action.value
					})
				})
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