function action(type, payload = {}) {
	return {type, ...payload}
}

export const ROUTER_UPDATE = 'ROUTER_UPDATE'
export const NAVIGATE = 'NAVIGATE'

export const CONNECT_MQTT = 'CONNECT_MQTT'
export const MESSAGE_ARRIVED = 'MESSAGE_ARRIVED'
export const CONNECTION_LOST = 'CONNECTION_LOST'

export const navigate = (pathname) => action(NAVIGATE, { pathname })
export const routerUpdate = (location) => action(ROUTER_UPDATE, {
	payload: {
		pathname: location.pathname
	}
})

export const connectMqtt = ({username, password}) => action(CONNECT_MQTT, {username, password})
export const messageArrived = ({deviceId, topic, message}) => action(MESSAGE_ARRIVED, { deviceId, topic, message })
export const connectionLost = () => action(CONNECTION_LOST)