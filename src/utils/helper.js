import config from '../config'

export const generateSecurityAlertLabel = ({topic, value}) => {
	switch (topic) {
		case config.topics.data.connectivity:
			return 'Device went offline'
		case config.topics.data.gas:
			return `High gas level value was measured - ${value}%`
		case config.topics.data.motion:
			return 'Motion was detected'
	}
}