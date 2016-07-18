var runningOrderHighlighter = (function ($) {
	'use strict';

	var INITIAL_STATE = 1;
	var INACTIVE_STATE = 0;
	var IS_ACTIVE_KEY = 'runningOrderActive';
	var PREFIX = 'runningOrder-';

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
		var bandName = $elem.find('.bandname').text().trim();
		var state = localStorage.getItem(PREFIX + bandName);

		if (state === null || !$.isNumeric(state) || state <= 0) {
			state = INITIAL_STATE;
		} else if (state >= (colors.length - 1)) {
			state = INACTIVE_STATE;
		} else {
			state++;
		}
		$elem.find('.slot-space').css('fill', colors[state].bg);
		$elem.find('.bandname').css('fill', colors[state].fg);

		localStorage.setItem(PREFIX + bandName, state);
	};

	var setHighlightOnElements = function ($elem, state) {
		$elem.find('.slot-space').css('fill', colors[state].bg);
		$elem.find('.bandname').css('fill', colors[state].fg);
	};

	var restore = function () {
		if (localStorage.getItem(IS_ACTIVE_KEY) !== null) {
			for (var i = 0; i < localStorage.length; i++) {
				var key = localStorage.key(i);

				if (key !== IS_ACTIVE_KEY) {
					var bandName = key.substr(PREFIX.length);
					var value = localStorage.getItem(key);
					$('.bandname').each(function () {
						if ($(this).text().trim() === bandName) {
							setHighlightOnElements($(this).parent(), value);
						}
					});
				}
			}
		}
	};

	var init = function () {
		resetBackgrounds();
		restore();

		$('.slot').on('click', function () {
			setHighlight($(this));
		});
		localStorage.setItem(IS_ACTIVE_KEY, true);
	};

	var reset = function () {
		localStorage.clear();
	};

	return {
		init: init,
		reset: reset
	};
})(jQuery);
