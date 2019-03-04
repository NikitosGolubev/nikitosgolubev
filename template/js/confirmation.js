/*** Constants, varriables, objects, arrays ***/

let confirmTab = document.getElementById('confirmationTab'); // confirmation tab element

// Aims and their text codes that can be used (can be expanded)
let aims = {
	endChallange: 'endChallange', // Text code MUST be equal to property in window.settings
	removeChallange: 'removeChallange'
};

/*
	A storage which relates aim codes and function names that should be performed if user agrees with confirmation
	text code of aim => function which should be performed if user agreed
*/
window.settings = {
  endChallange: 'endChallangeInAdvance',
  removeChallange: 'removeChallange'
};

/*
	Variable that is responsible for memorizing additional arguments that should be passed in function
	in case if user agreed with confirmation
*/
let additionalArguments;

/*** Event listeners ***/

// Events which based on clicking on elements with particular class name
document.getElementById('body').addEventListener('click', (event) => {
	performAction(event);
	endConfirmation(event);
});

/*** Event functions ***/

// Functions that ends confirmation. It closes confirmation tab and empties 'aim' attr.
function endConfirmation(event) {
	let obj = event.target; // getting current object
	// Checking if user clicked particularly on needed elements
	if (obj.classList.contains('yes') || obj.classList.contains('no')) {
		additionalArguments = false; // empting additional arguments storage variable
		emptyAimAttr();
		closeConfirmation();
	}
}

// Function which performs needed action if user agreed with confirmation
function performAction(event) {
	let obj = event.target; // getting current object
	// Checking if user clicked particularly on needed element
	if (obj.classList.contains('yes')) {
		let aim = getAim(); // aim of confirmation

		/*
			Getting function name from storage which is related with aim. 
			The key there is that variable will have type of 'function', so I will able to use it to call
			needed function
		*/
		let action = window[settings[aim]];
		// Checking if we returned data has actually a 'function' type, and if so, calling needed function
		if (typeof action === 'function') action(additionalArguments);
	}
}

/*** Main functions, helpers ***/

/*
	Function that opens confirmation tab, set an aim to attribute 'aim' to remember what should be done after
	users choice. 

	aim - target of confirmation
	$args - arguments that can be passed to function that will be performed
*/
function confirmation(aim, $args = false) {
	// If there any args required
	if ($args) additionalArguments = $args; // memorizing arguments
	setAimAttr(aim);
	openConfirmation();
}

// Opens confirmation tab (makes it visible)
function openConfirmation() {
	confirmTab.style.display = 'flex';
}

// Set a value to an 'aim' attribute to memorize the target of confirmation
function setAimAttr(aim) {
	confirmTab.setAttribute('aim', aim);
}

// Closes confirmation tab (makes it invisible)
function closeConfirmation() {
	confirmTab.style.display = 'none';
}

// Empties 'aim' attribute
function emptyAimAttr() {
	confirmTab.setAttribute('aim', '');
}

// Function that gets value of 'aim' attribute and returns it
function getAim() {
	return confirmTab.getAttribute('aim');
}