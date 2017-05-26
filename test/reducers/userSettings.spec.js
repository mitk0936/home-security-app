import assert from 'assert'

import {
	defaultCachedState,
	userCachedData,
	userAlertsSettings
} from '../../src/reducers/userSettings'

describe('Testing the userCachedData reducer', function () {
	it('should properly store user data after login', function () {
		const mockedAction = {
			type: 'USER_LOGGED',
			username: 'test_username',
			broker: 'test_broker',
			port: 9999
		}

		const state = userCachedData(undefined, mockedAction)

		assert.deepEqual(state, {
			username: mockedAction.username,
			broker: mockedAction.broker,
			port: mockedAction.port
		})
	})
})

describe('Testing the userAlertsSettings reducer', function () {
	it('should properly store the user alerts settings', function () {
		const mockedAction = {
			type: 'SET_USER_ALERTS_SETTINGS',
			settings: {
				'device-id-test': true
			}
		}

		const state = userAlertsSettings(undefined, mockedAction)
		assert.deepEqual(state, mockedAction.settings)
	})

	it('should properly update the user alerts settings', function () {
		const state1 = userAlertsSettings(undefined, {
			type: 'UPDATE_USER_ALERTS_SETTINGS',
			deviceId: 'test-device-02',
			flag: false
		})

		const state2 = userAlertsSettings(state1, {
			type: 'UPDATE_USER_ALERTS_SETTINGS',
			deviceId: 'test-device-01',
			flag: true
		})

		const state3 = userAlertsSettings(state2, {
			type: 'UPDATE_USER_ALERTS_SETTINGS',
			deviceId: 'test-device-02',
			flag: true
		})

		assert.deepEqual(state3, {
			'test-device-01': true,
			'test-device-02': true
		})
	})
})