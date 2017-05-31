import assert from 'assert'
import user from '../../src/reducers/user'
import { defaultState } from '../../src/reducers/user'

describe('Testing the user reducer', function () {

	it('should update properly the logging flag on CONNECT_MQTT action', function () {
		const mockedAction = {
			type: 'CONNECT_MQTT',
			username: 'unit_test',
			password: 'qwerty',
			broker: 'some.mqtt.broker.com',
			port: 3033
		}

		const state = user(undefined, {
			...mockedAction,
			reconnect: true
		})

		assert.deepEqual(state, {
			...defaultState,
			logging: false
		})

		// when it is not reconnect logging flag should be true

		const nextState = user(undefined, {
			...mockedAction,
			reconnect: false
		})

		assert.deepEqual(nextState, {
			...defaultState,
			logging: true
		})
	})

	it('should properly store user data after login', function () {
		const mockedAction = {
			type: 'USER_LOGGED',
			username: 'test_username',
			broker: 'test_broker',
			port: 9999
		}

		const state = user(undefined, mockedAction)

		assert.deepEqual(state, {
			...defaultState,
			username: mockedAction.username,
			reconnecting: false,
			logging: false,
			logged: true
		})
	})

	it('should properly update logging flag when login failed', function () {
		const mockedAction = {
			type: 'LOGIN_FAILED'
		}

		const state = user(undefined, mockedAction)
		assert.deepEqual(state, {
			...defaultState,
			logging: false
		})
	})

	it('should properly update reconnecting flag when connection was lost', function () {
		const mockedAction = {
			type: 'CONNECTION_LOST'
		}

		const state = user(undefined, mockedAction)
		assert.deepEqual(state, {
			...defaultState,
			reconnecting: true
		})
	})

	it('should return the defaultState when user logouts', function () {
		const state = user(undefined, {
			type: 'USER_LOGOUT'
		})

		assert.deepEqual(state, defaultState)
	})
})