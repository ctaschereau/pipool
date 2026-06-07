const POOL_COLOR = '#0ea5e9';
const OUTSIDE_COLOR = '#94a3b8';
const TARGET_COLOR = '#f43f5e';
const CHART_FONT = 'DM Sans, system-ui, sans-serif';

function formatTemperature(value) {
	return Number.isFinite(value) ? value.toFixed(1) : '—';
}

function updateTempDisplay(poolTempNow, outsideTempNow) {
	const dateInMyFormat = new Date().toLocaleDateString('fr-CA', {
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	document.getElementById('pool_temp_value').textContent = formatTemperature(poolTempNow);
	document.getElementById('outside_temp_value').textContent = formatTemperature(outsideTempNow);
	document.getElementById('result_container').textContent = `Dernière mise à jour — ${dateInMyFormat}`;
}

const convertTemperatureReadingsToArrayOfArrays = function(readings) {
	return readings.map(reading => [reading.dateInMs, reading.temp]);
};

const getTemp = async function(rangeToDisplay) {
	let endOfURL = '';
	if (rangeToDisplay) {
		endOfURL = '?rangeToDisplay=' + rangeToDisplay;
	}
	const poolTempResponse = await fetch('/data/pool' + endOfURL);
	const poolTemp = await poolTempResponse.json();
	const outsideTempResponse = await fetch('/data/outside' + endOfURL);
	const outsideTemp = await outsideTempResponse.json();
	const poolTempNow = poolTemp[poolTemp.length - 1].temp;
	const outsideTempNow = outsideTemp[outsideTemp.length - 1].temp;

	updateTempDisplay(poolTempNow, outsideTempNow);

	const chartConfig = {
		chart: {
			zoomType: 'xy',
			panning: true,
			panKey: 'shift',
			style: {
				fontFamily: CHART_FONT,
			},
			backgroundColor: 'transparent',
			spacing: [12, 8, 8, 8],
		},
		title: {
			text: null,
		},
		xAxis: {
			type: 'datetime',
			lineColor: '#e2e8f0',
			tickColor: '#e2e8f0',
			labels: {
				style: {
					color: '#64748b',
					fontSize: '11px',
				},
			},
		},
		yAxis: {
			title: {
				text: '°C',
				style: {
					color: '#64748b',
					fontSize: '12px',
					fontWeight: '500',
				},
			},
			gridLineColor: '#f1f5f9',
			labels: {
				style: {
					color: '#64748b',
					fontSize: '11px',
				},
			},
			plotLines: [{
				color: TARGET_COLOR,
				value: 23,
				width: 1.5,
				dashStyle: 'Dash',
				zIndex: 3,
			}],
		},
		tooltip: {
			shared: true,
			backgroundColor: '#ffffff',
			borderColor: '#e2e8f0',
			borderRadius: 8,
			shadow: {
				color: 'rgba(15, 23, 42, 0.1)',
				offsetX: 0,
				offsetY: 4,
				width: 12,
			},
			style: {
				fontSize: '13px',
			},
			xDateFormat: '%d %b, %H:%M',
			valueSuffix: ' °C',
		},
		credits: {
			enabled: false,
		},
		legend: {
			enabled: false,
		},
		accessibility: {
			enabled: false,
		},
		series: [{
			name: 'Piscine',
			data: convertTemperatureReadingsToArrayOfArrays(poolTemp),
			color: POOL_COLOR,
			lineWidth: 2.5,
			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 4,
					},
				},
			},
		}, {
			name: 'Extérieur',
			data: convertTemperatureReadingsToArrayOfArrays(outsideTemp),
			color: OUTSIDE_COLOR,
			lineWidth: 2,
			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 4,
					},
				},
			},
		}],
		time: {
			timezone: 'America/Montreal',
		},
	};

	Highcharts.chart('chart_container', chartConfig);
};

const getTempUsingSelectedValue = function() {
	const selectedRadio = document.querySelector('input[name="range_to_display"]:checked');
	const selectedValue = selectedRadio ? selectedRadio.value : null;
	getTemp(selectedValue).then(() => {}).catch(console.error);
};

getTempUsingSelectedValue();
setInterval(() => {
	getTempUsingSelectedValue();
}, 60 * 1000);

document.querySelectorAll('input[name="range_to_display"]').forEach((radio) => {
	radio.addEventListener('change', getTempUsingSelectedValue);
});
