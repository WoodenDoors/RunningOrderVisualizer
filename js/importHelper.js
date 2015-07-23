/**
 * Helper which converts festival-data to JSON
 * 
 * Usage Example:
	dayImporter({
		"Main":
		[
		"11:00 - 11:45 SERUM 114",
		"12:40 - 13:25 BE‘LAKOR",
		"14:20 - 15:05 BETONTOD",
		"16:00 - 17:00 KATAKLYSM",
		"18:10 - 19:10 PARADISE LOST",
		"20:20 - 21:35 HATEBREED",
		"22:55 - 00:15 NIGHTWISH"
		],
		"Pain":
		[
		"11:50 - 12:35 MAJESTY",
		"13:30 - 14:15 HAUDEGEN",
		"15:10 - 15:55 EMIL BULLS",
		"17:05 - 18:05 KNORKATOR",
		"19:15 - 20:15 CANNIBAL CORPSE",
		"21:40 - 22:50 DARK TRANQUILLITY",
		"00:20 - 01:30 VENOM"
		],
		"T-Stage":
		[
		"13:00 - 13:45 MILKING THE GOATMACHINE",
		"14:15 - 15:00 THE DUSKFALL",
		"15:30 - 16:15 SUICIDAL ANGELS",
		"16:45 - 17:30 BREAKDOWN OF SANITY",
		"18:00 - 18:45 HACKNEYED",
		"19:15 - 20:00 BELPHEGOR",
		"20:30 - 21:15 MORGOTH",
		"21:45 - 22:45 SICK OF IT ALL",
		"23:15 - 00:15 INQUISITION",
		"00:45 - 01:45 GHOST BRIGADE",
		"02:15 - 03:00 DARK FORTRESS"
		],
		"Camel Stage":
		[
		"13:45 - 14:15 RELIQUIAE",
		"15:00 - 15:30 PRIPJAT",
		"16:15 - 16:45 DUST BOLT",
		"17:30 - 18:00 RECTAL SMEGMA",
		"18:45 - 19:15 CHAPEL OF DISEASE",
		"20:00 - 20:30 DREAMSHADE",
		"21:15 - 21:45 REVEL IN FLESH",
		"22:45 - 23:15 TERROR UNIVERSAL",
		"00:15 - 00:45 TROLDHAUGEN",
		"01:45 - 02:15 NAILED TO OBSCURITY"
		]
		}
	, "2015-08-15", "Saturday");
 * 
 */
var dayImporter = (function(){

/**
 * debug flag (if true the function outputs json instead of stringified json)
 * @type {Boolean}
 */
var DEBUG = true;
/**
 * the pattern that matches the gig-input-data
 * @type {RegExp}
 */
var pattern = /^(\d+:\d+) - (\d+:\d+) (.+)$/;
/**
 * expects date to be formated as "2014-08-13"
 */
function calculateNextDayDate(date) {
	return date.substring(0, date.length-2) + (parseInt(date.substring(date.length-2),10) + 1);
}

/**
 * anything before 6 in the morning is considered "next day"
 */
function checkIfNextDay(time){
	var EARLY_MORNING = 6;
	return (parseInt(time.split(":")[0],10) < EARLY_MORNING);
}

/**
 * check if it's already the next day and correct the date if that's the case
 */
function correctDateIfNecessary(inputDate, inputTime, nextDayDate){
	var resultDateTime = inputDate;
	if(checkIfNextDay(inputTime)) {
		resultDateTime = nextDayDate;
	}
	resultDateTime += "T" + inputTime;
	return resultDateTime;
}

function parseGig(inputData, date, nextDayDate) {
	var matches = inputData.match(pattern); //pattern.exec(inputData); 

	return {
		"band": matches[3],
		"from": correctDateIfNecessary(date, matches[1], nextDayDate),
		"until": correctDateIfNecessary(date, matches[2], nextDayDate)
	};
}


/**
 * convert gigData to to json
 * @param  {Array} inputData expects input like "11:00 - 11:45 ANY GIVEN DAY"
 * @param  {String} date      expects input to be formated like "2014-08-13"
 * @return {JSON}
 */
function convertGigDataToJson(inputData, date){
	var finalData = [];
	var nextDayDate = calculateNextDayDate(date);
	
	for (var i = 0; i < inputData.length; i++) {
		finalData.push(parseGig(inputData[i], date, nextDayDate));
	};

	return finalData;
}


/**
 * convert dayData to json
 * @param  {Object} inputData expects input like "{"Main":[gigData], "Pain": [gigdata]}"
 * @param  {[type]} date      expects input to be formated like "2014-08-13"
 * @param  {[type]} day       the day
 * @return {[type]}           Json in a string (unless the DEBUG flag is set)
 */
function convertDayDataToJson(inputData, date, day){
	var finalDayData = {};
	finalDayData.day = day;
	finalDayData.stages = [];

	for(var stage in inputData) {
		if(inputData.hasOwnProperty(stage)) {
			var bands = convertGigDataToJson(inputData[stage], date);

			finalDayData.stages.push({
				"stage": stage,
				"bands": bands
			});
		}
	}

	if(DEBUG === false){
		return JSON.stringify(finalDayData);
	}
	return finalDayData;
}

// expose
return convertDayDataToJson;
})();