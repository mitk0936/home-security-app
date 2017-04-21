import * as actions from '../actions'
import config from '../config'
import { removeByKey } from '../utils/helper'

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
	messages: {},
	devicesState: {},
	securityAlerts: {}
}

export default function data (state = defaultState, action) {
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
		case actions.PUSH_SECURITY_ALERT:
			return Object.assign({}, state, {
				securityAlerts: Object.assign({}, state.securityAlerts, {
					[action.timestamp]: {
						deviceId: action.deviceId,
						topic: action.topic,
						value: action.value
					}
				})
			})
		case actions.CLEAR_ALERTS:
			return Object.assign({}, state, {
				securityAlerts: {}
			})
		case actions.USER_LOGOUT:
			return defaultState
	}

	return state
}