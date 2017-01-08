import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

export class DevicesList extends React.Component {
	renderMessages () {
		return this.props.messages.map(({ deviceId, topic, message }, index) => {
			return (
				<li key={index}>
					{`DeviceId: ${deviceId} Topic: ${topic} Message: ${JSON.stringify(message.value)}`}
				</li>
			)
		})
	}

	render () {
		return (
			<ul>
				{ this.renderMessages() }
			</ul>
		)
	}
}

function mapStateToProps (state, ownProps) {
	return {
		messages: state.user.messages
	}
}

export default connect(mapStateToProps)(DevicesList);
