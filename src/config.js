const config = {
	mqtt: {
		host: 'm21.cloudmqtt.com',
		port: 30247
	},
	paths: {
		login: '/',
		devices: '/devices'
	},
	topics: {
		data: {
			'connectivity': 'connectivity',
			'motion': 'motion',
			'temp-hum': 'temperature-hummidity'
		}
	}
}

export default config