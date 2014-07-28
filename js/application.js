var setlistVisualizer = (function(){
	'use strict';

	var width = 900,
		height = 200,
		padding = 50,
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
				.attr("width", width + padding*2)
				.attr("height", height + padding*2)
				.style("border", "1px solid black");

			// scales and axis
			var xScale = d3.scale.linear()
								.domain([0, 800])
								.range([0, height]);
			var yAxis = d3.svg.axis().scale(xScale).orient("left");

			var yAxisGroup = svg.append("g")
								.attr(
									"transform",
									"translate("+padding+","+padding+")"
								)
								.call(yAxis);


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
						return 0;
					})
					.attr("y", function (d) { 
						return xScale(timeToNumber(d.from));
						//return getDate(d.from);
					})
					.attr("width", function (d) { 
						return 150; 
					})
					.attr("height", function (d) { 
						return xScale(timeToNumber(d.until)-timeToNumber(d.from));
						//return getDate(d.until);
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