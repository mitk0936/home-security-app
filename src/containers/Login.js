import React from 'react'

import { connect } from 'react-redux'
import { connectMqtt } from '../actions'

import '../stylesheets/login.scss'

class Login extends React.Component {
	constructor (props) {
		super(props)
	}

	componentWillMount () {
		this.setState(Object.assign({}, {
			username: '',
			password: '',
			broker: '',
			port: ''
		}, this.props.userCachedData))
	}

	onInputChange (propName, ev) {
		this.setState({
			[propName]: ev.target.value
		})
	}

	onSubmit (e) {
		const { username, password, broker, port } = this.state
		this.props.connectMqtt({ username, password, broker, port })

		e.preventDefault()
	}

	render () {
		return (
			<div className='login-form'>
				<form type='POST' onSubmit={ this.onSubmit.bind(this) } >
					<input
						value={this.state.username}
						required={true}
						type='text' id='username' name='username' placeholder='Username'
						onChange={ this.onInputChange.bind(this, 'username') }/>
					<input
						required={true}
						type='password' id='password' name='password' placeholder='Password'
						onChange={ this.onInputChange.bind(this, 'password') }/>
					<input
						required={true}
						value={this.state.broker}
						type='text' id='broker' name='broker' placeholder='Broker address'
						onChange={ this.onInputChange.bind(this, 'broker') }/>
					<input
						required={true}
						value={this.state.port}
						type='text' id='port' name='port' placeholder='Port'
						onChange={ this.onInputChange.bind(this, 'port') }/>
					<input type='submit' value='log in'/>
				</form>
			</div>
		)
	}
}

Login.propTypes = {
	userCachedData: React.PropTypes.shape({
		username: React.PropTypes.string.isRequired,
		broker: React.PropTypes.string.isRequired,
		port: React.PropTypes.string.isRequired
	})
}

function mapStateToProps (state) {
	return { userCachedData: state.userCachedData }
}

export default connect(mapStateToProps, { connectMqtt })(Login)