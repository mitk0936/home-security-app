import React from 'react'

import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'

HighchartsMore(Highcharts);
SolidGauge(Highcharts)

class Gauge extends React.Component {
	constructor (props) {
		super(props)

		const gaugeWidth = 180

		this.state = {
			gaugeWidth,
			gaugeHeight: gaugeWidth * 0.7,
			valueSize: gaugeWidth / 15
		}

		this.gaugeOptions = {
			chart: { type: 'solidgauge', backgroundColor: '#fff'},
			title: {
				text: props.title,
				margin: 0,
				style: { "color": "#333333", "fontSize": "12px" }
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
				stops: [[0.1, props.color]],
				min: 0,
				max: 100,
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
					data: [0],
					dataLabels: {
						format: [
							'<div style="text-align:center">',
							`	<span style="font-size: ${this.state.valueSize}px; color: #000">{y} ${props.metric}</span><br/>`,
						  	'</div>'
						].join('')
					}
				}
			]
		}

		this.chart = {}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			const point = this.chart.series[0].points[0]
			point.update(nextProps.value)
		}
	}

	shouldComponentUpdate () {
		return true
	}

	render () {
		const style = {
			width: `${this.state.gaugeWidth}px`,
			height: `${this.state.gaugeHeight}px`
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
	metric: React.PropTypes.string.isRequired,
	color: React.PropTypes.string
}

export default Gauge