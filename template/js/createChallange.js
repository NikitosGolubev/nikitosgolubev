/*
	---READ BEFORE USE---
	1) All date functions are located in dateFuncs.js
	2) Functions: isError(), showError(), removeErrorMessage() are located in main.js
*/

/*** Variables, constants, objects ***/

const minLengthChallangeName = 8; // Min length of challange name(characters)
const maxLengthChallangeName = 100; // Max length of challange name(characters)
const minChallangeLengthDays = 3; // Min period of time of one challange (days)
const maxChallangeLengthDays = 365; // Max period of time of one challange (days)
const maxDiffBtwCurrentAndStartDate = 7; // Max difference btw current date and start date in days

/*
	Object that contains inputs in create tab. Needed to shorten and to butify code further,
	to have convinient access to inputs.
*/
challangeInputs = {
	name: document.getElementById("challangeName"), // Challange title
	days: document.getElementById("lastDays"), // Amount of days for challange
	maxLostDays: document.getElementById("maxLostDays"), // Max amount of fail days before complete failure
	startDate: document.getElementById("startDate"), // Start date of challange
	endDate: document.getElementById("endDate") // End date of challange
}

/*** Event listeners ***/

// On flow
challangeInputs.name.addEventListener('input', validateNameOnFlow);
challangeInputs.days.addEventListener('input', validateDaysOnFlow);
challangeInputs.maxLostDays.addEventListener('input', validateLostDaysOnFlow);
challangeInputs.startDate.addEventListener('input', validateStartDateOnFlow);
challangeInputs.endDate.addEventListener('input', validateEndDateOnFlow);

// On click
document.getElementById('createChallange').addEventListener('click', validateCreateForm);

// On focus
challangeInputs.name.addEventListener('focus', removeErrorMessage);
challangeInputs.days.addEventListener('focus', removeErrorMessage);
challangeInputs.maxLostDays.addEventListener('focus', removeErrorMessage);
challangeInputs.startDate.addEventListener('focus', removeErrorMessage);
challangeInputs.endDate.addEventListener('focus', removeErrorMessage);

/***Event functions ***/

/*** VALIDATION ON FLOW (WHEN USER FILLS INPUTS) ***/

// Validation of title input
function validateNameOnFlow(event) {
	// Getting current input
	let obj = event.target;
	/*
		Purpose: not allow to user to enter a lot of characters, restrict it
		So, if user enters more than its allowed, all the characters after restricted amount would be cut.
	*/
	if (obj.value.length > maxLengthChallangeName)
		obj.value = obj.value.substring(0, maxLengthChallangeName);
	// To not to allow user to enter more than 1 space in a row
	obj.value = trim(obj.value);
}

// Validation of amount days input
function validateDaysOnFlow(event) {
	// Getting current input
	let obj = event.target;

	commonValidationForColDaysAndLostDays(obj, true);

	/*
		Purpose: to mark input in another collor, to warn user that value is less than required IF:
		-) Value is integer and it exists (to mark only integer values)
		-) Value is less than min challange length (to mark only values that less than min amount of days)
	*/
	if (Number.isInteger(+obj.value) && obj.value && +obj.value < minChallangeLengthDays)
		obj.style.background = "rgba(255, 0, 0, 0.3)"; // marking input into red color
	else obj.style.background = "transparent"; // otherwise making it normal

	/*
		Purpose: to change value of max failed days IF
		-) it exists AND
		-) value of col days less than value of lost days
		Its impossible that amount of days of whole challange could be less than amount of lost days
		(Max, they could be equal)
	*/
	if (obj.value && +obj.value < +challangeInputs.maxLostDays.value)
		challangeInputs.maxLostDays.value = obj.value;

	calculateEndAndStartDateBasedOnDays(obj);

}

