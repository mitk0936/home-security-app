import * as actions from '../actions'
import config from '../config'

export const defaultDeviceState = {
	[config.topics.data.connectivity]: false,
	[config.topics.data.motion]: null,
	[config.topics.data['temp-hum']]: {
		temperature: 0,
		humidity: 0
	},
	[config.topics.data.gas]: 0
}

export const defaultState = {
	messages: {},
	devicesState: {},
	securityAlerts: {}
}

export default function messagingData (state = defaultState, action) {
	switch (action.type) {
		case actions.MESSAGE_ARRIVED:
			const { deviceId, topic, message } = action
			const { value, timestamp, retained } = message

			const deviceData = state.devicesState[deviceId] || defaultDeviceState
			const messagesByTopic = state.messages[deviceId] || {}

			return Object.assign({}, state, {
				devicesState: Object.assign({}, state.devicesState, {
					[deviceId]: deviceData
				}),
				/*
					Updating the messages structure
					[deviceId][topic][timestamp] -> { value, timestamp, retained }
				*/
				messages: Object.assign({}, state.messages, {
					[deviceId]: Object.assign({}, messagesByTopic, {
						[topic]: Object.assign({}, messagesByTopic[topic], {
							[timestamp]: { value, timestamp, retained }
						})
					})
				})
			})
		case actions.SET_DEVICE_STATE:
			/* Updating the device state in the Application Store */
			return Object.assign({}, state, {
				devicesState: Object.assign({}, state.devicesState, {
					[action.deviceId]: Object.assign({}, state.devicesState[action.deviceId], {
						[action.topic]: action.value
					})
				})
			})
		case actions.PUSH_SECURITY_ALERT:
			const securityAlertsForDevice = state.securityAlerts[action.deviceId] || {}
			const securityAlertsTopicsForDevice = securityAlertsForDevice[action.topic] || {}

			return Object.assign({}, state, {
				securityAlerts: Object.assign({}, state.securityAlerts, {
					[action.deviceId]: Object.assign({}, securityAlertsForDevice, {
						[action.topic]: Object.assign({}, securityAlertsTopicsForDevice, {
							[action.timestamp]: {
								value: action.value
							}
						})
					})
				})
			})
		case actions.USER_LOGOUT:
			return defaultState
	}

	return state
}