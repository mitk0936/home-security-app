import { take, call, put } from 'redux-saga/effects'
import PahoMQTT from 'paho.mqtt.js'
import { store } from '../store'
import * as actions from '../actions'
import { user } from '../selectors'
import config from '../config'

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

const pahoMqttConnect = ({username, password}, onMessageArrived) => {
	return new Promise ((resolve, reject) => {
		const { host, port } = config.mqtt
		const client = new PahoMQTT.Client(host, port, '_234112123123')

		client.onMessageArrived = onMessageArrived

		client.onConnectionLost = () => store.dispatch(actions.connectionLost())

		client.connect({
			useSSL: true,
			userName: username,
			password,
			onSuccess: () => resolve({ client }),
			onFailure: () => reject({ error: 'login failed' })
		})
	})
}

/*
	Middleware watcher for the MQTT connect action
*/
export function* watchMqttConnect () {
	while (true) {
		const action = yield take(actions.CONNECT_MQTT)

		try {
			const { client } = yield call(pahoMqttConnect, action, onMessageArrived)
			yield put(actions.userLogged({ username: action.username }))
			yield put(actions.navigate(config.paths.devices))

			client.subscribe('#')

			yield take(actions.CONNECTION_LOST)
			yield put(actions.navigate(config.paths.login))
			
		} catch (e) {
			console.log(e)
			alert('Unable to connect. Please, try again.')
			// TODO: handle unable to connect
		}
	}
}