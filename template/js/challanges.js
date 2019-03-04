/* 
	!!! LOOK confirmation.js to be aware of aims that can be used and functions that would be used 
	with this aims. You can also set your own aims and functions there to create new situations in which 
	confirmation is required but with different behaviour.
*/

/*** Event listeners ***/

// Events which based on clicking on elements with particular class name
document.getElementById('body').addEventListener('click', (event) => {
	applyForConfirmationForChallangeAction(event);
});

/*** Event functions ***/

// Function with routes and starts confirmation in case if user clicked on allowed btn
// THE ELEMENT(which user clicks) SHOULD BE INSIDE CHALLANGE
function applyForConfirmationForChallangeAction(event) {
	let obj = event.target; // current object

	/*
		Map of class names which if they were clicked, should call for confirmation => aim of confirmation
		For aim of confirmation look at confirmation.js
	*/
	let btnClassNameToAimMap = new Map([
		['endChallangeBtn', aims.endChallange], 
		['cancelPlannedChallange', aims.removeChallange],
		['removeCompletedChallange', aims.removeChallange],
		]);
	
	// Loop throught map
	for (let classNameToAimArrray of btnClassNameToAimMap) {
		// Getting class name (relation: className => aim)
		let className = classNameToAimArrray[0];

		// If user clicked on element with className from map
		if (obj.classList.contains(className)) {
			// Getting current challange
			let currentChallange = findParentByClassName(obj, 'challange'); // look main.js

			// Getting aim (relation: className => aim)
			let aim = classNameToAimArrray[1];
			// Creating arguments map (it includes: current obj, current challange)
			let args = new Map([['obj', obj], ['currentChallange', currentChallange]]);

			confirmation(aim, args); // Call for confirmation
			break; // stoping loop
		}
	}
}

/*
	Function that ends challange, removes it visually, moves it to completed challanges
	args - map with arguments
*/
//!!! XXX --- This func requires interaction with DB so AJAX in demand, use it further --- XXX
function endChallangeInAdvance(args) {
	let obj = args.get('obj'); // current object(element that was clicked)
	let currentChallange = args.get('currentChallange'); // challange which should be ended

	currentChallange.parentNode.removeChild(currentChallange); // removing currentChallange from DOM

	// Decreasing the value of amount of current, active challanges in html elem
	// look main.js for changeNumberOfSmthAtHTML()
	changeNumberOfSmthAtHTML('.numberOfCurrentUserChallanges', "-");
	// Increasing the value of amount of completed challanges in html elem
	changeNumberOfSmthAtHTML('.numberOfCompletedUserChallanges', "+");

	// Contains a number of current challanges left(loaded and not loaded yet)
	let valueOfNumberOfCurrentChallanges = getValueOfNumberOfSmthAtHTML('.numberOfCurrentUserChallanges');

	// If there no chalanges left AT ALL(loaded and not loaded), so print message that this page is empty
	if (!document.querySelector('.challanage') && !valueOfNumberOfCurrentChallanges) 
		showNothingBlc('#challanagesContainer', true);
}

/*
	Function that removes challange from db and visually
	args - map with arguments
*/
//!!! XXX --- This func requires interaction with DB so AJAX in demand, use it further --- XXX
function removeChallange(args) {
	// Unpacking arguments
	let obj = args.get('obj'); // current object(element that was clicked)
	let currentChallange = args.get('currentChallange'); // challange which should be removed

	currentChallange.parentNode.removeChild(currentChallange); // removing currentChallange from DOM

	// Bcs challange is gonna be removed, so I decrease the value of amount of challanges
	// look main.js for changeNumberOfSmthAtHTML() and getValueOfNumberOfSmthAtHTML()
	changeNumberOfSmthAtHTML('.numberOfUserChallanges', "-");

	/*
		This varriable will contain a number of planned or completed challanges left(loaded and not loaded yet)
		after action that was performed with them
	*/
	let valueOfNumberOfSomeChallanges;

	// Decreasing the value of amount of planned or completed challanges(depend on what btn was clicked)
	if (obj.classList.contains('cancelPlannedChallange')) {
		changeNumberOfSmthAtHTML('.numberOfPlannedUserChallanges', "-");
		// Memorizing amount of challanges left
		valueOfNumberOfSomeChallanges = getValueOfNumberOfSmthAtHTML('.numberOfPlannedUserChallanges');
	}
	if (obj.classList.contains('removeCompletedChallange')) {
		changeNumberOfSmthAtHTML('.numberOfCompletedUserChallanges', "-");
		// Memorizing amount of challanges left
		valueOfNumberOfSomeChallanges = getValueOfNumberOfSmthAtHTML('.numberOfCompletedUserChallanges');
	}

	// If there no chalanges left AT ALL(loaded and not loaded), so print message that this page is empty
	if (!document.querySelector('.challanage') && !valueOfNumberOfSomeChallanges)
		showNothingBlc('#challanagesContainer', true);
}