(function ($) {
	$(document).foundation();
	if (!Modernizr.svg || !Modernizr.inlinesvg) {
		$('#loadEverything').attr('disabled', true);
		$('.not-supported').show();
	} else {

		$('#loadEverything').on('click', function () {
			d3.json("data/sb2017.json", function (data) {
				var content = d3.select('#main-content'),
					nav = d3.select('#main-nav');

				data.days.forEach(function (day, i) {
					var dayName = day.day,
						dayNameLowercase = dayName.toLowerCase();

					nav.append('li')
						.attr('class', 'tab-title active')
						.append('a')
						.attr('href', '#' + dayNameLowercase)
						.text(dayName);

					content.append('section')
						.attr('class', 'content')
						.attr('id', dayNameLowercase)
						.datum(day)
						.call(runningOrderVisualizer);
				});
			});

			$('#loadEverything').hide();

			if(Modernizr.localstorage) {
				$('.highlightActivatorContainer').show();
			}
		});

		$('.highlightActivator').on('click', function(){
			runningOrderHighlighter.init();
			$('.highlightActivatorContainer').hide();
		});
	}
})(jQuery);
