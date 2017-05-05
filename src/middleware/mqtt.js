import { take, call, put, fork } from 'redux-saga/effects'
import { takeLatest, delay } from 'redux-saga'
import { store } from '../store'
import * as actions from '../actions'
import { user } from '../selectors'
import config from '../config'
import { fireNotification } from '../services/notificationService'
import { pahoMqttConnect } from '../services/mqttConnect'

/* 
	A callback from PahoMQTT
	Called when a new message for the user arrived,
	checks the message and push into the storage
*/
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

/* 
	A callback from PahoMQTT
	Caled when connectivity is lost by the broker
*/
const onConnectionLost = () => store.dispatch(actions.connectionLost())


/* Caled when connectivity is lost or user logout */
const disconnect = function* (client) {
	client && client.disconnect()
	yield put(actions.navigate(config.paths.login))
}

/*
	Middleware watcher for the MQTT connect action
*/
export function* watchMqttConnect () {
	/* getting the configuration for maximum allowed re-connects */
	let reconnectsLeft = config.mqtt.allowedReconnects

	yield takeLatest(actions.CONNECT_MQTT, function* ({ username, password, broker, port, reconnect }) {
		const allowedToReconnect = (reconnect && reconnectsLeft > 0)

		if (!reconnect || allowedToReconnect) {
			try {
				/* Making an attempt to connect to the MQTT broker,
					client is returned as a result */
				const { client } = yield call(
					pahoMqttConnect,
					{ username, password, broker, port },
					onMessageArrived,
					onConnectionLost
				)
				
				yield put(actions.userLogged({ username, broker, port }))

				/* User is connected, subscribe the client to all
					available data for his account */
				client.subscribe('#')
				reconnectsLeft = config.mqtt.allowedReconnects

				/* Waiting for the next action:
					- connection lost -> attempt to reconnect
					- user logout -> go to home screen */
				const { type } = yield take([
					actions.CONNECTION_LOST,
					actions.USER_LOGOUT
				])

				switch (type) {
					case actions.CONNECTION_LOST:
						yield put(actions.connectMqtt({ username, password, broker, port, reconnect: true }));
						break;
					case actions.USER_LOGOUT:
						yield call(disconnect, client)
				}
			} catch (e) {
				if (!reconnect) {
					/* In case of problems with logging/connecting to the broker */
					yield put(actions.loginFailed())

					yield call(fireNotification, {
						message: 'Please check your credentials, your network connectivity and try again.',
						title: 'Unable to connect',
						buttonText: 'OK'
					})
					return
				}

				/*
					In case of problems with logging/connecting to the broker
					during attempts for re-connect
				*/
				yield call(delay, 2000)
				reconnectsLeft--
				yield put(actions.connectMqtt({
					username, password, broker, port, reconnect: true
				}))
			}
			
			return
		}

		/*
			All attempts for reconnect failed
			The user has lost connectivity
		*/
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
