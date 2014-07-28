var setlistVisualizer = (function(){
	'use strict';

	var width = 900,
		height = 200,
		verticalPadding = 60,
		horizontalPadding = 30,
		datePrefix = "2014-08-13T",
		dateSuffix = ":00+0200";

	function getDate(timeString) {
		return new Date(datePrefix+timeString+dateSuffix);
	}

	function timeToNumber(timeString){
		var hours = parseInt(timeString.split(":")[0], 10) +
					(parseInt(timeString.split(":")[1])/60);
		var yPos = Math.floor(Math.pow(hours, 5)/10000);
		console.log("yPos: "+ yPos);
		return yPos;
	}

	var chart = function(selection){
		selection.each(function(data) {
			//console.log(data);

			// svg container
			var svg = selection.append("svg")
				.attr("width", width + verticalPadding*2)
				.attr("height", height + horizontalPadding*2)
				.style("border", "1px solid black");

			var minDate = getDate("12:00"),
				maxDate = getDate("23:59");


			var stageNames = [];
			data.stages.forEach(function(stage, i){
				stageNames.push(stage.stage);
			});
			console.log("stages: "+stageNames);


			// scales and axis
			var yScale = d3.time.scale()
								.domain([minDate, maxDate])
								.range([0, height]),

				xScale = d3.scale.ordinal()
								.domain(stageNames)
								.rangeBands([1, width]),

				yAxis = d3.svg.axis()
								.scale(yScale)
								.orient("left")
								.ticks(d3.time.hours, 2)
								.tickFormat(d3.time.format('%H:%M')),

				xAxis = d3.svg.axis()
								.scale(xScale)
								.orient('top');

			// axis group
			var yAxisGroup = svg.append("g")
								.attr('class', 'yaxis axis')
								.attr(
									"transform",
									"translate("+verticalPadding+","+horizontalPadding+")"
								)
								.call(yAxis),

				xAxisGroup = yAxisGroup.append('g')
								.attr('class', 'xaxis axis')
								.call(xAxis);
			// stages
			data.stages.forEach(function(stage, i){
				console.log(stage);

				// band slots
				var slots = yAxisGroup.selectAll("rect")
								.data(stage.bands)
								.enter()
								.append("rect");

				var rectangle = slots
					.attr("x", function (d) {
						return xScale(stage.stage);
					})
					.attr("y", function (d) {
						console.log( "y date: "+ getDate(d.from) );
						console.log( "y scale: "+ yScale(getDate(d.from)) );
						return yScale(getDate(d.from));
					})
					.attr("width", function (d) { 
						return xScale.rangeBand();
					})
					.attr("height", function (d) {
						return yScale(getDate(d.until));
					})
					.style("fill", function(d) {
						return '#'+Math.floor(Math.random()*16777215).toString(16); 
					});
			});
			console.log("/stages");
		});
	};

	return chart;
})();