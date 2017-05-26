import React from "react"
import Modal from "./Modal"
import moment from 'moment'
import config from '../config'
import { generateTopicLabel, generateSecurityAlertLabel } from '../utils/helper'
import '../stylesheets/security-alerts-popup.scss'

class SecurityAlertsPopup extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			openned: false
		}
	}

	shouldComponentUpdate (nextProps, nextState) {
		return (
			JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
			JSON.stringify(nextState) !== JSON.stringify(this.state)
		)
	}

	toggle (openned) {
		this.setState({ openned })
	}

	formatDate (timestamp) {
		if (parseInt(timestamp, 10)) {
			return moment(timestamp, 'x').format('HH:mm, DD MMM YYYY')
		}

		return 'Unspecified date'
	}

	getAlertsCount () {
		let count = 0

		const alertsByDeviceId = this.props.securityAlerts
		Object.keys(alertsByDeviceId).map((deviceId) => {
			const alertsByTopics = alertsByDeviceId[deviceId]
			Object.keys(alertsByTopics).map((topic) => {
				count += Object.keys(alertsByTopics[topic]).length
			})
		})

		return count
	}

	renderAlerts () {
		const alertsByDeviceId = this.props.securityAlerts

		return Object.keys(alertsByDeviceId).map((deviceId) => {
			const alertsByTopics = alertsByDeviceId[deviceId]

			/* render <li> element for every deviceId with alerts */
			return (
				<li key={`alerts-${deviceId}`}>
					<span className='alert-device-id-label'># {deviceId}</span>
					
					{
						/* for every topic in the securityAlerts by deviceId */
						Object.keys(alertsByTopics).map((topic) => (
							<div key={`alerts-${deviceId}-${topic}`}>
								{ generateTopicLabel(topic) }
								{
									/* for every alert in the securityAlerts by topics */
									Object.keys(alertsByTopics[topic])
										.sort()
										.reverse()
										.map((timestamp) => (
											<div key={`alerts-${deviceId}-${topic}-${timestamp}`}>
												<div className='alert-time'>
													{ this.formatDate(timestamp) }
												</div>
												<div className='alert-label'>
													{
														generateSecurityAlertLabel({
															topic,
															value: alertsByTopics[topic][timestamp].value
														})
													}
												</div>
											</div>
										))
								}
							</div>
						))
					}
				</li>
			)
		})
	}

	render () {
		const alertsCount = this.getAlertsCount()
		const hasAlerts = alertsCount > 0

		if (hasAlerts && this.state.openned) {
			return (
				<Modal
					wrapperCssClass='security-alert-popup'
					onTap={this.toggle.bind(this, false)}>
					<div className='security-alert-title'>
						<div>
							Security Alerts ({alertsCount})
						</div>
						<span
							onClick={ this.toggle.bind(this, false) }
							className='close-button'></span>
					</div>
					<ul className='alerts-list'>
						{ this.renderAlerts() }
					</ul>
				</Modal>
			)
		}

		if (hasAlerts) {
			return (
				<div className='security-alerts-balloon'
					onClick={this.toggle.bind(this, true)}>
					{ alertsCount }
				</div>
			)
		}

		return null
	}
}

SecurityAlertsPopup.PropTypes = {
	securityAlerts: React.PropTypes.object.isRequired
}

SecurityAlertsPopup.defaultProps = {
	securityAlerts: {}
}

export default SecurityAlertsPopup