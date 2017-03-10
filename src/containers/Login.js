import React from 'react'

import { connect } from 'react-redux'
import { connectMqtt } from '../actions'

import '../stylesheets/login.scss'

class Login extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			'username': '',
			'password': ''
		}
	}

	onInputChange (propName, ev) {
		this.setState({
			[propName]: ev.target.value
		})
	}

	onSubmit (e) {
		const { username, password } = this.state
		this.props.connectMqtt({ username, password })

		e.preventDefault()
	}

	render () {
		return (
			<div className='login-form'>
				<form type='POST' onSubmit={ this.onSubmit.bind(this) } >
					<input type='text' id='username' name='username' placeholder='Username'
						onChange={ this.onInputChange.bind(this, 'username') }/>
					<input type='password' id='password' name='password' placeholder='Password'
						onChange={ this.onInputChange.bind(this, 'password') }/>
					<input type='submit' value='login'/>
				</form>
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {}
}

export default connect(mapStateToProps, { connectMqtt })(Login)