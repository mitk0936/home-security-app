import config from '../config'

export const gaugeOptions = {
	chart: { type: 'solidgauge', backgroundColor: '#fff'},
	title: {
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
	}
}

export const timelineOptions = {
	spacing: [0, 0, 0, 0],
	chart: {
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
	}
}

export const toastBrowserStyles = {
	background: '#0E1717',
	text: "#FFFFFF"
}
