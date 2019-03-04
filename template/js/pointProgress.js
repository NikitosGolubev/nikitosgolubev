/*
	---READ BEFORE USE---
	1) Functions: isError(), showError(), removeErrorMessage() are located in main.js
*/

/*** Variables, constants, objects ***/

// Point progress tab which contains form to accomplish progress in some challange
const pointProgressTab = document.getElementById('pointProgressTab');

/*
	Min and max amount of characters for values of following notes
*/
const minLengthOfDiaryNoteHeader = 5;
const maxLengthOfDiaryNoteHeader = 50;

const minLengthOfDiaryNoteText = 100;
const maxLengthOfDiaryNoteText = 3000;

// Object that contains all the inputs which the point progress form is consisted on
let pointPorgressInputs = {
	dayResult: document.querySelectorAll('.dayResult'), // radio
	needToMakeDiaryNote: document.getElementById('needToMakeDiaryNote'), // checkbox
	diaryNoteHeader: document.getElementById('diaryNoteHeader'), // text input
	diaryNoteText: document.getElementById('diaryNoteText'), // text input

	// Input that serves as storage of challange id to understand further what challange to edit(progress)
	challangeId: document.getElementById('challangeIdHiddenInput') // hidden input
}

// Array of inputs that are used to make a noute in diary of challange
const diaryNoteInputs = [pointPorgressInputs.diaryNoteHeader, pointPorgressInputs.diaryNoteText];

/*** Event listeners ***/

// Event listeners that are bineded on elements, which should be defined by classname or another multiple selector
document.getElementById('body').addEventListener('click', (event) => {
	openPointProgressTab(event);
	closePointProgressTab(event);
});

// Function that runs when user tries to send a form and point a progress
document.getElementById('pointProgress').addEventListener('click', pointProgress);

/*
	Event that runs function that enables or disables opportunity to fill diary note inputs
	depend on state of checkbox
*/
pointPorgressInputs.needToMakeDiaryNote.addEventListener('change', changeStateOfDiaryNoteInputs);

// This events run a function that removes error state in input if user focuses on it
pointPorgressInputs.diaryNoteHeader.addEventListener('focus', removeErrorMessage);
pointPorgressInputs.diaryNoteText.addEventListener('focus', removeErrorMessage);

/*** Event functions ***/

// Function that get validation result and decide what if the request may be sent to server
function pointProgress(event) {
	let validation = validatePointProgressForm(); // validation inputs and getting result

	// If there are any errors, so I don't send request to server
	if (!validation) event.preventDefault();
}

/*
	function that enables or disables opportunity to fill diary note inputs
	depend on state of checkbox
*/
function changeStateOfDiaryNoteInputs(event) {
	// If checkbox is filled, so - disable, otherwise enable diary note inputs
	if (event.target.checked) disableDiaryNoteInputs(diaryNoteInputs);
	else enableDiaryNoteInputs(diaryNoteInputs);
}

// Function that opens point progress tab
function openPointProgressTab(event) {
	let obj = event.target; // Current object
	// If user clicked on right btn(point progress btn)
	if (obj.classList.contains('pointProgressBtn')) {
		// Finding current challange(inside it btn is contained)
		let currentChallange = findParentByClassName(obj, 'challange'); // look main.js

		// Setting a value to challangeId input from challangeId attribute that is located in .challange elem
		pointPorgressInputs.challangeId.value = currentChallange.getAttribute('challangeId');
		pointProgressTab.style.display = 'flex'; // making point progress tab visible
	}
}

// Function that closes point progress tab
function closePointProgressTab(event) {
	let obj = event.target; // Current object
	// If user clicked on right btn(delete btn)
	if (obj.classList.contains('delete')) {
		/*
			Setting default values to everything
		*/

		pointPorgressInputs.challangeId.value = ''; // empting challangeId input value
		pointProgressTab.style.display = 'none'; // making point progress tab invisible

		// Making first radio btn checked
		pointPorgressInputs.dayResult[0].checked = true;

		// Removing error states if they exists and empting inputs (diary note inputs)
		diaryNoteInputs.forEach((input) => {
			removeErrorMessage(input, false);
			input.value = '';
		});

		// If diary note inputs were disabled, so enable them
		enableDiaryNoteInputs(diaryNoteInputs);
		// If checkbox to not to point progress was checked, so make it otherwise
		pointPorgressInputs.needToMakeDiaryNote.checked = false;
	}
}

/*** Helper functions ***/

// Function that enables opportunity to interract with inputs
function enableDiaryNoteInputs(arrayOfInputs) {
	// loop through array
	arrayOfInputs.forEach((input) => {
		input.removeAttribute('disabled'); // Making inputs value editorial
		input.classList.remove('disabled'); // Removing class that shows that input is disabled
	});
}

// Function that disables opportunity to interract with inputs
function disableDiaryNoteInputs(arrayOfInputs) {
	// loop through array
	arrayOfInputs.forEach((input) => {
		input.setAttribute('disabled', 'disabled'); // Making inputs value inable to be edited
		input.classList.add('disabled'); // Adding class that shows that input is disabled
		input.value = ''; // Empting inputs value
		removeErrorMessage(input, false); // Removing error state in input, if it exists
	});
}

// Function which runs validation of inputs that can contain error and return the result of it
function validatePointProgressForm() {
	if (!pointPorgressInputs.needToMakeDiaryNote.checked) {
		let diaryNoteHeaderValidation = validateTextInput(pointPorgressInputs.diaryNoteHeader, minLengthOfDiaryNoteHeader, maxLengthOfDiaryNoteHeader);
		let diaryNoteTextValidation = validateTextInput(pointPorgressInputs.diaryNoteText, minLengthOfDiaryNoteText, maxLengthOfDiaryNoteText);
		
		// If any validation has passed unsuccesfully, so return false - form is filled incorrectly
		if (!diaryNoteHeaderValidation || !diaryNoteTextValidation) return false;
	}
	return true;
}

// Function that validates text inputs/textareas
function validateTextInput(input, minLength, maxLength) {
	// Getting value of input and cutting all unnecessary spaces
	let inputValue = trim(input.value); // getting value of input (for trim() func - look main.js)

	// Cheking value on amount of characters; It should't be too short and too long
	if (inputValue.length < minLength)
		showError(input, 'Не меньше '+ minLength +' символов!'); // Printing error message
	if (inputValue.length > maxLength)
		showError(input, 'Не больше '+ maxLength +' символов!'); // Printing error message
	
	// If user sent not an error back(with error message), so will be returned - true
	return !isError(input);
}