const getTemp = async function(rangeToDisplay) {
	let endOfURL = '';
	if (rangeToDisplay) {
		endOfURL = '?rangeToDisplay=' + rangeToDisplay;
	}
	const poolTempResponse = await fetch('/data/pool' + endOfURL);
	const poolTemp = await poolTempResponse.json();
	const outsideTempResponse = await fetch('/data/outside' + endOfURL);
	const outsideTemp = await outsideTempResponse.json();

	const dateInMyFormat = new Date().toLocaleDateString('fr-CA', {
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	const el = document.getElementById('result_container');
	el.innerText = `Température en date du ${dateInMyFormat} : ${poolTemp[poolTemp.length - 1][1]} °C`;

	// https://blog.emilecantin.com/web/highcharts/2014/10/26/highcharts-datetime-series.html
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});

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
		series: [{
			name: 'Pool data',
			data: poolTemp,
		}, {
			name: 'Outside data',
			data: outsideTemp,
			color: '#b6b7c1',
		}]
	};

	Highcharts.chart('chart_container', chartConfig);

	/*
	// Default zoom
	const dateOffset = (24 * 60 * 60 * 1000) * 6; // nb of days
	let myDate = new Date();
	myDate.setTime(myDate.getTime() - dateOffset);
	chart.xAxis[0].setExtremes(myDate.getTime(), new Date().getTime());
	*/
};
getTemp().then(() => {
	console.log('all done');
}).catch(console.error);

const radios = document.getElementsByName('range_to_display');
for(radio in radios) {
    radios[radio].onclick = function() {
		getTemp(this.value).then(() => {
			console.log('all done');
		}).catch(console.error);
    }
}
