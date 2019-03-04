// JS file which particularly deals with date and time 

/*** Variables and constants ***/
const dayInMiliSeconds = 86400000;

/*** Functions ***/

// Getting current date and returning it in formated way
function getCurrentFormatedDate() {
	let currentMapDate = getDayMonthYearAsMapOrDateObj();
	return returnFormatedDate(currentMapDate.get('day'), currentMapDate.get('month'), currentMapDate.get('year'));
}

// Calculate date based on days
/*
 operation (add, substract...)
 days - amount of days on which current date should be changed
*/
function getCalculatedFormatedDate(operation, days) {
	let currentMapDate = getDayMonthYearAsMapOrDateObj(); // Getting current date in a Map

	// If operation is add
	if (operation === '+') {
		// Calculating needed day
		/*
			This variable can contain a value more than 31 bcs object constructor Date will automaticlly format
			the date in valid and right way
		*/
		let neededDay = currentMapDate.get('day') + Number(days);
		// Getting needed date
		let calculatedDate = getDayMonthYearAsMapOrDateObj(neededDay, currentMapDate.get('month'), currentMapDate.get('year'));

		// Geting formated date and returning it
		return returnFormatedDate(calculatedDate.get('day'), calculatedDate.get('month'), calculatedDate.get('year'));
	}
}

// Returning current or created by params date or date object
/*
	$day, $month, $year - time params to set in Date()
	$returnOnlyDateObj - if its true, so return only date obj
*/
function getDayMonthYearAsMapOrDateObj($day = false, $month = false, $year = false, $returnOnlyDateObj = false) {
	// Further Date obj
	let date;
	// If all params were given only at this occasion I create date based on them
	if ($day && $month && $year)
		date = new Date($year, $month, $day);
	// Else getting current date
	else date = new Date();

	if ($returnOnlyDateObj) return date;

	let day = date.getDate(); // 1 - 31
	let month = date.getMonth(); // 0 - 11
	let year = date.getFullYear(); // YYYY

	// Creating Map and returning all time params inside it
	return new Map([['day', day], ['month', month], ['year', year]]);
}

/*
	FORMAT: DD.MM.YYYY
	Construct day by format in a string
*/
function returnFormatedDate(day, month, year) {
	// In JS numbering of months starts with 0, so I have to add 1 to make usuall for user
	month = month + 1;	
	/* if the number of day or month is less than 10, so it contains only 1 character, so I need to add 
	zero before it to satisfy the format*/
	if (day < 10) day = "0"+day;
	if (month < 10) month = "0"+month;
	return day+"."+month+"."+year;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
// Functions that checks if date(that is given as formated date string) real exists
function isDateValid(dateString) {
	// Getting data about given date string
	let parsedDateStringMap = parseFormatedDateStringAsMap(dateString);
	// Puting it to variables
	let day = parsedDateStringMap.get('day');
	let month = parsedDateStringMap.get('month');
	let year = parsedDateStringMap.get('year');

	// Forming true date data from the data of given date
	let realDateData = getDayMonthYearAsMapOrDateObj(day, month, year);
	// Forming formated string from new data
	let realDate = returnFormatedDate(realDateData.get('day'), realDateData.get('month'), realDateData.get('year'));

	// IF new formated date string not equals to given date string, so they differs, so given date doesn't exist
	if (realDate !== dateString) return false;
	return true;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
// Function which counts difference in days between formated date string and current date
function getDiffBtwCurrentAndGivenDateString(dateString) {
	// Getting current absolute date obj (passing into parameter current formated date string)
	let currentAbsoluteDateObj = getDateObjFromFormatedDateString(getCurrentFormatedDate());
	// Getting absolute date obj of given date
	let inputDateObj = getDateObjFromFormatedDateString(dateString);

	/* 
		Substracting ones ms from anothers ms and dividing on ms in 1 day, then round the result
		ms* - miliseconds
		differenceInDays - could be negative integer, shows difference in days between current and given date 
		Example: 22.04.2018 and 26.04.2018 = differenceInDays = -4
	*/
	let differenceInDays = Math.round((currentAbsoluteDateObj.getTime() - inputDateObj.getTime()) / dayInMiliSeconds);
	return differenceInDays;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
// Function which counts difference in days between two formated date strings
function getDiffBtwTwoDatesString(dateString1, dateString2) {
	// Getting absolute date objects of two date strings
	let date1 = getDateObjFromFormatedDateString(dateString1);
	let date2 = getDateObjFromFormatedDateString(dateString2);

	/* 
		Substracting ones ms from anothers ms and dividing on ms in 1 day, then round the result
		ms* - miliseconds
		differenceInDays - could be negative integer, shows difference in days between date1 and date2 
		Example: 22.04.2018 and 26.04.2018 = differenceInDays = -4
	*/
	let differenceInDays = Math.round((date1.getTime() - date2.getTime()) / dayInMiliSeconds);
	return differenceInDays;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
/*
	Function that creates absolute Date object based on formated date string
*/
function getDateObjFromFormatedDateString(dateString) {
	// Getting data about date as a Map
	let parsedDateMap = parseFormatedDateStringAsMap(dateString);
	// Creating variables with data from parsed date map
	let day = parsedDateMap.get('day');
	let month = parsedDateMap.get('month');
	let year = parsedDateMap.get('year');

	// Creating an absolute date (so, 00:00 00ms)
	let date = new Date(year, month, day, 0, 0, 0, 0);
	return date;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
/*
	Function which returns Map of data(day, month, year) from formated date string
*/
function parseFormatedDateStringAsMap(dateString) {
	// Spliting string on day, month, year
	let day = dateString.substring(0, 2);
	let month = dateString.substring(3, 5);
	let year = dateString.substring(6);

	// Turning into common integer day and month by removing first zero if it exists
	if (day[0] === 0) day = +day[1];
	if (month[0] === 0) month = +month[1];
	month = month - 1; // substracting 1 from month value because numbering months in JS starts with 0

	// Returning map with data from date string
	return new Map([['day', day], ['month', month], ['year', year]]);
}