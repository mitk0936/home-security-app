import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

export class DevicesList extends React.Component {
	render () {
		return (
			<div>
				Devises list here:
			</div>
		)
	}
}

function mapStateToProps (state, ownProps) {
	return {}
}

export default connect(mapStateToProps)(DevicesList);
