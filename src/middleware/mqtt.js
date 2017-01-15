import { take, call, put } from 'redux-saga/effects'
import PahoMQTT from 'paho.mqtt.js'
import { store } from '../store'
import * as actions from '../actions'
import { user } from '../selectors'
import config from '../config'

const pahoMqttConnect = ({username, password}) => {
	return new Promise ((resolve, reject) => {
		const { host, port } = config.mqtt
		const client = new PahoMQTT.Client(host, port, '_234112123123')

		client.onMessageArrived = (message) => {
			const topicData = message.destinationName.split('/')
			const deviceId = topicData[0]
			const topic = topicData[1]

			console.log(message.payloadString, message.retained, message.qos, message._getQos())
			
			config.topics.data[topic] && store.dispatch(actions.messageArrived({
				deviceId,
				topic,
				message: JSON.parse(message.payloadString)
			}))
		}

		client.onConnectionLost = () => store.dispatch(actions.connectionLost())

		client.connect({
			useSSL: true,
			userName: username,
			password,
			onSuccess: () => resolve({ client }),
			onFailure: () => reject({error: 'login failed'})
		});
	})
}

/*
	Middleware watcher for the MQTT disconnect action
*/
export function* watchMqttDisconnect(action) {

}

/*
	Middleware watcher for the MQTT connect action
*/
export function* watchMqttConnect(action) {
	while (true) {
		const action = yield take(actions.CONNECT_MQTT)

		try {
			const { client } = yield call(pahoMqttConnect, action)
			yield put(actions.userLogged({ username: action.username }))
			yield put(actions.navigate(config.paths.devices))

			// get existing devices, subscribe to all
			client.subscribe('#')

			// take adding new devices, subscribe to them
			// take logout actions, disconnect client
		} catch (e) {
			console.log(e)
			alert('Unable to connect. Please, try again.')
			// TODO: handle unable to connect
		}
	}
}