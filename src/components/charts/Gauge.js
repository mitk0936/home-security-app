import React from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'
import { gaugeOptions } from '../../utils/defaultGraphicsOptions'
import config from '../../config'

HighchartsMore(Highcharts);
SolidGauge(Highcharts)

class Gauge extends React.Component {
	constructor (props) {
		super(props)

		const gaugeWidth = 160;

		this.state = {
			gaugeWidth,
			gaugeHeight: gaugeWidth * 0.7,
			valueSize: gaugeWidth / 15
		}

		const plotBands = props.dangerMinValue ? [{
			from: props.dangerMinValue,
			to: 100,
			borderWidth: 2,
			borderColor: config.colors.danger,
			color: config.colors.danger,
			zIndex: 100
		}]: []

		this.gaugeOptions = Object.assign({}, gaugeOptions, {
			title: Object.assign({}, gaugeOptions.title, {
				text: props.title
			}),
			yAxis: Object.assign({}, gaugeOptions.yAxis, {
				stops: [[0.1, props.color]],
				plotBands
			}),
			series: [{
				name: props.id,
				data: [0],
				dataLabels: {
					format: [
						'<div class="gauge-label">',
						`	<span class="value-span" style="font-size: ${this.state.valueSize}px">
								{y} ${props.metric}
							</span><br/>
						`,
					  	'</div>'
					].join('')
				}
			}]
		})

		this.chart = {}
	}

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
	color: React.PropTypes.string,
	dangerMinValue: React.PropTypes.number
}

export default Gauge
