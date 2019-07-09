$.getJSON(
	'/data.json',
	function (data) {
		// https://blog.emilecantin.com/web/highcharts/2014/10/26/highcharts-datetime-series.html
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});

		Highcharts.chart('chart_container', {
			title:{
				text:''
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: '°C'
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'Pool data',
				data: data
			}]
		});
	}
);
