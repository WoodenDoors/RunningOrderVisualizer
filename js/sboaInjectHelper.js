/** apply on http://www.summer-breeze.de/en/running-order/index.html, save console output and throw that into importHelper.js */
var sboaRunningOrderParser = (function () {
	var days = [
		{
			name: 'Tuesday',
			date: '2016-08-16',
			stages: 1
		}, {
			name: 'Wednesday',
			date: '2016-08-17',
			stages: 3
		}, {
			name: 'Thursday',
			date: '2016-08-18',
			stages: 5
		}, {
			name: 'Friday',
			date: '2016-08-19',
			stages: 5
		}, {
			name: 'Saturday',
			date: '2016-08-20',
			stages: 5
		}
	];

	var dayIndex = 0;
	var stages = {};

	var pushStageData = function (stageName, bands) {
		if (stages[stageName] === stageName) {
			console.warn("stageName already pushed");
			return;
		}
		stages[stageName] = bands;

		if (Object.keys(stages).length === days[dayIndex].stages) {
			console.log(JSON.stringify(stages));
			console.log(', "' + days[dayIndex].date + '", "' + days[dayIndex].name + '"');
			stages = {};
			dayIndex++;
		}
	};

	var parseDom = function () {
		$('.custom-gigs-stage').each(function () {
			var stageName = $(this).find('h3').text().trim();
			var bands = [];
			//var isMultiStageBox = false;
			var pushOnNextFoundStageName = false;

			$(this).find('tr').each(function () {
				var $stageNameInBox = $(this).find('td.h5>div');
				if ($stageNameInBox.length !== -1 && $stageNameInBox.text().trim() !== '') {
					if (pushOnNextFoundStageName) {
						pushStageData(stageName, bands);
						bands = [];
					}
					stageName = $stageNameInBox.text().trim();
					pushOnNextFoundStageName = true;
				}

				var time = $(this).find('td:nth-child(1)>label').text().trim();
				var band = $(this).find('td:nth-child(2)>label').text().trim();
				if (time !== '' || band !== '') {
					bands.push(time + ' ' + band);
				}
			});
			pushStageData(stageName, bands);
		});
	};
	return parseDom;
}());
