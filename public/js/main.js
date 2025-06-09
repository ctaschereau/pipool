function updateTempTitle(poolTempNow) {
	const dateInMyFormat = new Date().toLocaleDateString('fr-CA', {
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	const el = document.getElementById('result_container');
	el.innerText = `Température en date du ${dateInMyFormat} : ${poolTempNow} °C`;
}

const convertTemperatureReadingsToArrayOfArrays = function(readings) {
	return readings.map(reading => {
		return [reading.dateInMs, reading.temp];
	});
}

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

	updateTempTitle(poolTempNow);

	const chartConfig = {
		title: {
			text: ''
		},
		xAxis: {
			type: 'datetime',
		},
		yAxis: {
			title: {
				text: '°C'
			},
			plotLines: [{
				color: 'red', // Color value
				value: 23, // Value of where the line will appear
				width: 1 // Width of the line
			}]
		},
		chart: {
			zoomType: 'xy',
			panning: true,
			panKey: 'shift',
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
			name: 'Pool data',
			data: convertTemperatureReadingsToArrayOfArrays(poolTemp),
		}, {
			name: 'Outside data',
			data:  convertTemperatureReadingsToArrayOfArrays(outsideTemp),
			color: '#b6b7c1',
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

getTempUsingSelectedValue()
setInterval(() => {
	getTempUsingSelectedValue()
}, 60 * 1000);

const radios = document.getElementsByName('range_to_display');
for(let radio in radios) {
    radios[radio].onclick = getTempUsingSelectedValue;
}
