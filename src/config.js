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
	},
	colors: {
		temperature: '#d35400',
		humidity: '#3498db',
		gas: '#7f8c8d',
		motion: '#c0392b',
		connectivity: '#34495e'
	},
	sensorValuesLimits: {
		'motion': 1,
		'gas': 47
	}
}

export default config