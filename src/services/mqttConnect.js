import PahoMQTT from 'paho.mqtt.js'
import config from '../config'

/*
	Makes a connection to the broker via PahoMQTT library.
	Returns a promise.
*/
export function pahoMqttConnect ({ username, password, broker, port }, onMessageArrived, onConnectionLost) {
	return new Promise ((resolve, reject) => {
		const clientId = `client-${parseInt(Math.random() * 10000)}`
		const client = new PahoMQTT.Client(broker, parseInt(port, 10), clientId)

		client.onMessageArrived = onMessageArrived
		client.onConnectionLost = onConnectionLost

		client.connect({
			useSSL: true,
			userName: username,
			password,
			keepAliveInterval: 10,
			onSuccess: () => resolve({ client }),
			onFailure: () => reject({ error: 'login failed' })
		})
	})
}