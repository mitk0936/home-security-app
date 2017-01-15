import { take, fork } from "redux-saga/effects"
import { browserHistory } from 'react-router'

import { watchMqttConnect } from "./mqtt"
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
		fork(watchMqttConnect),
		fork(watchNavigate)
	]
}
