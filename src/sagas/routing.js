import { browserHistory } from 'react-router'
import { take, put, call } from 'redux-saga/effects'
import * as actions from '../actions'

import config from '../config'

export const redirect = function* () {
	while (true) {
		const { payload } = yield take(actions.ROUTER_UPDATE)

		switch (payload.pathname) {
			case (config.paths.login):
				// TODO: check here, if user is logged
				// yield put(actions.navigate(config.paths.devices))
				break;
			case (config.paths.devices):
				break;
			default:
				yield put(actions.navigate(config.paths.login))
		}
	}
}

export const navigate = function* () {
	while (true) {
		const { pathname } = yield take(actions.NAVIGATE)
		yield browserHistory.push(pathname)
	}
}