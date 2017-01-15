import React from "react"
import { connect } from "react-redux"

import { userLogout } from '../actions'

export class DevicesList extends React.Component {
		
	logout () {

	}

	renderMessages () {
		return this.props.messages.map(({ deviceId, topic, message }, index) => (
			<li key={index}>
				{`DeviceId: ${deviceId} Topic: ${topic} Message: ${JSON.stringify(message.value)}`}
			</li>
		))
	}

	render () {
		return (
			<div>
				<a onClick={this.logout.bind(this)}>Logout</a>
				<ul>
					{ this.renderMessages() }
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
