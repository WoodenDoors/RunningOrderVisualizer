var setlistVisualizer = (function(){
	'use strict';

	/**
	 * config
	 */
	var width = 900,
		height = 600,
		verticalPadding = 60,
		horizontalPadding = 30,
		dateSuffix = ":00+0200";

	/**
	 * crates a date from a dateTimeString
	 * @param  {[type]} timeString (expected format: yyyy-mm-ddThh:mm)
	 * @return {Date}
	 */
	var getDate = function(timeString) {
		return new Date(timeString+dateSuffix);
	};

	/**
	 * returns a random color code
	 */
	var calcRandomHexColor = function() {
		return Math.floor(Math.random()*16777215).toString(16);
	};

	/**
	 * calculate brightness from rgb value
	 */
	var calcBrightness = function(r, g, b){
		r = parseInt(r, 16);
		g = parseInt(g, 16);
		b = parseInt(b, 16);
		return Math.sqrt(
			r * r * 0.299 +
			g * g * 0.587 +
			b * b * 0.114);
	};

	/**
	 * calculate a matching foreground color to a given background color
	 * @param  {[type]} backgroundColor as a hex string
	 * @return {String}                 foregroundColor as a hex string
	 */
	var  calcForegroundColor = function(backgroundColor){
		var rgb = backgroundColor.match(/.{1,2}/g),
			brightness = calcBrightness(rgb[0], rgb[1], rgb[2]);

		//console.log(backgroundColor +": "+rgb+" : "+brightness);
		return (brightness < 130) ? '#FFF' : '#000';

	};

	/**
	 * scan for stage-names (for ordinal scale)
	 * and earlierst- and latest play times
	 * @param  {Object} data
	 * @return {Object}	with the attributes "stageNames", 
	 *                  "earlierstTime" and "latestTime"
	 */
	var scanData = function(data){
		var stageNames = [],
			earlierstTime = data.stages[0].bands[0].from,
			latestTime = data.stages[0].bands[0].until;

		data.stages.forEach(function(stage, i){
			stageNames.push(stage.stage);
			stage.bands.forEach(function(band, j){
				if(band.from < earlierstTime) {
					earlierstTime = band.from;
				}
				if(band.until > latestTime) {
					latestTime = band.until;
				}
			});
		});
		console.log("stages: "+stageNames);
		console.log("earlierstTime: "+earlierstTime);
		console.log("latestTime: "+latestTime);

		return {
			stageNames: stageNames,
			earlierstTime: earlierstTime,
			latestTime: latestTime
		};
	};

	/**
	 * internal main charting function
	 * @param  {Object} data      input-data
	 * @param  {Object} selection
	 */
	var drawChart = function(data, selection){
		var scannedData = scanData(data),
			minDate = getDate(scannedData.earlierstTime),
			maxDate = getDate(scannedData.latestTime);

		// scales and axis
		var yScale = d3.time.scale()
							.domain([minDate, maxDate])
							.range([1, height]),

			xScale = d3.scale.ordinal()
							.domain(scannedData.stageNames)
							.rangeBands([1, width]),

			yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.ticks(d3.time.minutes, 30)
							.tickFormat(d3.time.format('%H:%M')),

			xAxis = d3.svg.axis()
							.scale(xScale)
							.orient('top');


		var getPositionX = function(stage){
			return xScale(stage.stage);

		}, getPositionY = function(d){
			return yScale(getDate(d.from));

		}, getTransformPosition = function(d, stage){
			return "translate("+
				getPositionX(stage)+
				","+
				getPositionY(d)+
				")";

		}, getWidth = function (d) { 
			return xScale.rangeBand();

		}, getHeight = function (d) {
			var dateFrom = getDate(d.from),
				dateUntil = getDate(d.until),
				diff = yScale(dateUntil.getTime()) - yScale(dateFrom.getTime());

			d.gigLength = (dateUntil.getTime() - dateFrom.getTime())/60000;
			d.textHeight = (diff < 15) ? Math.floor(diff)-1 : 16;

			return diff;

		}, getFill = function(d){
			var hexColor;
			do {
				hexColor = calcRandomHexColor().toString();
			} while (
				!(/^[0-9A-F]{6}$/i.test(hexColor)) || 
				hexColor === '000000' ||
				hexColor === 'ffffff'
			);

			d.textColor = calcForegroundColor(hexColor); // precalc
			return '#'+hexColor;

		}, getTextColor = function(d){
			return d.textColor; // get precalc value

		}, getTextHeight = function(d){
			return d.textHeight;

		}, doSlotMouseover = function(d) {
			var dateFrom = getDate(d.from),
				dateUntil = getDate(d.until),
				format = d3.time.format('%H:%M'),
				xPosition = d3.event.pageX + 16,
				yPosition = d3.event.pageY + 16;

			d3.select("#tooltip")
				.style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.text(
					format(dateFrom)+
					" - "+
					format(dateFrom)+
					": "+
					d.band+
					" ("+
					d.gigLength+
					"min.)"
				)
				.classed("show", true);


		}, doSlotMouseout = function(d) {
			d3.select("#tooltip")
				.classed("show", false);
		};


		// svg container
		var svg = selection.append("svg")
			.attr("width", width + verticalPadding*2)
			.attr("height", height + horizontalPadding*2);

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
			var slots = yAxisGroup.selectAll(".slot-"+i)
							.data(stage.bands)
							.enter()
							.append("g")
							.attr('class', 'slot slot'+i)
							.attr("transform", function(d){
								return getTransformPosition(d, stage);
							})
							.on("mouseover", doSlotMouseover)
							.on("mouseout", doSlotMouseout);


			var rectangle = slots.append("rect")
				.transition().duration(500)
				.attr('class', 'slot-space')
				.attr("width", getWidth)
				.attr("height", getHeight)
				.style("fill", getFill);

			slots.append("text")
				.attr('class', 'bandname')
				.attr('dx', 6)
				.attr('dy', getTextHeight)
				.attr('fill', getTextColor)
				.attr('style', 
					function(d){return 'font-size: '+d.textHeight+'px';})
				.text(function(d) { return d.band; });
		});
	};

	/**
	 * public chart exposure
	 * @param  {Object} selection a dom selection
	 */
	var chart = function(selection){
		selection.each(function(data){
			drawChart(data, selection);
		});
	};

	return chart;
})();