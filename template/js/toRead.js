/*** Event Listeners ***/

// On click on close or open btn
document.getElementById('body').addEventListener('click', manipulateToReadData);
// On click on remove btn
document.getElementById('body').addEventListener('click', removeToReadData);

/*** Event Functions ***/

/* Function that manipulates(shows or hides) data depend on what button was clicked */
function manipulateToReadData(event) {
	let obj = event.target; // current event element
	// If user clicked on open btn
	if (obj.classList.contains('openToReadData'))
		openOrCloseToReadData(obj, true);
	// If user clicked on close btn
	else if (obj.classList.contains('closeToReadData'))
		openOrCloseToReadData(obj, false);
}

// Function that removes toReadDataBlock(visually)
function removeToReadData(event) {
	let obj = event.target; // current event element
	// If user clicked on remove btn
	if (obj.classList.contains('removeToReadData')) {
		let thisToReadDataBlock = getToReadBlock(obj); // getting current block which contains btn
		// And removing him by method removeChild
		thisToReadDataBlock.parentNode.removeChild(thisToReadDataBlock);

		// A variable which will contain a number of items left(loaded and not loaded yet)
		let valueOfNumberOfItemsElem;
		/*
			Decreasing value of amount of some articles. Defining what particularly to decrease by checking
			if the particular block with particular ID is exists on page.
		*/
		if (document.getElementById('savedArticlesContainer')) {
			changeNumberOfSmthAtHTML('.numberOfSavedArticles', "-"); // look main.js for changeNumberOfSmthAtHTML()
			valueOfNumberOfItemsElem = getValueOfNumberOfSmthAtHTML('.numberOfSavedArticles');
		}
		if (document.getElementById('readArticlesContainer')) {
			changeNumberOfSmthAtHTML('.numberOfReadArticles', "-"); // look main.js for changeNumberOfSmthAtHTML()
			valueOfNumberOfItemsElem = getValueOfNumberOfSmthAtHTML('.numberOfReadArticles');
		}

		// if there are no items(.toReadData) left AND the number of items(that are not loaded) equal to 0
		// So in this case, this page is empty, so I show a message to user 
		if (!document.querySelector('.toReadData') && !valueOfNumberOfItemsElem)
			showNothingBlc('#sortedArticlesContainer', true);
	}
}

/*** Helper functions ***/

/*
	Function that opens or closes read block
	obj - current obj of btn that was clicked
	$toOpen - if its true, so data will shown otherwise hidden
*/
function openOrCloseToReadData(obj, $toOpen = true) {
	let thisToReadDataBlock = getToReadBlock(obj); // getting current block which contains btn

	// finding and getting content that should be showed
	let thisToReadDataContent = findAndReturnTextContent(thisToReadDataBlock);

	if ($toOpen) { // If its needed to open(show) read block
		// *Class exchanging
		// Turning open btn into close btn
		obj.classList.remove('openToReadData');
		obj.classList.add('closeToReadData');
		
		thisToReadDataContent.style.display = "block"; // Making content visible
	}
	else { // If its needed to close(hide) read block
		obj.classList.remove('closeToReadData'); // *
		obj.classList.add('openToReadData'); // *
			
		thisToReadDataContent.style.display = "none"; // Making content invisible
	}
}

// Function that gets a toReadDataElement by clicked btn, as it its child
// btnElement - btn which was clicked by user (event.target obj. from event function)
function getToReadBlock(btnElement) {
	// Getting first parent node
	let nextParent = btnElement.parentNode;
	// Looping until toReadDataElement wouldn't be found
	while (!nextParent.classList.contains('toReadData')) {
		nextParent = nextParent.parentNode; // updating variable with new parent element
	}
	// returning toReadDataElement
	return nextParent;
}

// Function that finds content(text that should be showed/hidden) in array of children of toReadDataElement
function findAndReturnTextContent(toReadDataBlock) {
	// Getting HTMLCollection of children of toReadDataBlock and turn it into array
	let toReadDataBlockChildren = Array.from(toReadDataBlock.children);
	// looping through children
	for (let i = 0; i < toReadDataBlockChildren.length; i++) {
		// If element contains particular(.readContent) class name than returning it
		if (toReadDataBlockChildren[i].classList.contains('readContent')) return toReadDataBlockChildren[i];
	}
}