function validateLostDaysOnFlow(event) {
	// Getting current input
	let obj = event.target;

	commonValidationForColDaysAndLostDays(obj);
	
	/*
		Purpose: to change value of max failed days IF
		-) value of whole amount of days exists AND
		-) value of col days less than value of lost days
		Its impossible that amount of days of whole challange could be less than amount of lost days
		(Max, they could be equal)
	*/
	if (+challangeInputs.days.value && +obj.value > +challangeInputs.days.value)
		obj.value = challangeInputs.days.value;
	/* If value of max failed days greater than max amount of days of whole challange, so
	it should be changed. It cant overcome this barrier */
	else if (+obj.value > maxChallangeLengthDays) obj.value = maxChallangeLengthDays;
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
function validateStartDateOnFlow(event) {
	// Getting current input
	let obj = event.target;

	commonValidationForDateInputs(obj);

	/* If date field filled with max amount of characters due to format(10) so its possible to
	valid it correctly as a date */
	if (obj.value.length === 10) {
		// If date is invalid(not exists), so empty the input
		if (!isDateValid(obj.value)) obj.value = '';

		// Counting difference in days btw input start date and current one
		let diffBtwStartAndCurrentDate = getDiffBtwCurrentAndGivenDateString(obj.value);
		// If difference is positive - given date less than current (given date = 0 = current date)
		// So in this case, I set current date as a value
		if (diffBtwStartAndCurrentDate > 0) obj.value = getCurrentFormatedDate();
		// If date is more than current in (maxDiffBtwCurrentAndStartDate) or more days
		// So in this case, I set a date that differs from current in maxDiffBtwCurrentAndStartDate days
		// getDiffBtwCurrentAndGivenDateString() returns negative int, if given date more than current
		if (diffBtwStartAndCurrentDate < -maxDiffBtwCurrentAndStartDate)
			obj.value = getCalculatedFormatedDate('+', maxDiffBtwCurrentAndStartDate);
		
		setEndDate(obj, challangeInputs.endDate);
	}
}

// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
function validateEndDateOnFlow(event) {
	// Getting current input
	let obj = event.target;

	commonValidationForDateInputs(obj);

	/* If date field filled with max amount of characters due to format(10) so its possible to
	valid it correctly as a date */
	if (obj.value.length === 10) {
		// If date is invalid(not exists), so empty the input
		if (!isDateValid(obj.value)) obj.value = '';

		setEndDate(challangeInputs.startDate, obj);
	}
}

/*** VALIDATION AFTER CLICK ON CREATE BTN ***/

// Validating all inputs, getting results of validation
function validateCreateForm(event) {
	let nameValidation = validateChallangeName();
	let daysLengthValidation = validateChallangeDaysLength();
	let startDateValidation = validateChallangeStartDate();
	let endDateValidation = validateChallangeEndDate();

	// If there anything wrong with validation so, I don't send the form to server
	if (!nameValidation || !daysLengthValidation || !startDateValidation || !endDateValidation)
		event.preventDefault();
}

/*** Helper functions ***/

/*
	Common validation function for both days and lostDays inputs
	obj - event.target from event function
	$isItColDays - if its an amount of days input, so this parameter should be true for extra validation
*/
function commonValidationForColDaysAndLostDays(obj, $isItColDays = false) {
	/*
		IF
			-) The value is not an integer (I count days, so it required to be integer)
			-) OR the last character of string was dot(.) (JS considers that 14. - is integer)
			-) OR if value is negative
			-) OR if user typed more than one zero (0000 - also integer :( )
		IN such cases I just empty the input value
		ELSE IF
			-) Value is more than max amount of challange length(for ex: 131432432)
			-) AND if its amount of days input
		SO, I set a max amount of days as a value to days input
	*/
	if (
		!Number.isInteger(+obj.value)
		|| obj.value[obj.value.length - 1] === '.'
	 	|| +obj.value < 0
	 	|| (+obj.value === 0 && obj.value.length > 1)
	) {
		obj.value = '';
	}
	else if (+obj.value > maxChallangeLengthDays && $isItColDays) obj.value = maxChallangeLengthDays;

	// If user type spaces after value, I cut them
	if (obj.value[obj.value.length - 1] === ' ') obj.value = obj.value.substring(0, obj.value.length - 1);
	// If user type spaces before value, I cut them
	if (obj.value[0] === ' ') obj.value = obj.value.substring(1);
}

/* 
	A function which calculates start and end date based changing amount of days value
	obj - event.target from event function
*/
function calculateEndAndStartDateBasedOnDays(obj) {
	// Clearfy date inputs from errors if they exist
	removeErrorMessage(challangeInputs.startDate, false);
	removeErrorMessage(challangeInputs.endDate, false);

	/*
		If start date is filled but not filled fully by format (for ex: 12.02.201 - 9 characters), so I change it
		to current date, to clearfy further work
	*/
	if (challangeInputs.startDate.value && challangeInputs.startDate.value.length !== 10)
		challangeInputs.startDate.value = getCurrentFormatedDate();

	// If current value is integer and its more than min challange length
	if (Number.isInteger(+obj.value) && +obj.value >= minChallangeLengthDays) {
		// Getting start date value
		/*
			KEEP IN MIND
			On this stage, start date can have only 2 values
			1) Empty = ''
			2) Correctly filled date due to format (bcs of its validation and look the condition above)
		*/
		let startDateValue = challangeInputs.startDate.value;

		/* 
			Well, if its invalid (length not equals to format length(10))
			(I decided to not to write empty just for more flexibility and mine posibility to miscalculate or forget smth)
		*/
		if (startDateValue.length !== 10) {
			// So I set a current date to start date value and startDateValue variable
			challangeInputs.startDate.value = startDateValue = getCurrentFormatedDate();
		}

		// Getting difference btw 1)start date value and 2)current date (put parameters exactly in this order)
		// If start date has value of current date it will return 0, keep in mind
		let diffBtwStartAndCurrentDate = getDiffBtwTwoDatesString(startDateValue, getCurrentFormatedDate());
		// Counting amount of days which should be added to current date to calculate end one
		let colDaysToCalculateEndDate = (+obj.value) + diffBtwStartAndCurrentDate;

		// Calculating end date and set it to input value
		challangeInputs.endDate.value = getCalculatedFormatedDate("+", colDaysToCalculateEndDate);
	}

	// IF amount of days value is less than min len og challange and if start date value exists
	/*
		By this condition, difference between start and end date will be always more or equal to
		min amount of days of challange.
	*/
	if (obj.value < minChallangeLengthDays && challangeInputs.startDate.value) {
		// Getting difference btw 1)start date value and 2)current date (put parameters exactly in this order)
		let diffBtwStartAndCurrentDate = getDiffBtwTwoDatesString(challangeInputs.startDate.value, getCurrentFormatedDate());
		// Counting amount of days which should be added to current date to calculate end one
		let colDaysToCalculateEndDate = minChallangeLengthDays + diffBtwStartAndCurrentDate;
		
		// Calculating end date and setting it to input value
		challangeInputs.endDate.value = getCalculatedFormatedDate("+", colDaysToCalculateEndDate);
	}
}


/*
	Common validation function for both startDate and endDate inputs
	obj - event.target from event function
*/
function commonValidationForDateInputs(obj) {
	// (!!IMPORTANT!!) DATE FORMAT DD.MM.YYYY - STRICT
	// Variables with regular expressions for each letter in format
	let letter1 = RegExp('[0-3]', 'i');
	let letter2_5_8_9_10 = RegExp('[0-9]', 'i');
	let letter3_6 = RegExp('\\.', 'i');
	let letter4 = RegExp('[0-1]', 'i');
	let letter7 = RegExp('[2-9]', 'i');

	/* Array, where each reg exp variable stay on position which index is quals to its letter 
	index in a format string */
	let lettersRegExps = [letter1, letter2_5_8_9_10, letter3_6, letter4, letter2_5_8_9_10,
						 letter3_6, letter7, letter2_5_8_9_10, letter2_5_8_9_10, letter2_5_8_9_10];
	
	// If user tries to type more characters that its allowed by format so, I empty date input
	if (obj.value.length > 10) obj.value = '';
	else {
		// Variable, that will contain a string of letters which stay on valid positions
		let newValueStringOfVerifiedCharacters = '';
		// Loop through the whole string
		for (let i = 0; i < obj.value.length; i++) {
			// If character stays on right position and its verified by reg exp, so I add it to newValueStringOfVerifiedCharacters
			if (obj.value[i].match(lettersRegExps[i]))
				newValueStringOfVerifiedCharacters = newValueStringOfVerifiedCharacters + obj.value[i];
			// Else I stop the loop(and by this I return user to the place where he typed wrong character)
			else break;
		}
		// Setting new value to date input
		obj.value = newValueStringOfVerifiedCharacters;
	}
}

/*
	Calculating end date
	startDateInput - startDate input object
	endDateInput - endDate input object
*/
function setEndDate(startDateInput, endDateInput) {
	// Clearfy date inputs from errors if they exist
	removeErrorMessage(challangeInputs.startDate, false);
	removeErrorMessage(challangeInputs.endDate, false);

	// If startDateInput doesnt fit format, so I set current date to its value
	if (startDateInput.value.length !== 10) startDateInput.value = getCurrentFormatedDate();

	let diffBtwStartAndCurrentDate = getDiffBtwCurrentAndGivenDateString(startDateInput.value); // getting diff btw start and current date
	let colDaysToCalculateEndDate = minChallangeLengthDays; // setting minLength to calc end date

	// If value of amount of days exists, so set it to colDaysToCalculateEndDate
	if (challangeInputs.days.value) colDaysToCalculateEndDate = +challangeInputs.days.value;
	// Counting amount of days to add to current date to get end date
	// Need to use Math.abs() to diffBtwStartAndCurrentDate variable due to it may be negative
	colDaysToCalculateEndDate = colDaysToCalculateEndDate + Math.abs(diffBtwStartAndCurrentDate);

	// Calculating end date and setting it to input value
	endDateInput.value = getCalculatedFormatedDate('+', colDaysToCalculateEndDate);
}

// Validation of challange name
function validateChallangeName() {
	let challangeNameInput = challangeInputs.name; // getting input
	let challangeName = challangeInputs.name.value; // getting value of input

	// If name is too short, so print error
	if (challangeName.length < minLengthChallangeName)
		return showError(challangeNameInput, 'Не меньше '+ minLengthChallangeName +' символов!');
	// If user sent not an error back(with error message), so will be returned - true
	return !isError(challangeNameInput);
}

// Validation of challange amount of days length
function validateChallangeDaysLength() {
	let challangeDaysLengthInput = challangeInputs.days; // getting input
	let challangeDaysLength = challangeInputs.days.value; // getting value of input

	// If amount of challange days is less than min amount of them, so print error message
	if (+challangeDaysLength < minChallangeLengthDays)
		return showError(challangeDaysLengthInput, 'Минимальное кол-во дней: '+ minChallangeLengthDays +'!');
	// If user sent not an error back(with error message), so will be returned - true
	return !isError(challangeDaysLengthInput);
}

// Validation of challange start date
function validateChallangeStartDate() {
	let challangeStartDateInput = challangeInputs.startDate; // getting input
	let challangeStartDate = challangeInputs.startDate.value; // getting value of input

	// if date field is empty, so print error message
	if (!challangeStartDate) return showError(challangeStartDateInput, 'Неопределена дата начала!');
	// if date field doesn't fit format, so print error message
	if (challangeStartDate.length !== 10) return showError(challangeStartDateInput, 'Дата несоответствует формату!');
	// If user sent not an error back(with error message), so will be returned - true
	return !isError(challangeStartDateInput);
}

// Validation of challange end date
function validateChallangeEndDate() {
	let challangeEndDateInput = challangeInputs.endDate; // getting input
	let challangeEndDate = challangeInputs.endDate.value; // getting value of input

	// if date field is empty, so print error message
	if (!challangeEndDate) return showError(challangeEndDateInput, 'Неопределена дата конца!');
	// if date field doesn't fit format, so print error message
	if (challangeEndDate.length !== 10) return showError(challangeEndDateInput, 'Дата несоответствует формату!');
	// If user sent not an error back(with error message), so will be returned - true
	return !isError(challangeEndDateInput);
}