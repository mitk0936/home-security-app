import { take, fork, put, select } from "redux-saga/effects"
import { takeEvery } from 'redux-saga'
import { browserHistory } from 'react-router'
import { watchMqttConnect } from "./mqtt"
import { watchDevicesStatus, watchNotificationCheck } from './messages'
import { user, userAlertsSettings } from '../selectors'
import * as actions from '../actions'
import config from '../config'

/*
	Middleware watcher for change in security alert settings of the use,
	updates the cached in local device storage,
	data for deviceId and security alerts on/off flag,
	the data is cached by username.
*/
export function* watchUpdateUserAlertsSettings () {
	yield takeEvery(actions.UPDATE_USER_ALERTS_SETTINGS, function* ({ deviceId, flag }) {
		const { username } = yield select(user)
		const userSettings = yield select(userAlertsSettings)

		const currentSettings = JSON.parse(window.localStorage.userAlertsSettings)

		window.localStorage.userAlertsSettings = JSON.stringify(Object.assign({}, currentSettings, {
			[username]: userSettings
		}))
	})
}

/*
	Middleware watcher for user login,
	updates the cached in local device storage,
	data for username, broker and port
*/
export function* watchUserLogin () {
	yield takeEvery(actions.USER_LOGGED, function* ({ username, broker, port }) {
		/* Saving the user login settings in the application localStorage */
		window.localStorage.userCachedData = JSON.stringify({ username, broker, port })

		/* On user login, get the last saved user settings for security alerts */
		let userAlertsSettings = {}

		try {
			const settings = JSON.parse(window.localStorage.userAlertsSettings)
			userAlertsSettings = settings[username] || {}
		} catch (e) {
			console.error(e.message)
			/* If userAlertsSettings is not available in the local storage
				Set default empty object */
			window.localStorage.userAlertsSettings = JSON.stringify({})
		}

		yield put(actions.setUserAlertsSettings({
			settings: userAlertsSettings
		}))

		yield put(actions.navigate(config.paths.devices))
	})
}

/*
	Middleware watcher for navigate actions
*/
const watchNavigate = function* () {
	while (true) {
		const { pathname } = yield take(actions.NAVIGATE)
		yield browserHistory.push(pathname)
	}
}

export function* sagas() {
	yield [
		fork(watchUpdateUserAlertsSettings),
		fork(watchNotificationCheck),
		fork(watchDevicesStatus),
		fork(watchMqttConnect),
		fork(watchNavigate),
		fork(watchUserLogin)
	]
}
