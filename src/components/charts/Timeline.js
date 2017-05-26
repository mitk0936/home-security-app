import React from 'react'
import HighStock from 'highstock-release'
import config from '../../config'
import { timelineOptions } from '../../utils/defaultGraphicsOptions'

class Timeline extends React.Component {
	constructor(props) {
		super(props)
		
		this.timelineOptions = Object.assign({}, timelineOptions, {
			chart: Object.assign({}, timelineOptions.chart, {
				renderTo: `timeline-${props.id}`
			}),
			series: [{
				type: 'spline',
				id: 'humidity',
				name: 'Measured humidity',
				data: [],
				color: config.colors.humidity,
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M',
					valueSuffix: '%'
				}
			}, {
				type: 'spline',
				id: 'temperature',
				name: 'Measured temperature',
				dashStyle: 'line',
				data: [],
				color: config.colors.temperature,
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M',
					valueSuffix: ' Celsius',
					useHTML: true
				}
			}, {
				type: 'spline',
				id: 'gas',
				name: 'Measured gas level',
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M',
					valueSuffix: '%'
				},
				data: [],
				color: config.colors.gas
			}, {
				type: 'flags',
				id: 'gas-flags',
				linkedTo: 'gas',
				name: 'High gas levels detected',
				tooltip: { xDateFormat: '%Y, %d %B %H:%M' },
				data: [],
				color: '#777',
				shape: 'squarepin',
				y: 10
			}, {
				type: 'flags',
				id: 'motion-flags',
				name: 'Motion detected',
				tooltip: { xDateFormat: '%Y, %d %B %H:%M' },
				data: [],
				color: config.colors.motion,
				y: -30
			}, {
				type: 'flags',
				id: 'connection-flags',
				name: 'Connectivity',
				tooltip: { xDateFormat: '%Y, %d %B %H:%M' },
				data: [],
				color: config.colors.connectivity,
				y: -40
			}]
		})
	}

	componentWillReceiveProps (nextProps) {
		const dataHasChanged = (
			JSON.stringify(nextProps) !==
			JSON.stringify(this.props)
		)

		if (!dataHasChanged) { return }

		/* Update series data if some data has changed */
		for (let i = 0; i < nextProps.seriesData.length; i++) {
			this.chart.series[i].setData(nextProps.seriesData[i])
		}

		this.chart.redraw()
	}

	shouldComponentUpdate () {
		return false
	}

	render () {
		return (
			<div id={`timeline-${this.props.id}`} className='timeline'></div>
		)
	}

	componentDidMount () {
		this.chart = HighStock.chart(this.timelineOptions)
	}

	componentWillUnmount () {
		this.chart.destroy()
	}
}

Timeline.propTypes = {
	id: React.PropTypes.string.isRequired,
	seriesData: React.PropTypes.array.isRequired
}

export default Timeline