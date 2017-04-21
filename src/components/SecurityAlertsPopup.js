import React from "react"
import Modal from "./Modal"
import moment from 'moment'
import config from '../config'
import { generateSecurityAlertLabel } from '../utils/helper'
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

	toggle (state) {
		this.setState({
			openned: state
		})

		if (!state) {
			this.props.onClose()
		}
	}

	formatDate (timestamp) {
		if (parseInt(timestamp, 10)) {
			return moment(timestamp, 'x').format('HH:mm, DD MMM YYYY')
		}

		return 'Unspecified date'
	}

	getLabel (timestamp) {
		const { topic, deviceId, value } = this.props.securityAlerts[timestamp]
		return generateSecurityAlertLabel({ topic, deviceId, value })
	}

	render () {
		const alertsCount = Object.keys(this.props.securityAlerts).length
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
					</div>
					<ul className='alerts-list'>
						{
							Object.keys(this.props.securityAlerts)
								.sort()
								.reverse()
								.map((timestamp) => (
									<li key={ timestamp }>
										<div className='alert-time'>
											{ this.formatDate(timestamp) }
										</div>
										<div className='alert-label'>
											{ this.getLabel(timestamp) }
										</div>
									</li>
								))
						}
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
	securityAlerts: React.PropTypes.object.isRequired,
	onClose: React.PropTypes.func.isRequired
}

SecurityAlertsPopup.defaultProps = {
	securityAlerts: {}
}

export default SecurityAlertsPopup