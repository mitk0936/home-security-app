import React from "react"
import { connect } from "react-redux"
import moment from 'moment'
import { userLogout, updateUserAlertsSettings } from '../actions'
import AppHeader from '../components/AppHeader'
import Loader from '../components/Loader'
import Device from '../components/Device/'
import SecurityAlertsPopup from '../components/SecurityAlertsPopup'
import config from '../config'

export class MainScreen extends React.Component {
	constructor (props) {
		super(props)

		this.updateAllReferences = this.updateAllReferences.bind(this)
		this.updateReferenceByDeviceId = this.updateReferenceByDeviceId.bind(this)

		this.deviceReferences = {}
		this.intervalUpdate = null
	}

	componentWillMount () {
		/* Starting the update interval, which will update last motion label on every component, if needed.
			interval is set to 20sec. */
		this.intervalUpdate = setInterval(this.updateAllReferences, 20 * 1000) // ms
	}
	
	/*
		Called when a new Device component is created.
		Accepts deviceId and reference to the component as parameters.
	*/
	addDeviceReference (deviceId, ref) {
		this.deviceReferences[deviceId] = ref
		this.updateReferenceByDeviceId(deviceId)
	}

	updateReferenceByDeviceId (deviceId) {
		const { deviceReferences } = this
		
		if (deviceReferences[deviceId]) {
			
			/* Calculating the last motion label for the specific device, on every 20 seconds */
			const lastMotionTimestamp = this.props.devicesState[deviceId][config.topics.data.motion]
			const lastMotionSecondsAgo = moment().utc().unix() - parseInt(lastMotionTimestamp)
			const newLastMotionLabel = `${moment.duration(lastMotionSecondsAgo, 'seconds').humanize()} ago`
	
			const deviceStateHasChanged = (
				newLastMotionLabel !== deviceReferences[deviceId].state.lastMotionDetectedLabel
			)
			
			/* If the motion label for the specific device has changed - the component is forced to update */
			if (deviceStateHasChanged) {
				deviceReferences[deviceId].state.lastMotionDetectedLabel = newLastMotionLabel
				deviceReferences[deviceId].forceUpdate()
			}
		}
	}

	updateAllReferences () {
		Object.keys(this.deviceReferences).map(this.updateReferenceByDeviceId)
	}

	renderReconnectingOverlay () {
		return (
			<div className='reconnecting-overlay'>
				<p>
					Reconnecting...
				</p>
			</div>
		)
	}

	render () {
		const { messages, devicesState, reconnecting, securityAlerts, userAlertsSettings } = this.props
		const { updateUserAlertsSettings } = this.props

		return (
			<section>
				<AppHeader onLogout={this.props.userLogout}/>
				
				<ul className='devices-list'>
					{
						Object.keys(messages).length === 0 ? 

						<Loader /> :
						
						Object.keys(messages).map((deviceId) => (
							<Device
								ref={ this.addDeviceReference.bind(this, deviceId) }
								key={ deviceId }
								deviceId={ deviceId }
								securityAlerts={ Boolean(userAlertsSettings[deviceId]) }
								onUserAlertsChange={ (flag) => updateUserAlertsSettings({deviceId, flag}) }
								deviceState= { devicesState[deviceId] }
								messagesByTopics={ messages[deviceId] } />
						))
					}
				</ul>

				{
					reconnecting ?
					this.renderReconnectingOverlay() :
					<SecurityAlertsPopup
						securityAlerts={securityAlerts} />
				}

			</section>
		)
	}

	/*
		Clearing the object with device references,
		when the main screen unmounts
	*/
	componentWillUnmount () {
		this.deviceReferences = {}
	}
}

MainScreen.propTypes = {
	devicesState: React.PropTypes.object.isRequired,
	messages: React.PropTypes.object.isRequired,
	securityAlerts: React.PropTypes.object.isRequired,
	userLogout: React.PropTypes.func.isRequired,
	userAlertsSettings: React.PropTypes.object.isRequired,
	updateUserAlertsSettings: React.PropTypes.func.isRequired
}

function mapStateToProps (state, ownProps) {
	return {
		...state.messagingData,
		reconnecting: state.user.reconnecting,
		userAlertsSettings: state.userAlertsSettings
	}
}

export default connect(mapStateToProps, {
	userLogout, updateUserAlertsSettings
})(MainScreen);
