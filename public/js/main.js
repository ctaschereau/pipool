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
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: '°C'
			},
			plotLines: [{
				color: 'red', // Color value
				value: 20, // Value of where the line will appear
				width: 2 // Width of the line
			}]
		},
		chart: {
			zoomType: 'xy',
			panning: true,
			panKey: 'shift',
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Pool data',
			data: poolTemp
		}, {
			name: 'Outside data',
			data: outsideTemp
		}]
	};

	Highcharts.chart('chart_container', chartConfig);

	/*
	const KELVIN_DIFF = 273.15;
	chartConfig.yAxis.title.text = '°K';
	let newData = data.map(d => {
		return [d[0], d[1] + KELVIN_DIFF];
	});
	chartConfig.series[0].data = newData;
	Highcharts.chart('chart_container2', chartConfig);
	*/
};
main().then(() => {
	console.log('all done');
}).catch(console.error);
