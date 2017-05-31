const config = {
	mqtt: {
		allowedReconnects: 40
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
		connectivity: '#34495e',
		danger: '#e74c3c'
	},
	sensorValuesLimits: {
		'connectivity': 0,
		'motion': 1,
		'gas': 55
	}
}

export default config