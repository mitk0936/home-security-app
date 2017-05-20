import config from '../config'

export const generateTopicLabel = (topic) => {
	switch (topic) {
		case config.topics.data.connectivity:
			return 'Connectivity'
		case config.topics.data.gas:
			return 'Gas level'
		case config.topics.data.motion:
			return 'Motion'
	}
}

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