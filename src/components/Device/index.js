import React from 'react'
import Gauge from '../charts/Gauge'

import config from '../../config'

import '../../stylesheets/device.scss'

class Device extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			lastMotionDetectedLabel: 'N/A'
		}
	}

	shouldComponentUpdate (nextProps, nextState) {
		return (
			JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
			JSON.stringify(nextState) !== JSON.stringify(this.state)
		)
	}

	render () {
		const { messagesByTopics, deviceId, deviceState } = this.props
		
		const isConnected = deviceState[config.topics.data.connectivity]
		const lastDhtData = deviceState[config.topics.data['temp-hum']]
		const lastGasData = deviceState[config.topics.data.gas]

		const gaugeWidth = 200
		const gaugeHeight = gaugeWidth * 0.7
		const valueSize = gaugeWidth / 15

		return (
			<li className='device-container clearfix'>
				<div className='device-data-container'>
					<div className='device-name-label'>
						<b>Device:</b> { deviceId }
					</div>
					<div className='device-connectivity'>
						<span className='device-connectivity-value'>
							{ isConnected ? 'Online' : 'Offline' }
						</span>
					</div>
					<div className='device-last-motion'>
						<b>Last motion detected: </b>
						<span className='device-last-motion-value'>
							{ this.state.lastMotionDetectedLabel }
						</span>
					</div>
				</div>
				<div className='gauges-container'>
					<Gauge id={`${deviceId}`} title="Temp" metric='&deg;C'
						minValue={ 0 }
						maxValue={ 100 }
						width={ gaugeWidth }
						height={ gaugeHeight }
						valueSize={ valueSize }
						value={ lastDhtData.temperature } />

					<Gauge id={`hum-${deviceId}`} title="Humidity" metric='%'
						minValue={ 0 }
						maxValue={ 100 }
						width={ gaugeWidth }
						height={ gaugeHeight }
						valueSize={ valueSize }
						value={ lastDhtData.humidity }
						stops={[
							[0.1, '#DF5353'], // red
							[0.2, '#DDDF0D'], // yellow
							[0.9, '#3399FF'] // blue
						]} />

					<Gauge id={`gas-${deviceId}`} title="Smoke concentration" metric='%'
						minValue={ 0 }
						maxValue={ 100 }
						width={ gaugeWidth }
						height={ gaugeHeight }
						valueSize={ valueSize }
						value={ lastGasData }
						stops= {[
							[0.1, '#DDD'],
							[0.6, '#777'],
							[0.9, '#000'],
						]} />
				</div>
			</li>
		)
	}
}

Device.propTypes = {
	deviceId: React.PropTypes.string.isRequired,
	deviceState: React.PropTypes.shape({
		[config.topics.data.connectivity]: React.PropTypes.bool.isRequired,
		[config.topics.data.motion]: React.PropTypes.oneOfType([
			React.PropTypes.number, // can be timestamp number
			React.PropTypes.string, // can be timestamp string
			React.PropTypes.object // can be null
		]),
		[config.topics.data['temp-hum']]: React.PropTypes.shape({
			temperature: React.PropTypes.number.isRequired,
			humidity: React.PropTypes.number.isRequired
		}).isRequired
	}).isRequired,
	messagesByTopics: React.PropTypes.object.isRequired
}

export default Device