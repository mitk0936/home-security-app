const action = (type, payload = {}) => {
	return { type, ...payload }
}

/* Router actions definitions */
export const NAVIGATE = 'NAVIGATE'

export const navigate = (pathname) => action(NAVIGATE, { pathname })

/* MQTT actions definitions */
export const CONNECT_MQTT = 'CONNECT_MQTT'
export const USER_LOGGED = 'USER_LOGGED'
export const MESSAGE_ARRIVED = 'MESSAGE_ARRIVED'
export const CONNECTION_LOST = 'CONNECTION_LOST'
export const USER_LOGOUT = 'USER_LOGOUT'

export const connectMqtt = ({username, password}) => action(CONNECT_MQTT, {username, password})
export const userLogged = ({username}) => action(USER_LOGGED, {username})
export const messageArrived = ({deviceId, topic, message}) => action(MESSAGE_ARRIVED, { deviceId, topic, message })
export const connectionLost = () => action(CONNECTION_LOST)
export const userLogout = () => action(USER_LOGOUT)

/* Messages middleware actions */
export const SET_DEVICE_STATE = 'SET_DEVICE_STATE'

export const setDeviceState = ({deviceId, topic, value}) => action(SET_DEVICE_STATE, {deviceId, topic, value})

