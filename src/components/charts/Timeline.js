import React from 'react'
import HighStock from 'highstock-release'
import config from '../../config'

class Timeline extends React.Component {
	constructor(props) {
		super(props)
		
		this.options = {
			spacing: [0, 0, 0, 0],
			chart: {
				renderTo: `timeline-${props.id}`,
				zoomType: 'x',
				panning: true
			},
			legend: {
				margin: 15,
				itemMarginTop: 5,
				itemMarginBottom: 5,
				padding: 0,
				navigation: { enabled: false }
			},
			rangeSelector: {
				enabled: false,
				inputEnabled: false
			},
			xAxis: {
				type: 'datetime',
				minTickInterval: 1000
			},
			title: { text: '' },
			tooltip: {
				followTouchMove: false,
				crosshairs: true,
				shadow: false,
				style: { width: '100px' }
			},
			yAxis: [{
				max: 100,
				title: {
					text: 'Sensors Data',
					style: { fontSize: 14, color: config.colors.gas, fontWeight: 'bold' }
				},
				opposite: true,
				gridLineWidth: 1
			}],
			plotOptions: {
				series: {
					marker: {
						symbol: 'circle',
						radius: 4,
						lineColor: "#eee",
						lineWidth: 1
					},
					fillOpacity: 0.5
				}
			},
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
				id: 'gas',
				name: 'Measured smoke concentration',
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M',
					valueSuffix: '%'
				},
				data: [],
				color: config.colors.gas
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
				type: 'flags',
				id: 'gas-flags',
				linkedTo: 'gas',
				name: 'Smoke detected',
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M'
				},
				data: [],
				color: '#777',
				y: 0
			}, {
				type: 'flags',
				id: 'motion-flags',
				name: 'Motion detected',
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M'
				},
				data: [],
				color: config.colors.motion,
				y: -19
			}, {
				type: 'flags',
				id: 'connection-flags',
				name: 'Connectivity changes',
				tooltip: {
					xDateFormat: '%Y, %d %B %H:%M'
				},
				data: [],
				color: config.colors.connectivity,
				y: -40
			}]
		}
	}

	componentWillReceiveProps (nextProps) {
		let shouldRedraw = false

		/* Check for changes in series data */
		for (let i = 0; i < nextProps.seriesData.length; i++) {
			if (JSON.stringify(nextProps.seriesData[i]) !== JSON.stringify(this.props.seriesData[i])) {
				this.chart.series[i].setData(nextProps.seriesData[i])
				shouldRedraw = true
			}
		}

		shouldRedraw && this.chart.redraw()
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
		this.chart = HighStock.chart(this.options)
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