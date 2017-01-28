import React from 'react'

class Device extends React.Component {
	constructor (props) {
		super(props)
	}

	shouldComponentUpdate (nextProps) {
		return (
			JSON.stringify(nextProps) !== JSON.stringify(this.props)
		)
	}

	render () {
		const { messagesByTopics, deviceId } = this.props
		return (
			<li key={deviceId}>
				{
					Object.keys(messagesByTopics).map((topic) => {
						const messagesByTimestamp = messagesByTopics[topic]

						return Object.keys(messagesByTimestamp).map((timestamp) => (
							<div key={`${deviceId}-${timestamp}`}>
								{`	DeviceId: ${deviceId}
									Topic: ${topic}
									Message:
								`}
								<p>{JSON.stringify(messagesByTimestamp[timestamp].value)}</p>
								<p>{messagesByTimestamp[timestamp].timestamp}</p>
								<p>{messagesByTimestamp[timestamp].retained}</p>
							</div>
						))
					})
				}
			</li>
		)
	}
}

Device.propTypes = {
	deviceId: React.PropTypes.string.isRequired,
	messagesByTopics: React.PropTypes.object.isRequired
}

export default Device