import React from 'react'
import HighStock from 'highstock-release'

import '../../stylesheets/timeline.scss'


class Timeline extends React.Component {
	constructor(props) {
		super(props)
		
		this.options = {
			spacing: [0, 0, 0, 0],
			chart: {
				renderTo: `timeline-${props.id}`,
				events: {
					load: function () { }
				},
				zoomType: 'x',
				panning: true
			},
			rangeSelector: {
				enabled: false,
				inputEnabled: false
			},
			xAxis: {
				type: 'datetime',
				minTickInterval: 1000
			},
			title: {
				text: props.title
			},
			tooltip: {
				style: {
					width: '200px'
				}
			},
			yAxis: [
				{
					max: 100,
					title: {
						text: 'Temperature (Celsius)'
					},
					opposite: true,
					gridLineWidth: 1
				},
				{
					max: 100,
					title: {
						text: 'Humidity %'
					},
					opposite: true,
					gridLineWidth: 1
				},
				{
					max: 100,
					title: {
						text: 'Smoke concentration %'
					},
					gridLineColor: 'rgba(0, 0, 0, 0.07)'
				}
			],
			plotOptions: {
				series: {
					marker: {
						symbol: 'circle',
						radius: 2
					},
					fillOpacity: 0.5
				},
				flags: {
					tooltip: {
						enabled: false,
						xDateFormat: '%B %e, %Y'
					}
				}
			},
			series: [
				{
					type: 'spline',
					id: 'humidity',
					name: 'Measured humidity',
					data: [],
					tooltip: {
						xDateFormat: '%Y, %d %B %H:%M',
						valueSuffix: ' %'
					}
				},
				{
					type: 'spline',
					id: 'gas',
					name: 'Measured smoke concentration',
					tooltip: {
						xDateFormat: '%Y, %d %B %H:%M',
						valueSuffix: ' %'
					},
					data: [],
				},
				{
					type: 'spline',
					id: 'temperature',
					name: 'Measured temperature',
					dashStyle: 'line',
					data: [],
					color: '#ff0000',
					tooltip: {
						xDateFormat: '%Y, %d %B %H:%M',
						valueSuffix: 'Celsius',
						useHTML: true
					}
				}
			]
		}
	}

	componentWillReceiveProps (nextProps) {
		let shouldRedraw = false

		for (var i = 0; i < nextProps.seriesData.length; i++) {
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
		this.chart = HighStock.chart(this.options);
	}

	componentWillUnmount () {
		this.chart.destroy()
	}
}

Timeline.propTypes = {
	id: React.PropTypes.string.isRequired,
	title: React.PropTypes.string.isRequired,
	seriesData: React.PropTypes.array.isRequired
}

export default Timeline