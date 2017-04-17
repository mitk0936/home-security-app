import React from "react"

import { connect } from "react-redux"
import { userLogout } from '../actions'

import '../stylesheets/app-header.scss'

export class AppHeader extends React.Component {
	render () {
		return (
			<div className='app-header'>
				<h1 className='header-title'>
					Your devices
				</h1>
				<a onClick={ this.props.userLogout } className='logout-link'>
					Logout
				</a>
			</div>
		)
	}
}

function mapStateToProps (state, ownProps) {
	return {}
}

export default connect(mapStateToProps, {
	userLogout
})(AppHeader);