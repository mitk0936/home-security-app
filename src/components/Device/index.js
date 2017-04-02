import React from 'react'
import Gauge from '../charts/Gauge'
import Timeline from '../charts/Timeline'
import { UTCToLocalTime } from '../../utils/time'
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
			JSON.stringify(nextProps.deviceState) !== JSON.stringify(this.props.deviceState) ||
			JSON.stringify(nextState) !== JSON.stringify(this.state)
		)
	}

	getCurrentDate (timestamp) {
		var d = new Date(0)
		d.setUTCSeconds(timestamp)
		return UTCToLocalTime(d).getTime()
	}

	generateConnectivitySeriesFlags () {
		const connectionFlagsData = []

		const connectionMessages = this.props.messagesByTopics[config.topics.data.connectivity]

		connectionMessages && Object.keys(connectionMessages).map((timestamp) => {
			if (connectionMessages[timestamp].value) {
				connectionFlagsData.push({
					x: this.getCurrentDate(timestamp),
					title: 'Online'
				})
			}
		})

		return connectionFlagsData
	}

	generateMotionSeriesFlags () {
		const motionFlagsData = []

		const motionMessages = this.props.messagesByTopics[config.topics.data.motion]

		motionMessages && Object.keys(motionMessages).map((timestamp) => {
			if (motionMessages[timestamp].value == 1) {
				motionFlagsData.push({
					x: this.getCurrentDate(timestamp),
					title: 'Motion'
				})
			}
		})

		return motionFlagsData
	}

	generateTempHumSeriesData () {
		const 	tempSeriesData = [],
				humiditySeriesData = []

		const tempHumMessages = this.props.messagesByTopics[config.topics.data['temp-hum']]

		tempHumMessages && Object.keys(tempHumMessages).map((timestamp) => {
			if (tempHumMessages[timestamp].value) {
				tempSeriesData.push([this.getCurrentDate(timestamp), tempHumMessages[timestamp].value.temperature ])
				humiditySeriesData.push([this.getCurrentDate(timestamp), tempHumMessages[timestamp].value.humidity ])
			}
		})

		return { tempSeriesData, humiditySeriesData }
	}

	generateGasSeriesData () {
		const gasSeriesData = []
		const gasFlagsData = []

		const gasMessages = this.props.messagesByTopics[config.topics.data.gas]

		gasMessages && Object.keys(gasMessages).map((timestamp) => {
			(gasMessages[timestamp].value > 40) && gasFlagsData.push({
				x: this.getCurrentDate(timestamp),
				y: gasMessages[timestamp].value,
				id: timestamp,
				title: 'Smoke'
			})

			gasSeriesData.push([this.getCurrentDate(timestamp), gasMessages[timestamp].value ])
		})

		return { gasSeriesData, gasFlagsData }
	}

	render () {
		const { messagesByTopics, deviceId, deviceState } = this.props
		
		const isConnected = deviceState[config.topics.data.connectivity]
		const lastDhtData = deviceState[config.topics.data['temp-hum']]
		const lastGasData = deviceState[config.topics.data.gas]

		const { tempSeriesData, humiditySeriesData } = this.generateTempHumSeriesData()
		const { gasSeriesData, gasFlagsData } = this.generateGasSeriesData()
		const motionFlagsData = this.generateMotionSeriesFlags()
		const connectionFlagsData = this.generateConnectivitySeriesFlags()

		return (
			<li className='device-container'>
				<div className='device-graphics-container'>
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
						<Timeline
							id={`test-timeline-${deviceId}`}
							title='Timeline data from sensors'
							seriesData={ [humiditySeriesData, gasSeriesData, tempSeriesData, gasFlagsData, motionFlagsData, connectionFlagsData] } />
					</div>
					<div className='gauges-container'>
						<Gauge id={`gas-${deviceId}`} title="Smoke concentration" metric='%'
							color='#777'
							value={ lastGasData } />
						<Gauge id={`${deviceId}`} title="Temperature" metric='&deg;C'
							color='#FF9933'
							value={ lastDhtData.temperature } />
						<Gauge id={`hum-${deviceId}`} title="Humidity" metric='%'
							color='#99CCFF'
							value={ lastDhtData.humidity } />
					</div>
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
			React.PropTypes.object  // can be null
		]),
		[config.topics.data['temp-hum']]: React.PropTypes.shape({
			temperature: React.PropTypes.number.isRequired,
			humidity: React.PropTypes.number.isRequired
		}).isRequired
	}).isRequired,
	messagesByTopics: React.PropTypes.object.isRequired
}

export default Device