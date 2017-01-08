function action(type, payload = {}) {
	return {type, ...payload}
}

// router actions definitions
export const ROUTER_UPDATE = 'ROUTER_UPDATE'
export const NAVIGATE = 'NAVIGATE'

// mqtt actions definitions
export const CONNECT_MQTT = 'CONNECT_MQTT'
export const USER_LOGGED = 'USER_LOGGED'
export const MESSAGE_ARRIVED = 'MESSAGE_ARRIVED'
export const CONNECTION_LOST = 'CONNECTION_LOST'

// router actions
export const navigate = (pathname) => action(NAVIGATE, { pathname })
export const routerUpdate = (location) => action(ROUTER_UPDATE, {
	payload: {
		pathname: location.pathname
	}
})

// mqtt actions
export const connectMqtt = ({username, password}) => action(CONNECT_MQTT, {username, password})
export const userLogged = ({username}) => action(USER_LOGGED, {username})
export const messageArrived = ({deviceId, topic, message}) => action(MESSAGE_ARRIVED, { deviceId, topic, message })
export const connectionLost = () => action(CONNECTION_LOST)
