$.getJSON(
	'/data.json',
	function (data) {
		// https://blog.emilecantin.com/web/highcharts/2014/10/26/highcharts-datetime-series.html
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});

		let chartConfig = {
			title:{
				text:''
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
					value: 22, // Value of where the line will appear
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
				data: data
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
	}
);

$('#ims_btn').click(() => {
	let url = $('#imsURL').val();
	$('#ims_test').html(`<iframe name="my_iframe" title="Inline Frame Example" width="1024" height="780" src="${url}"></iframe>`);
});
