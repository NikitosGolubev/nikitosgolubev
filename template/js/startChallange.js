/*** Variables, constants and objects ***/

// Object that contains inputs in create tab. Needed to shorten and to butify code further
let challangeInputs = {
	name: document.getElementById("challangeName"),
	days: document.getElementById("lastDays"),
	maxLostDays: document.getElementById("maxLostDays"),
	startDate: document.getElementById("startDate"),
	endDate: document.getElementById("endDate")
}

/*** Event listeners ***/

// A group of events which are related with click on body(so click on some particular class)
document.getElementById('body').addEventListener('click', (event) => {
	editOrStartSimilarChallange(event);
	hideCreateChallangeTab(event);
	showCreateChallangeTab(event);
});

/*** Event functions ***/

/*
	Function which fills inputs of create challange form with some values which are taken from challange
	element attributes or they calculates. Depend on what button user clicked.
*/
function editOrStartSimilarChallange(event) {
	let obj = event.target; // current object

	let currentChallange; // will further contain challange
	// Variables that will contain values that should be set to inputs
	let challangeName, challangeDays, challangeMaxLostDays, challangeStartDate, challangeEndDate;
	/*
		Boolean type. Checks if user clicked on btn that fits purpose of creating
		'create' challange form with some filled data
	*/
	let isAllowedElement = obj.classList.contains('startSimilarChallange') || obj.classList.contains('editChallange');

	// Checking if user clicked on approved element
	if (isAllowedElement) {
		// Getting current challange
		currentChallange = findParentByClassName(event.target, 'challange'); // look main.js
		// If challange was found
		if (currentChallange) {
			// Getting data about challange which is contained in special attributes
			challangeName = currentChallange.getAttribute('challangeName');
			challangeDays = currentChallange.getAttribute('days');
			challangeMaxLostDays = currentChallange.getAttribute('maxLostDays');
		} else return false;
	}

	// To start similar challange
	if (obj.classList.contains('startSimilarChallange')) {
		// Getting current date which is by default will be suggested to user when to start challange
		challangeStartDate = getCurrentFormatedDate();
		// Calculating expiring date
		challangeEndDate = getCalculatedFormatedDate('+', challangeDays);
	}

	// To edit challange
	if (obj.classList.contains('editChallange')) {
		// Getting current values from challange attributes
		challangeStartDate = currentChallange.getAttribute('startDate');
		challangeEndDate = currentChallange.getAttribute('endDate');
	}

	// Checking if user clicked on approved element
	if (isAllowedElement) {
		// Setting values to inputs
		challangeInputs.name.value = challangeName;
		challangeInputs.days.value = challangeDays;
		challangeInputs.maxLostDays.value = challangeMaxLostDays;
		challangeInputs.startDate.value = challangeStartDate;
		challangeInputs.endDate.value = challangeEndDate;
	}
}

// Show create challange tab
function showCreateChallangeTab(event) {
	// If right btn was clicked
	if (event.target.classList.contains('startSimilarChallange') 
		|| event.target.classList.contains('startChallange')
		|| event.target.classList.contains('editChallange'))
		makeVisibleFlex('.createChallange'); // look at main.js
}

// Hides create challange tab
function hideCreateChallangeTab(event) {
	// If user clicked on delete btn
	if (event.target.classList.contains('delete')) {
		// Removing error states from inputs (otherwise they'll be visible on the next opening)
		for (let input in challangeInputs) {
			removeErrorMessage(challangeInputs[input], false);
			challangeInputs[input].value = ''; // and empty its value to not to see old ones if user click on simple create btn
		}
	}
	makeInvisibleSmth(event.target, '.createChallange', 'delete'); // look at main.js
}

/*** Helper functions ***/