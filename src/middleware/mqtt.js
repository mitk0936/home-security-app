import { take, call, put, fork } from 'redux-saga/effects'
import { takeLatest, delay } from 'redux-saga'
import { store } from '../store'
import * as actions from '../actions'
import { user } from '../selectors'
import config from '../config'

import { fireNotification } from '../services/notificationService'

import { pahoMqttConnect } from '../services/mqttConnect'

const onMessageArrived = (message) => {
	const topicData = message.destinationName.split('/')
			
	const { retained } = message
	const deviceId = topicData[0]
	const topic = topicData[1]
	
	try {
		deviceId && config.topics.data[topic] &&
		store.dispatch(actions.messageArrived({
			deviceId,
			topic,
			message: {
				...{ timestamp: '0' },
				...JSON.parse(message.payloadString),
				retained
			}
		}))
	} catch (e) {
		console.error(e)
	}
}

const onConnectionLost = () => store.dispatch(actions.connectionLost())

const disconnect = function* (client) {
	client && client.disconnect()
	yield put(actions.navigate(config.paths.login))
}

/*
	Middleware watcher for the MQTT connect action
*/
export function* watchMqttConnect () {
	let reconnectsLeft = config.mqtt.allowedReconnects

	yield takeLatest(actions.CONNECT_MQTT, function* ({ username, password, reconnect }) {

		const allowedToReconnect = (reconnect && reconnectsLeft > 0)

		if (!reconnect || allowedToReconnect) {
			try {				
				const { client } = yield call(
					pahoMqttConnect,
					{ username, password },
					onMessageArrived,
					onConnectionLost
				)
				
				yield put(actions.userLogged({ username }))
				yield put(actions.navigate(config.paths.devices))

				client.subscribe('#')

				reconnectsLeft = config.mqtt.allowedReconnects

				const { type } = yield take([
					actions.CONNECTION_LOST,
					actions.USER_LOGOUT
				])

				switch (type) {
					case actions.CONNECTION_LOST:
						yield put(actions.connectMqtt({ username, password, reconnect: true }));
						break;
					case actions.USER_LOGOUT:
						yield call(disconnect, client)
				}
			} catch (e) {
				if (!reconnect) {
					yield call(fireNotification, {
						message: 'Please, try again.',
						title: 'Unable to connect',
						buttonText: 'OK'
					})

					return
				}

				yield call(delay, 2000)
				reconnectsLeft--
				yield put(actions.connectMqtt({ username, password, reconnect: true }))
			}

			return
		}

		yield call(fireNotification, {
			message: 'Ooops. Looks like you lost network connectivity.',
			title: 'Network Problem',
			buttonText: 'OK'
		}, 2, 2000)
			
		reconnectsLeft = config.mqtt.allowedReconnects
		yield(put(actions.userLogout()))
		yield call(disconnect)
	})
}