const config = {
	mqtt: {
		host: 'm21.cloudmqtt.com',
		port: 30247,
		allowedReconnects: 10
	},
	paths: {
		login: '/',
		devices: '/devices'
	},
	topics: {
		data: {
			'connectivity': 'connectivity',
			'motion': 'motion',
			'temp-hum': 'temp-hum',
			'gas': 'gas'
		}
	}
}

export default config