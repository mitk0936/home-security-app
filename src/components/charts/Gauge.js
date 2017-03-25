import React from 'react'

import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'

HighchartsMore(Highcharts);
SolidGauge(Highcharts)

class Gauge extends React.Component {
	constructor (props) {
		super(props)

		this.gaugeOptions = {
			chart: { type: 'solidgauge', backgroundColor: '#fff'},
			title: {
				text: props.title,
				margin: 0,
				style: { "color": "#333333", "fontSize": "14px" }
			},
			pane: {
				center: ['50%', '85%'],
				size: '160%',
				startAngle: -100,
				endAngle: 100,
				background: {
					backgroundColor: '#eee',
					innerRadius: '60%',
					outerRadius: '100%',
					shape: 'arc'
				}
			},
			tooltip: { enabled: false },
			yAxis: {
				min: props.minValue,
				max: props.maxValue,
				stops: props.stops,
				lineWidth: 0.5,
				minorTickInterval: 2,
				tickAmount: 1,
				title: { y: -55 },
				labels: { y: 16 }
			},
			plotOptions: {
				solidgauge: {
					dataLabels: {
						y: 0,
						borderWidth: 0,
						useHTML: true
					}
				}
			},
			series: [
				{
					name: props.id,
					data: [props.minValue],
					dataLabels: {
						format: [
							'<div style="text-align:center">',
							`	<span style="font-size: ${props.valueSize}px; color: #000">{y} ${props.metric}</span><br/>`,
						  	'</div>'
						].join('')
					}
				}
			]
		}

		this.chart = {}
	}

	componentWillMount () { }

	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			const point = this.chart.series[0].points[0]
			point.update(nextProps.value)
		}
	}

	shouldComponentUpdate () {
		return false
	}

	render () {
		const style = {
			width: `${this.props.width}px`,
			height: `${this.props.height}px`
		}

		return (
			<div id={`gauge-${this.props.id}`} className='gauge' style={style}></div>
		)
	}

	componentDidMount () {
		this.chart = Highcharts.chart(`gauge-${this.props.id}`, this.gaugeOptions)
	}

	componentWillUnmount () {
		this.chart.destroy()
	}
}

Gauge.propTypes = {
	id: React.PropTypes.string.isRequired,
	title: React.PropTypes.string.isRequired,
	stops: React.PropTypes.array,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	valueSize: React.PropTypes.number.isRequired,
	minValue: React.PropTypes.number.isRequired,
	maxValue: React.PropTypes.number.isRequired,
	metric: React.PropTypes.string.isRequired
}

Gauge.defaultProps = {
	stops: [
		[0.1, '#3399FF'], // blue
		[0.2, '#DDDF0D'], // yellow
		[0.9, '#DF5353'] // red
	]
}

export default Gauge