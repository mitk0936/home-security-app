import React from "react"
import { connect } from "react-redux"

import { userLogout } from '../actions'

import Device from '../components/Device/'

export class DevicesList extends React.Component {
		
	logout () { }

	render () {
		const { messages } = this.props

		return (
			<div>
				<a onClick={this.logout.bind(this)}>Logout</a>
				<ul>
					{
						Object.keys(messages).map((deviceId) => (
							<Device
								deviceId={ deviceId }
								messagesByTopics={ messages[deviceId] } />
						))
					}
				</ul>
			</div>
		)
	}
}

DevicesList.propTypes = {

}

function mapStateToProps (state, ownProps) {
	return {
		messages: state.user.messages
	}
}

export default connect(mapStateToProps, {
	userLogout
})(DevicesList);
