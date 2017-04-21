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
export const SET_USER_ALERTS_SETTINGS = 'SET_USER_ALERTS_SETTINGS'
export const UPDATE_USER_ALERTS_SETTINGS = 'UPDATE_USER_ALERTS_SETTINGS'
export const CLEAR_ALERTS = 'CLEAR_ALERTS'

export const connectMqtt = ({username, password, broker, port, reconnect}) => action(CONNECT_MQTT, {username, password, broker, port, reconnect: Boolean(reconnect)})
export const userLogged = ({ username, broker, port }) => action(USER_LOGGED, { username, broker, port })
export const messageArrived = ({deviceId, topic, message}) => action(MESSAGE_ARRIVED, { deviceId, topic, message })
export const connectionLost = () => action(CONNECTION_LOST)
export const userLogout = () => action(USER_LOGOUT)

/* Messages middleware actions */
export const SET_DEVICE_STATE = 'SET_DEVICE_STATE'
export const PUSH_SECURITY_ALERT = 'PUSH_SECURITY_ALERT'
export const REMOVE_SECURITY_ALERT = 'REMOVE_SECURITY_ALERT'

export const setDeviceState = ({deviceId, topic, value, retained, timestamp}) => action(SET_DEVICE_STATE, {deviceId, topic, value, retained, timestamp})

export const pushSecurityAlert = ({timestamp, deviceId, topic, value, retained}) => action(PUSH_SECURITY_ALERT, {timestamp, deviceId, topic, value, retained})
export const removeSecurityAlert = ({timestamp}) => action(REMOVE_SECURITY_ALERT, {timestamp})
export const setUserAlertsSettings = ({ settings }) => action(SET_USER_ALERTS_SETTINGS, { settings })
export const updateUserAlertsSettings = ({ deviceId, flag }) => action(UPDATE_USER_ALERTS_SETTINGS, { deviceId, flag })
export const clearAlerts = () => action(CLEAR_ALERTS)