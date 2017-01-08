import { take, call, put } from 'redux-saga/effects';
import PahoMQTT from 'paho.mqtt.js'
import { store } from '../store'
import config from '../config'
import * as actions from '../actions'

const _pahoMqttConnect = ({username, password}) => {
	return new Promise ((resolve, reject) => {
		const { host, port } = config.mqtt
		const client = new PahoMQTT.Client(host, port, '_234112123123')

		client.onMessageArrived = (message) => {
			const topicData = message.destinationName.split('/')

			alert(message.payloadString)

			store.dispatch(actions.messageArrived({
				deviceId: topicData[0],
				topic: topicData[1],
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

export function* connect(action) {
	while (true) {
		const action = yield take(actions.CONNECT_MQTT)
		// check if user is logged

		try {
			const { client } = yield call(_pahoMqttConnect, action)

			// get existing devices, subscribe to all
			client.subscribe('test-node-01/#')

			// take adding new devices, subscribe to them
			// take logout actions, disconnect client
		} catch (e) {
			console.log(e)
			alert('unable to connect')
			// TODO: handle unable to connect
		}
	}
}