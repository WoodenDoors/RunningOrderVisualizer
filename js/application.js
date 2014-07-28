var setlistVisualizer = (function(){
	'use strict';

	var width = 900,
		height = 400,
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

			var minDate = getDate("12:00"),
				maxDate = getDate("23:59");

			// stage names for ordinal scale
			var stageNames = [];
			data.stages.forEach(function(stage, i){
				stageNames.push(stage.stage);
			});
			console.log("stages: "+stageNames);

			// scales and axis
			var yScale = d3.time.scale()
								.domain([minDate, maxDate])
								.range([1, height]),

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


			var getPositionX = function(stage){
				return xScale(stage.stage);

			}, getPositionY = function(d){
				console.log( "y date: "+ getDate(d.from) );
				console.log( "y scale: "+ yScale(getDate(d.from)) );
				return yScale(getDate(d.from));

			}, getWidth = function (d) { 
				return xScale.rangeBand();

			}, getHeight = function (d) {
				var dateFrom = getDate(d.from),
				dateUntil = getDate(d.until);
				return yScale(dateUntil.getTime()) - yScale(dateFrom.getTime());
			
			}, calcForegroundColor = function(backgroundColor){
				var rgb = backgroundColor.match(/.{1,2}/g),
					brightness = calcBrightness(rgb[0], rgb[1], rgb[2]);

				console.log(backgroundColor +": "+rgb+" : "+brightness);
				return (brightness < 130) ? '#FFF' : '#000';

			}, calcBrightness = function(r, g, b){
				r = parseInt(r, 16);
				g = parseInt(g, 16);
				b = parseInt(b, 16);
				return Math.sqrt(
					r * r * 0.299 +
					g * g * 0.587 +
					b * b * 0.114);

			}, getFill = function(d){
				var hexColor = Math.floor(Math.random()*16777215).toString(16);
				d.textColor = calcForegroundColor(hexColor); // precalc
				return '#'+hexColor;

			}, getTextColor = function(d){
				return d.textColor; // get precalc value
			};


			// svg container
			var svg = selection.append("svg")
				.attr("width", width + verticalPadding*2)
				.attr("height", height + horizontalPadding*2)
				.style("border", "1px solid black");

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
				var slots = yAxisGroup.selectAll(".slot")
								.data(stage.bands)
								.enter()
								.append("g")
								.attr('class', 'slot')
								.attr("transform", 
									function(d, i) { 
										return "translate("+
											getPositionX(stage)+
											","+
											getPositionY(d)+
											")";
									});


				var rectangle = slots.append("rect")
					.transition().duration(500)
					//.attr("x", function (d) { return getPositionX(stage);})
					//.attr("y", getPositionY)
					.attr("width", getWidth)
					.attr("height", getHeight)
					.style("fill", getFill);

				slots.append("text")
					.attr('class', 'bandname')
					.attr('dx', 10)
					.attr('dy', 18)
					.attr('fill', getTextColor)
					.text(function(d) { return d.band; });
			});
			console.log("/stages");
		});
	};

	return chart;
})();