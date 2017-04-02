import PahoMQTT from 'paho.mqtt.js'
import config from '../config'

export function pahoMqttConnect ({ username, password }, onMessageArrived, onConnectionLost) {
	return new Promise ((resolve, reject) => {
		const clientId = `client-${parseInt(Math.random() * 10000)}`
		const { host, port } = config.mqtt
		const client = new PahoMQTT.Client(host, port, clientId)

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