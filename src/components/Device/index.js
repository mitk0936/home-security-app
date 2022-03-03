import React from 'react'
import Gauge from '../charts/Gauge'
import Timeline from '../charts/Timeline'
import { UTCToLocalTime } from '../../utils/time'
import config from '../../config'
import OnOffSwitch from '../OnOffSwitch'
import '../../stylesheets/device.scss'

class Device extends React.Component {
  constructor (props) {
    super(props)
    this.state = { lastMotionDetectedLabel: 'N/A' }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
  }

  /* generateConnectivitySeriesFlags: Function used to generate,
    data structure for the line graphic for connectivity (Online) flags.
    Returns an array of objects: [{
      x: Timestamp value in local time,
      title: 'Online'
    }...]
  */
  generateConnectivitySeriesFlags () {
    const connectionFlagsData = []
    const connectionMessages = this.props.messagesByTopics[config.topics.data.connectivity]

    connectionMessages && Object.keys(connectionMessages).map((timestamp) => {
      const messageNotRetained = !connectionMessages[timestamp].retained
      const isOnlineMessage = connectionMessages[timestamp].value == 1

      if (isOnlineMessage || messageNotRetained) {
        connectionFlagsData.push({
          x: UTCToLocalTime(timestamp),
          title: isOnlineMessage ? 'Online' : 'Offline'
        })
      }
    })

    return connectionFlagsData
  }

  /* generateMotionSeriesFlags: Function used to generate,
    data structure for the line graphic for motion detected (Motion) flags.
    Returns an array of objects: [{
      x: Timestamp value in local time,
      title: 'Motion'
    }...]
  */
  generateMotionSeriesFlags () {
    const motionFlagsData = []
    const motionMessages = this.props.messagesByTopics[config.topics.data.motion]

    motionMessages && Object.keys(motionMessages).map((timestamp) => {
      if (motionMessages[timestamp].value == config.sensorValuesLimits.motion) {
        motionFlagsData.push({
          x: UTCToLocalTime(timestamp),
          title: 'Motion'
        })
      }
    })

    return motionFlagsData
  }

  /* generateTempHumSeriesData: Function used to generate,
    data structure for the line graphic for temperature and humidity.
    Returns an object with two arrays:
    {
      tempSeriesData: [[localTime, temperatureValue]...],
      humiditySeriesData: [[localTime, humidityValue]...]
    }
  */
  generateTempHumSeriesData () {
    const   tempSeriesData = [],
        humiditySeriesData = [],
        tempHumMessages = this.props.messagesByTopics[config.topics.data['temp-hum']]

    tempHumMessages && Object.keys(tempHumMessages).map((timestamp) => {
      const localTime = UTCToLocalTime(timestamp)

      if (tempHumMessages[timestamp].value) {
        tempSeriesData.push([localTime, tempHumMessages[timestamp].value.temperature ])
        humiditySeriesData.push([localTime, tempHumMessages[timestamp].value.humidity ])
      }
    })

    return { tempSeriesData, humiditySeriesData }
  }

  /* generateGasSeriesData: Function used to generate,
    data structure for the line graphic for gas levels data.
    Returns an object with two arrays:
    {
      gasSeriesData: [[localTime, gasLevelValue]...],
      gasFlagsData: [{
        x: localTime,
        y: 100, -> always on top of the graphic
        id: timestamp,
        title: 'Smoke'
      }...]
    }
  */
  generateGasSeriesData () {
    const gasSeriesData = []
    const gasFlagsData = []
    const gasMessages = this.props.messagesByTopics[config.topics.data.gas]

    gasMessages && Object.keys(gasMessages).map((timestamp) => {
      const localTime = UTCToLocalTime(timestamp)

      gasMessages[timestamp].value >= config.sensorValuesLimits.gas ?
        gasFlagsData.push({
          x: localTime,
          y: 100, // gasMessages[timestamp].value,
          id: timestamp,
          title: 'High gas level'
        }) : null

      gasSeriesData.push([localTime, gasMessages[timestamp].value ])
    })

    return { gasSeriesData, gasFlagsData }
  }

  render () {
    const { messagesByTopics, deviceId, deviceState, securityAlerts, onUserAlertsChange } = this.props

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
            <div className={`device-data-text ${ isConnected ? 'online' : '' }`}>
              <div className='device-name-label'>
                <b>#</b> { deviceId }
              </div>
              <div className='device-connectivity'>
                <span className='device-connectivity-value'>
                  { isConnected ? 'Online' : 'Offline' }
                </span>
              </div>
              <div className='device-last-motion'>
                <b>Motion: </b>
                <span className='device-last-motion-value'>
                  { this.state.lastMotionDetectedLabel }
                </span>
              </div>
            </div>
            {
            	false && (
            		<div className='security-alert-option'>
		              Security Alerts
		              <OnOffSwitch
		                id={`security-switch-${deviceId}`}
		                checked={securityAlerts}
		                onChange={onUserAlertsChange}/>
		            </div>
            	)
            }
            <Timeline
              id={`test-timeline-${deviceId}`}
              seriesData={[
                humiditySeriesData,
                tempSeriesData,
                gasSeriesData,
                gasFlagsData,
                motionFlagsData,
                connectionFlagsData
              ]} />
          </div>
          <div className='gauges-container'>
            <Gauge id={`gas-${deviceId}`} title="Gas level" metric='%'
              dangerMinValue={ config.sensorValuesLimits.gas }
              color={config.colors.gas}
              value={ lastGasData } />
            <Gauge id={`${deviceId}`} title="Temperature" metric='&deg;C'
              color={config.colors.temperature}
              value={ lastDhtData.temperature } />
            <Gauge id={`hum-${deviceId}`} title="Humidity" metric='%'
              color={config.colors.humidity}
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
  messagesByTopics: React.PropTypes.object.isRequired,
  securityAlerts: React.PropTypes.bool.isRequired,
  onUserAlertsChange: React.PropTypes.func.isRequired
}

export default Device
