import { take, call, put } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import * as actions from '../actions'

import config from '../config'

export function* watchNotificationCheck () {
	yield takeEvery(actions.SET_DEVICE_STATE, function* ({ deviceId, topic, value, retained }) {
		switch (topic) {
			case config.topics.data.motion:
			case config.topics.data.gas:

				if (config.sensorValuesLimits[topic] <= value && !retained) {
					yield put(actions.pushSecurityAlert({
						timestamp: new Date().getTime(),
						...{ deviceId, topic, value }
					}))
				}
		}
	})
}

/*
	Middleware watcher for setting new device status (connectivity and motion)
*/
export function* watchDevicesStatus () {
	while (true) {
		const { deviceId, topic, message } = yield take(actions.MESSAGE_ARRIVED)

		switch (topic) {
			case config.topics.data.motion:
				/* update device status for new motion detected */
				if (message.value === config.sensorValuesLimits.motion) {
					yield put(actions.setDeviceState({
						deviceId,
						topic,
						value: message.timestamp,
						retained: message.retained
					}))
				}
				
				break;
			case config.topics.data['temp-hum']:
				/*
					update device status,
					if new temperature and humidity is detected
				*/
				if (message.value) {
					yield put(actions.setDeviceState({
						deviceId,
						topic,
						value: message.value,
						retained: message.retained
					}))
				}

				break;
			case config.topics.data.gas:
				yield put(actions.setDeviceState({
					deviceId,
					topic,
					value: message.value,
					retained: message.retained
				}))

				break;
		}

		/* 
			The device is connected if we receive messages from it
			and the message is not about that the device lost connection 
		*/
		const isConnectivityMessage = (topic === config.topics.data.connectivity)
		const deviceIsConnected = !(isConnectivityMessage && message.value === 0)

		/*
			If the message is retained, it means that we cannot say if the device is online,
			but if the message is about the connectivity status, we take it as truth
		*/
		if (!message.retained || isConnectivityMessage) {
			yield put(actions.setDeviceState({
				deviceId,
				topic: config.topics.data.connectivity,
				value: deviceIsConnected,
				retained: message.retained
			}))
		}

		/*
			TODO:
			Dispatch action for Notificating the user,
			if the device went offline, or motion is detected
		*/
	}
}	