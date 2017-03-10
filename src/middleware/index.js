import { take, fork } from "redux-saga/effects"
import { browserHistory } from 'react-router'

import { watchMqttConnect } from "./mqtt"
import { watchDevicesStatus } from './messages'

import * as actions from '../actions'

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
		fork(watchDevicesStatus),
		fork(watchMqttConnect),
		fork(watchNavigate)
	]
}
