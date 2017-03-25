import { take, call, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { store } from '../store'
import * as actions from '../actions'
import { user } from '../selectors'
import config from '../config'

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


/*
	Middleware watcher for the MQTT connect action
*/
export function* watchMqttConnect () {
	let reconnectsLeft = config.mqtt.allowedReconnects

	yield takeLatest(actions.CONNECT_MQTT, function* ({ username, password }) {
		if (reconnectsLeft > 0) {
			
			try {				
				const { client } = yield call(pahoMqttConnect, { username, password }, onMessageArrived, onConnectionLost)
				
				yield put(actions.userLogged({ username }))
				yield put(actions.navigate(config.paths.devices))

				client.subscribe('#')

				reconnectsLeft = config.mqtt.allowedReconnects

				yield take(actions.CONNECTION_LOST)
				yield put(actions.connectMqtt({ username, password }))
			} catch (e) {
				alert('Unable to connect. Please, try again.')
				
				reconnectsLeft--
				
				yield put(actions.connectMqtt({ username, password }))
			}

		} else {
			alert('3 reconnects failed, please login again')
			
			reconnectsLeft = config.mqtt.allowedReconnects

			yield(put(actions.userLogout()))
			yield put(actions.navigate(config.paths.login))
		}
	})
}