import PahoMQTT from 'paho.mqtt.js'
import config from '../config'

export function pahoMqttConnect ({ username, password }, onMessageArrived, onConnectionLost) {
	return new Promise ((resolve, reject) => {
		const { host, port } = config.mqtt
		const client = new PahoMQTT.Client(host, port, '_234112123123')

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