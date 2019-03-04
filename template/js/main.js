/* FUNCTIONS WHICH START AT THE BEGINNING OF THE CODE TO FORM HTML, SET RIGHT STYLES AND ETC.*/
fullscreen(); // setting a height to some tabs which has to be fullscreen

/* Important varriables and constants */

// A block that says, that there no content on the page
const nothingBlc = "<div class='nothing' title='Тут ничего нету!'></div>";

/* Add event listeners */

// when window changes it size, so I change height of fullsceen elements
window.addEventListener('resize', fullscreen);

/*** Events Functions ***/

// Makes some element visible(set a flex property to display) BY selector
// If selector isn't unique, so it takes first exemplar of its element
function makeVisibleFlex(selector) {
	document.querySelector(selector).style.display = "flex";
}

// Makes some elemnt insisible after clicking on some delete btn
// You should pass into this func delete btn class name and a selector of element that should be hidden 
// and an elem that should contain certain class
function makeInvisibleSmth(obj, toRemoveElementSelector, deleteBtnClassName) {
	// Check if elem contains a class of delete btn
	if (obj.classList.contains(deleteBtnClassName)) 
		document.querySelector(toRemoveElementSelector).style.display = "none";
}

// A function which sets a fullscreen heigh to block(which has class .fullscreen)
function fullscreen() {
	// Getting .fullscreen elems
	let fullscreenTabs = document.querySelectorAll(".fullscreen");
	// Setting them a css style heigh, where the value is current window height
	fullscreenTabs.forEach(function(value) {
		value.style.height = window.innerHeight+"px";
	});
}

// Function that cut double spaces by reg exp
function trim(str) {
	return str.replace(/\s\s+/g, " ");
}

// Finding particular parent by its className and its child
function findParentByClassName(childElement, parentClassName) {
	let parentResult = childElement.parentNode; // Getting first parent of child
	// Starting loop
	// If element doesnt contain needed className so loop next
	while (!parentResult.classList.contains(parentClassName)) {
		// If body is our parent so its something wrong here, = nothing found
		if (parentResult.tagName === "BODY") return false;
		// Getting next parent element
		parentResult = parentResult.parentNode;
	}
	return parentResult;
}

/*
	Function that pastes 'nothing' block, that says that current page is empty
	selectorOrElem - selector to get element or directly element where 'nothing' block should be added
	$isSelector - varriable that defines if selectorOrElem varriable contains selector
*/
function showNothingBlc(selectorOrElem, $isSelector = false) {
	// If the selector was passed, so getting elem and appending 'nothing' block
	if ($isSelector) document.querySelector(selectorOrElem).innerHTML += nothingBlc;
	// Else if plain element was passed, so just appending 'nothing' block
	else selectorOrElem.innerHTML += nothingBlc;
}

/* 
	Removing error state from input
	obj - event or dom obj
	$isEvent - if its not event, this param should be false
*/
function removeErrorMessage(obj, $isEvent = true) {
	let input = obj;
	if ($isEvent) input = obj.target;
	// if input in error state currently
	if (isError(input)) {
		input.style.background = 'transparent'; // Making bg normal
		input.value = ''; // Removing error message value
		input.setAttribute('error', '0'); // Changing value on error attribute
	}
}

// Function that turn input into error state
function showError(input, errorMessage) { 
	input.style.background = 'rgba(255, 0, 0, 0.3)'; // painting bg into light red
	input.value = errorMessage; // changing value into error message
	input.setAttribute('error', '1'); // setting 1 to error attribute (show that its error input)
	return false;
}

// Defines if input is in error state
function isError(input) {
	// If its error input, so return true, otherwise - false
	if (input.getAttribute('error') === '1') return true;
	return false;
}

/*
	Function which increases or decreases value of number which is stored in some html element
	Created for changing values which contains the numberOfSmth (quantity);
	selector - selector to get needed element
	actionType - '+' or '-' = increase or decrease value
*/
function changeNumberOfSmthAtHTML(selector, actionType) {
	// Getting html elements by selector
	let numberOfSmthElems = document.querySelectorAll(selector);

	// Looping throught the list that I got
	numberOfSmthElems.forEach((elem) => {
		let numberOfSmthValue = +elem.innerHTML; // getting current value and turning it into integer

		// Adding or substracting a '1' depend on value of actionType argument
		if (actionType === '+') numberOfSmthValue++;
		if (actionType === '-') numberOfSmthValue--;

		// Changing value of element
		elem.innerHTML = numberOfSmthValue;
	});
}

// Function which gets value of html element which contains a number
function getValueOfNumberOfSmthAtHTML(selector) {
	// Getting html element by selector
	let numberOfSmthElems = document.querySelector(selector);

	// Turning elems inner html into integer and returning it
	return +numberOfSmthElems.innerHTML;
}