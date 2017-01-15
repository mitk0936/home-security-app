import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import '../../stylesheets/common/modal.scss'

class Modal extends Component {

	constructor (props, context) {
		super(props, context)
		
		this.state = { scrollYPostion: 0 }
		this.componentId = 'modal'

		this.onTapModal = this.onTapModal.bind(this)
	}

	componentWillMount () {
		this.setState({
			scrollYPostion: window.scrollY
		})
	}

	componentDidMount () {
		this.modalTarget = document.createElement('div')
		this.modalTarget.id = this.componentId

		document.body.appendChild(this.modalTarget)
		document.body.className = (document.body.className + ' modal-open').trim()
		document.body.style.top = `-${this.state.scrollYPostion}px`

		this._render(this.props)
		this.modalTarget.addEventListener('click', this.onTapModal)
	}

	componentWillUpdate (nextProps, nextState) {
		this._render(nextProps)
	}

	componentWillUnmount () {
		ReactDOM.unmountComponentAtNode(this.modalTarget)

		document.body.removeChild(this.modalTarget)
		document.body.className = document.body.className.replace(/\bmodal-open\b/, '').trim()
		document.body.style.top = 0

		window.scrollTo(0, this.state.scrollYPostion)
	}

	onTapModal (event) {
		( event.target.id === this.componentId ) && this.props.onTap()
	}

	_render (props) {
		ReactDOM.render(
			<div
				onClick={ this.onTapModal }
				className={ props.wrapperCssClass }>
				{ props.children }
			</div>,
			this.modalTarget
		)
	}

	render () {
		return <div className={`modal-placeholder ${this.props.placeholderCssClass}`}> &nbsp; </div>
	}
}

Modal.PropTypes = {
	wrapperCssClass: PropTypes.string,
	placeholderCssClass: PropTypes.string,
	onTap: PropTypes.func
}

Modal.defaultProps = {
	wrapperCssClass: '',
	placeholderCssClass: '',
	onTap: () => ''
}

export default Modal
