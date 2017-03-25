import React from 'react'
import Gauge from '../charts/Gauge'
import Timeline from '../charts/Timeline'

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

	generateTempHumSeriesData () {
		const 	tempSeriesData = [],
				humiditySeriesData = []

		const tempHumMessages = this.props.messagesByTopics[config.topics.data['temp-hum']]

		tempHumMessages && Object.keys(tempHumMessages).map((timestamp) => {
			if (tempHumMessages[timestamp].value) {
				tempSeriesData.push([timestamp * 1000, tempHumMessages[timestamp].value.temperature ])
				humiditySeriesData.push([timestamp * 1000, tempHumMessages[timestamp].value.humidity ])
			}
		})

		return { tempSeriesData, humiditySeriesData }
	}

	generateGasSeriesData () {
		const gasSeriesData = []

		const gasMessages = this.props.messagesByTopics[config.topics.data.gas]

		gasMessages && Object.keys(gasMessages).map((timestamp) => {
			gasSeriesData.push([timestamp * 1000, gasMessages[timestamp].value ])
		})

		return gasSeriesData
	}

	render () {
		const { messagesByTopics, deviceId, deviceState } = this.props
		
		const isConnected = deviceState[config.topics.data.connectivity]
		const lastDhtData = deviceState[config.topics.data['temp-hum']]
		const lastGasData = deviceState[config.topics.data.gas]

		const gaugeWidth = 200
		const gaugeHeight = gaugeWidth * 0.7
		const valueSize = gaugeWidth / 15

		const { tempSeriesData, humiditySeriesData } = this.generateTempHumSeriesData()
		const gasSeriesData = this.generateGasSeriesData()

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
							seriesData={
								[humiditySeriesData, gasSeriesData, tempSeriesData]
							} />
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