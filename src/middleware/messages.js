import { take, call, put, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
import * as actions from '../actions'
import { beep, vibrate, fireAToast } from '../services/notificationService'
import { generateSecurityAlertLabel } from '../utils/helper'
import { userAlertsSettings } from '../selectors'
import config from '../config'

export function* watchNotificationCheck () {
	yield takeEvery(actions.SET_DEVICE_STATE, function* ({ deviceId, topic, value, retained, timestamp }) {

		/* If the user set alerts off for this device, app is not firing a notification */
		const alertSettings = yield select(userAlertsSettings)
		if (!alertSettings[deviceId]) { return }

		let pushSecurityAlertFlag = false
		const deviceLostConnection = (
			(topic === config.topics.data.connectivity) &&
			value == 0
		)

		/* The pushSecurityAlertFlag says, whether if
			a security alert is needed */
		switch (topic) {
			case config.topics.data.motion:
			case config.topics.data.gas:
				pushSecurityAlertFlag = (config.sensorValuesLimits[topic] <= value)
		}

		if (pushSecurityAlertFlag) {
			yield put(actions.pushSecurityAlert({
				timestamp: parseInt(timestamp, 10) * 1000, // convert to milliseconds
				...{ deviceId, topic, value }
			}))
		}

		/*
			Notify user, if the security alert message is not retained (a new one)
			or it is about connectivity and device is offline
		*/

		if (!retained && (pushSecurityAlertFlag || deviceLostConnection)) {
			/* Open a toast message for the security alert */
			const toastText = generateSecurityAlertLabel({topic, deviceId, value})
			fireAToast(`${deviceId} - ${toastText}`)
			beep(1)
			vibrate(1500)
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
						retained: message.retained,
						timestamp: message.timestamp
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
						retained: message.retained,
						timestamp: message.timestamp
					}))
				}

				break;
			case config.topics.data.gas:
				/*
					update device status,
					if new gas is detected
				*/
				yield put(actions.setDeviceState({
					deviceId,
					topic,
					value: message.value,
					retained: message.retained,
					timestamp: message.timestamp
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
				retained: message.retained,
				timestamp: message.timestamp
			}))
		}
	}
}	