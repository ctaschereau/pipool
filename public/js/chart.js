$.getJSON(
	'/data.json',
	function (data) {
		Highcharts.chart('chart_container', {
			title: {
				text: 'Piscine ftw'
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
