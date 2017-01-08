import React from 'react'
import { connect } from 'react-redux'

import '../stylesheets/app.scss'

export class App extends React.Component {

	componentWillMount () {}

	render () {
		return (
			<div className='app-container'>
				{ this.props.children }
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {}
}

export default connect(mapStateToProps)(App)
