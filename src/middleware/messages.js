import { take, call, put } from 'redux-saga/effects'
import * as actions from '../actions'

import config from '../config'

/*
	Middleware watcher for setting new device status (connectivity and motion)
*/
export function* watchDevicesStatus () {
	while (true) {
		const { deviceId, topic, message } = yield take(actions.MESSAGE_ARRIVED)

		switch (topic) {
			case config.topics.data.motion:
				/* update device status for new motion detected */
				if (message.value === 1) {
					yield put(actions.setDeviceState({ deviceId, topic, value: message.timestamp }))
				}
				
				break;
			case config.topics.data['temp-hum']:
				/*
					update device status,
					if new temperature and humidity is detected
				*/
				if (message.value) {
					yield put(actions.setDeviceState({ deviceId, topic, value: message.value }))
				}

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
				value: deviceIsConnected 
			}))
		}

		/*
			TODO:
			Dispatch action for Notificating the user,
			if the device went offline, or motion is detected
		*/
	}
}	