let main = async function() {
	const poolTempReponse = await fetch('/poolTemp.json');
	const poolTemp = await poolTempReponse.json();
	const outsideTempResponse = await fetch('/outsideTemp.json');
	const outsideTemp = await outsideTempResponse.json();

	let el = document.getElementById('result_container');
	el.innerText = `Température maintenant : ${poolTemp[poolTemp.length - 1][1]}`

	// https://blog.emilecantin.com/web/highcharts/2014/10/26/highcharts-datetime-series.html
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});

	let chartConfig = {
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
				value: 20.5, // Value of where the line will appear
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

	const chart = Highcharts.chart('chart_container', chartConfig);

	/*
	// Default zoom
	const dateOffset = (24 * 60 * 60 * 1000) * 6; // nb of days
	let myDate = new Date();
	myDate.setTime(myDate.getTime() - dateOffset);
	chart.xAxis[0].setExtremes(myDate.getTime(), new Date().getTime());
	*/
};
main().then(() => {
	console.log('all done');
}).catch(console.error);
