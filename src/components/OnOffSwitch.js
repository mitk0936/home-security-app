import React from 'react'
import '../stylesheets/common/on-off-switch.scss'

const OnOffSwitch = ({id, checked, onChange}) => {
	return (
		<div className="onoffswitch">
			<input
				onChange={(e) => {
					onChange(!checked)
				}}
				type="checkbox"
				name="onoffswitch"
				className="onoffswitch-checkbox"
				id={id}
				checked={checked} />
			<label className="onoffswitch-label" htmlFor={id}></label>
		</div>
	)
}

OnOffSwitch.propTypes = {
	id: React.PropTypes.string.isRequired,
	checked: React.PropTypes.bool.isRequired,
	onChange: React.PropTypes.func.isRequired
}

export default OnOffSwitch