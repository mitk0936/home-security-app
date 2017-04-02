import React from "react"

import { connect } from "react-redux"
import moment from 'moment'

import AppHeader from '../components/AppHeader'
import Device from '../components/Device/'
import config from '../config'

export class MainScreen extends React.Component {
	constructor (props) {
		super(props)

		this.updateAllReferences = this.updateAllReferences.bind(this)
		this.updateReferenceByDeviceId = this.updateReferenceByDeviceId.bind(this)
		this.logout = this.logout.bind(this)

		this.deviceReferences = {}
		this.intervalUpdate = null
	}

	componentWillMount () {
		this.intervalUpdate = setInterval(this.updateAllReferences, 20 * 1000) // ms
	}

	addDeviceReference (deviceId, ref) {
		this.deviceReferences[deviceId] = ref
		this.updateReferenceByDeviceId(deviceId)
	}

	updateReferenceByDeviceId (deviceId) {
		const { deviceReferences } = this
		
		if (deviceReferences[deviceId]) {

			const lastMotionTimestamp = this.props.devicesState[deviceId][config.topics.data.motion]
			const lastMotionSecondsAgo = moment().utc().unix() - parseInt(lastMotionTimestamp)
			const newLastMotionLabel = `${moment.duration(lastMotionSecondsAgo, 'seconds').humanize()} ago`

			const deviceStateHasChanged = (
				newLastMotionLabel !== deviceReferences[deviceId].state.lastMotionDetectedLabel
			)

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
		const { messages, devicesState, reconnecting } = this.props

		return (
			<section>
				<AppHeader />
				
				<ul className='devices-list'>
					{
						Object.keys(messages).map((deviceId) => (
							<Device
								ref={ this.addDeviceReference.bind(this, deviceId) }
								key={ deviceId }
								deviceId={ deviceId }
								deviceState= { devicesState[deviceId] }
								messagesByTopics={ messages[deviceId] } />
						))
					}
				</ul>

				{ reconnecting ? this.renderReconnectingOverlay() : null }
			</section>
		)
	}

	componentWillUnmount () {
		this.deviceReferences = {}
	}

	logout () { }	
}

MainScreen.propTypes = {
	devicesState: React.PropTypes.object.isRequired,
	messages: React.PropTypes.object.isRequired
}

function mapStateToProps (state, ownProps) {
	return {
		devicesState: state.user.devicesState,
		messages: state.user.messages,
		reconnecting: state.user.reconnecting
	}
}

export default connect(mapStateToProps, {})(MainScreen);
