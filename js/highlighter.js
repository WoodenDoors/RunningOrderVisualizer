var runningOrderHighlighter = (function ($) {
	'use strict';

	var INITIAL_STATE = 1;
	var INACTIVE_STATE = 0;

	var colors = [
		{fg: '#000', 'bg': '#ccc'},
		{fg: '#fff', bg: '#e76f51'},
		{fg: '#fff', bg: '#f4a261'},
		{fg: '#fff', bg: '#e9c46a'}

	];

	var resetBackgrounds = function () {
		$('.slot .slot-space').css('fill', '#ccc');
		$('.slot .bandname').css('fill', '#000');
	};

	var setHighlight = function ($elem) {
		var state = $elem.data('highlight-state');
		if (typeof state === 'undefined' || !$.isNumeric(state) || state <= 0) {
			state = INITIAL_STATE;
		} else if (state >= (colors.length - 1)) {
			state = INACTIVE_STATE;
		} else {
			state++;
		}
		$elem.find('.slot-space').css('fill', colors[state].bg);
		$elem.find('.bandname').css('fill', colors[state].fg);

		$elem.data('highlight-state', state);
	};

	var init = function () {
		resetBackgrounds();
		$('.slot').on('click', function () {
			setHighlight($(this));
		});
	};

	return {
		init: init
	};
})(jQuery);
