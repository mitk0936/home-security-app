import { browserHistory } from 'react-router'
import { take, put, call, select } from 'redux-saga/effects'
import * as actions from '../actions'
import { user } from '../selectors'

import config from '../config'

export const redirect = function* () {
	while (true) {
		const { payload } = yield take(actions.ROUTER_UPDATE)
		const { logged } = yield select(user)

		switch (payload.pathname) {
			case (config.paths.login):		
				
				if (logged) {
					yield put(actions.navigate(config.paths.devices))
				}

				break;
			case (config.paths.devices):
				
				if (!logged) {
					yield put(actions.navigate(config.paths.login))
				}

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