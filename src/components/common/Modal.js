import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../../stylesheets/common/modal.scss'

class Modal extends Component {

	constructor (props, context) {
		super(props, context)
		
		this.state = {
			scrollYPostion: 0
		}

		this.onTapModal = this.onTapModal.bind(this)
	}

	componentWillMount () {
		this.setState({
			scrollYPostion: window.scrollY
		})
	}

	componentDidMount () {
		this.modalTarget = document.createElement('div');
		this.modalTarget.className = 'modal';

		document.body.appendChild(this.modalTarget);
		document.body.className += ' modal-open';
		document.body.style.top = `-${this.state.scrollYPostion}px`

		this._render(this.props);
		this.modalTarget.addEventListener('click', this.onTapModal);
	}

	componentWillUpdate (nextProps, nextState) {
		this._render(nextProps);
	}

	componentWillUnmount() {
		ReactDOM.unmountComponentAtNode(this.modalTarget);
		document.body.removeChild(this.modalTarget);

		document.body.className = document.body.className.replace(/\bmodal-open\b/, '')
		document.body.style.top = 0
		
		window.scrollTo(0, this.state.scrollYPostion);
	}

	onTapModal (event) {
		if ( event.target.className === 'modal' ) {
			return this.props.onTap && this.props.onTap();
		}
	}

	_render(props) {
		ReactDOM.render(
			<Provider store={ this.context.store }>
				<div
					onClick={ this.onTapModal }
					className={ props.class }>
					{ props.children }
				</div>
			</Provider>,
			this.modalTarget
		);
	}

	render () {
		return (
			<div className={`modal-placeholder ${this.props.placeholderCssClass}`}>
				&nbsp;
			</div>
		)
	}

}

Modal.PropTypes = {
	// css class
	class: PropTypes.string,
	placeholderCssClass: PropTypes.string,
	// Optional callbacks
	onTap: PropTypes.func
}

Modal.defaultProps = {
	class: '',
	placeholderCssClass: ''
}

Modal.contextTypes = {
	store: React.PropTypes.object.isRequired
}

export default Modal;
