import React from 'react';
import Modal from '../components/common/Modal'

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

	onInputChange (propName, e) {
		this.setState({
			[propName]: e.target.value
		})
	}

	onSubmit (e) {
		const { username, password } = this.state
		this.props.connectMqtt({ username, password })

		e.preventDefault()
	}

	render () {
		return (
			<Modal wrapperCssClass="login-modal-wrap">
				<div className='login-form'>
					<form type='POST' onSubmit={this.onSubmit.bind(this)} >
						<div>
							<label htmlFor='username'>username:</label>
							<input type='text' id='username' name='username'
								onChange={ this.onInputChange.bind(this, 'username') }/>
						</div>
						<div>
							<label htmlFor='password'>password:</label>
							<input type='password' id='password' name='password'
								onChange={ this.onInputChange.bind(this, 'password') }/>
						</div>
						<input type='submit' value='login'/>
					</form>
				</div>
			</Modal>
		)
	}
}

function mapStateToProps (state) {
	return {}
}

export default connect(mapStateToProps, { connectMqtt })(Login)