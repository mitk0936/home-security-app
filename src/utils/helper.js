import config from '../config'

export const generateSecurityAlertLabel = ({topic, deviceId, value}) => {
	switch (topic) {
		case config.topics.data.connectivity:
			return `#${deviceId} - Device went offline`
		case config.topics.data.gas:
			return `#${deviceId} - High gas concentration value was measured - ${value}%`
		case config.topics.data.motion:
			return `#${deviceId} - Motion was detected`
	}
}