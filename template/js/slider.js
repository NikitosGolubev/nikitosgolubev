/*** !!!!README!!!! ***/
/*
	Author - Nikita Golubev - Feb25 2018
	WebSite - nikitosgolubev.com
	GitHub - https://github.com/NikitosGolubev
*/
/*
	---How to use this slider libary?
	1) You have to set a UNIQUE id to container which will contains slides
	2) You have to create control(-s) and there: {
		---Required
		Main Control(-s) container has to contain a class SLIDERID_controls
		Previous/Left btn has to contain class name - leftSliderControl
		Next/Right btn has to contain class name - rightSliderControl
		---Not Required
		Navigate points, there container should contain .points class
		Every point would be automaticly specified as .point
		.gotoSlide blocks which will change slide on some particular one if user would click on them
	}
	3) Include slider.js, slider.css and animate.css files
	4) You have to run a slider function below including slider.js file
	5) Put a .notSlide to all children elements of sliderId container which should not behave like slides
	---IMPORTANT
	1) CHECK animate.css IN functions to choose animation you want
	2) Look at slider.css to not to confront to styles(classes)
	and also you can manipulate them according your own purposes
*/

/*** BASIC FUNCTIONS(Builders) ***/

/* MAIN FUNCTION that let slider work 
	---What does it do?
	1) Fills the data about slider into sliderStorage
	2) Creates points, defines slides and basic animation class(.animated, look animate.css library)
	3) Finds first slide, and makes it active(visible) 
	4) Set an active slide which should be visible
	---Arguments:
	sliderId - UNIQUE ID of html element, where slides a contained
	animationName - a name of animate.css class, which defines an animation type of SHOWING slide
	$displayType - define a class which will be responsible for type of display of active slide
	$needPoints - if navigation points are needed or not
*/
function slider(sliderId, animationName, $displayType = "Block", $needPoints = false) {
	// To make our class name valid despite case of string that user typed
	$displayType = ucfirst($displayType.toLowerCase());

	// Fills the data about slider into sliderStorage
	// Format: {sliderUniqueId: Map(sliderData => sliderData)}
	// sliderCounter - index of active slide
	slidersStorage[sliderId] = new Map([
		['sliderCounter', 0], 
		['sliderAnimationType', animationName], 
		['activeClass', "activeSlide"+$displayType], 
		['needPoints', $needPoints]
	]);

	let slider = document.getElementById(sliderId);
	let slides = Array.from(slider.children); // Getting all possible slides
	// Filtering slides, create navigate points, set some required classes
	setNecessaryClassesAndCreatePoints(slides, sliderId, $needPoints);

	// Finds first SLIDE(demanded bcs, there could be .notSlides too)
	let i = 0;
	while (slides[i].classList.contains("notSlide")) {
		i++;
	}
	// And makes it active(visible)
	slides[i].classList.add(slidersStorage[sliderId].get('activeClass'));
}

/*** Important varriables and constants ***/

// Main global storage, which contains all the data about curretly existed sliders on a page
let slidersStorage = {}; // Format: {sliderUniqueId: Map(sliderData => sliderData)}

/*** Event Listeners ***/

// Common event listener for all types of actions that user can take which relates to slider
document.querySelector('body').addEventListener('click', (event) => {
	/*** ATTENTION! ***/
	/* 1) currentSliderId - its a variable which contains current slider id(which uses at the particuar
	moment). BASED ON CONTROLS PANEL CLASS - .SLIDERID_controls*/
	/* 2) getSliderIdByControlsBlock a function which define which slider is related with currently
	using controls system*/

	// IF user clicks on leftBtn(or get previous slide or left arrow, etc...)
	if (event.target.classList.contains('leftSliderControl')) {
		let currentSliderId = getSliderIdByControlsBlock(event);
		changeSlide(event, currentSliderId, "left");
	}

	// IF user clicks on rightBtn(or get next slide or right arrow, etc...)
	if (event.target.classList.contains('rightSliderControl')) {
		let currentSliderId = getSliderIdByControlsBlock(event);
		changeSlide(event, currentSliderId, "right");
	}

	// IF user clicks on point(getting a particular slide, corelated with html element(point))
	if (event.target.classList.contains('point')) {
		let currentSliderId = getSliderIdByControlsBlock(event);
		changeSlide(event, currentSliderId, "point")
	}

	// If there any elements with class .gotoSlide (created to not to run useless cycles)
	if (document.querySelector('.gotoSlide')) {
		// If user click on some element that should change slide on some particular one(number of the slide should be passed in attribute: sid)
		if (event.target.classList.contains('gotoSlide')) {
			let currentSliderId = getSliderIdByControlsBlock(event);
			changeSlide(event, currentSliderId, "gotoSlide")
		}
		// If user clicked to directly on .gotoSlide element, but on its child
		else {
			let parentElem = event.target.parentNode; // getting the first parent element
			// looping through all parents trying to find .gotoSlide element
			while (!parentElem.classList.contains('gotoSlide')) {
				if (parentElem.tagName === "BODY") break; // If nothing found, so break
				parentElem = parentElem.parentNode; // Next parent
			}
			// If during looping, .gotoSlide was found
			if (parentElem.classList.contains('gotoSlide')) {
				// So we change slide
				// Its important to pass TRUE as $noTarget param to each func, bcs we deal not with event object
				let currentSliderId = getSliderIdByControlsBlock(parentElem, true);
				changeSlide(parentElem, currentSliderId, "gotoSlide", true)
			}
		}
	}
});

/* A function which replies to event which imply a slide changing 
---Arguments
event - current event action
sliderId - UNIQUE slider id, which defines the data location in storage]
action - type of slide changing
$noTarget - if event is not an eventObject from eventListener, so we can't use event.target bcs it's a common
DOM element, so in this occasion you need to pass $noTarget = true; to function
*/
function changeSlide(event, sliderId, action, $noTarget = false) {
	// Getting data from storage
	let currentSliderData = slidersStorage[sliderId];

	// Getting all the slides inside slider
	let slides = document.querySelectorAll("#"+sliderId+" .slide");
	// Getting current value of slider counter
	// Basicly - which slide is active currently
	let sliderCounter = currentSliderData.get('sliderCounter');
	// Remembering sliderCounter, bcs it will change
	let oldSlideIndex = sliderCounter;
	// Getting an animation type (animate.css)
	let sliderAnimationType = currentSliderData.get('sliderAnimationType');
	// Get active slide class
	let activeSlideClass = currentSliderData.get('activeClass');
	// Are navigation points are required?
	let needPoints = currentSliderData.get('needPoints');


	// Hiding active slide
	slides[sliderCounter].classList.remove(activeSlideClass);
	// Makes down scroll invisible(bcs of animations)
	document.body.style.overflowX = "hidden";

	/*
		If we have to show previous slide,
		SO, we check if the slide index isnt equals to zero, 
		if so, we set them last index of haystack
		else just substract a unit from current index
	*/
	if (action === 'left') 
		(sliderCounter <= 0) ? sliderCounter = --slides.length : --sliderCounter;
	/*
		If we have to show next slide,
		SO, we check if the slide index isnt equals to last index in haystack, 
		if so, we set them a zero value
		else just add a unit to current index
	*/
	else if (action === 'right')
		(--slides.length == sliderCounter) ? sliderCounter = 0 : ++sliderCounter;
	/*
		If we have to show some slide based on html element(point),
		SO, we get value of attr slideNumber which means index value of slide
	*/
	else if (action === 'point') 
		sliderCounter = event.target.getAttribute('slideNumber');
	else if (action === 'gotoSlide') {
		if ($noTarget) sliderCounter = event.getAttribute('sid');
		else sliderCounter = event.target.getAttribute('sid');
	}

	// Add an animation which will be implemented after every slide showing
	slides[sliderCounter].classList.add(sliderAnimationType);
	// Makes new slide visible
	slides[sliderCounter].classList.add(activeSlideClass);

	// Change classes of points (from active to common and conversly)
	if (needPoints) {
		// Getting all point blocks related to slider
		let pointsBlock = document.querySelectorAll("."+sliderId+"_controls .points");
		if (pointsBlock.length === 1) {
			document.querySelector("."+sliderId+"_controls [slideNumber='"+oldSlideIndex+"']").classList.remove('activePoint');
			document.querySelector("."+sliderId+"_controls [slideNumber='"+sliderCounter+"']").classList.add('activePoint');
		}
		// If the amount of point blocks a greater than 1, so we have to use loop to make changes in each block
		else {
			// A variable which will help to create a condition to run loop through all point blocks
			// Based on that slider index is unique, and can't be repeated in single point block
			let c = document.querySelectorAll("."+sliderId+"_controls [slideNumber='"+oldSlideIndex+"']").length;
			for (let i = 0; i < c; i++) {
				document.querySelectorAll("."+sliderId+"_controls [slideNumber='"+oldSlideIndex+"']")[i].classList.remove('activePoint');
				document.querySelectorAll("."+sliderId+"_controls [slideNumber='"+sliderCounter+"']")[i].classList.add('activePoint');
			}
		}
	}
	
	// Updating slider counter(current active index) in storage
	slidersStorage[sliderId].set('sliderCounter', sliderCounter);
}

/* A function which creates navigate points and define classes
---Arguments
slides - slider children
sliderId - a slider
*/
function setNecessaryClassesAndCreatePoints(slides, sliderId, needPoints) {
	// Getting a block(-s) where points are contained
	let pointsBlock = document.querySelectorAll("."+sliderId+"_controls .points");
	// A variable that will help to realise if I need to run a loop to work with more than 1 point blocks
	let pb = false;
	if (pointsBlock.length === 1) pb = pointsBlock[0]; 

	slides.forEach((slide, index) => {
		// Filtering slides(.notSlide elem doesn't have to possess further classes)
		if (!slide.classList.contains('notSlide')) {
			// Creating points if needed
			if (needPoints) {
				if (pb) createPoint(index, pb);
				// Looping through all point blocks
				else pointsBlock.forEach((block) => createPoint(index, block));
			}

			slide.classList.add('animated'); // animate.css basic class
			slide.classList.add('slide'); // a class which defines a slide
		}
	});
	// Set a class(if needed) which makes a first point active(because of first slide is active too)
	if (needPoints) {
		if (pb) pb.firstElementChild.classList.add('activePoint');
		// Looping through all point blocks
		else pointsBlock.forEach((block) => block.firstElementChild.classList.add('activePoint'));
	}
}

// A function which creates a point, which is responsible to a particular slide
/*
	index - a slide number (from 0 - N)
	pointsBlc - a HTML element which will contains points
*/
function createPoint(index, pointsBlc) {
	// Creating point
	let point = document.createElement("div");

	point.className = 'point'; // set a basic class name
	// set a SLIDE NUMBER attribute which value is equals to slide index in haystack
	point.setAttribute('slideNumber', index);
	pointsBlc.appendChild(point);
}

/* A function which gets a unique slider ID by controls panel */
/* $noTarget - if event is not an eventObject from eventListener, so we can't use event.target bcs it's a common
DOM element, so in this occasion you need to pass $noTarget = true; to function */
function getSliderIdByControlsBlock(event, $noTarget = false) {
	// Looping through all sliders Ids
	for (let sliderId in slidersStorage) {
		let findControlsMainParent; // a variable which will contains first parent
		// Getting first parent node depend on type of event varriable
		if ($noTarget) findControlsMainParent = event.parentNode; // If its not event object
		else findControlsMainParent = event.target.parentNode; // if its event object
		// creating a class which should contain a controls panel
		let controlsClassName = sliderId+"_controls";

		// Looping through all parents until we will get the body tag(means that nothing found)
		// Or we will get a controls panel which contains controlsClassName
		// IF controls panel doesnt contain controlsClassName
		while (!findControlsMainParent.classList.contains(controlsClassName)) {
			if (findControlsMainParent.tagName === "BODY") break;
			// Get next parent
			findControlsMainParent = findControlsMainParent.parentNode;
		}
		// If controls panel(related with sliderId) found, so return sliderId
		if (findControlsMainParent.classList.contains(controlsClassName)) return sliderId;
	}
}

// Makes first letter of string upper case (like in PHP)
function ucfirst(str) {
	// Getting first symbol and making it Upper case
    let f = str.charAt(0).toUpperCase();
    // Paste this symbol at the beginning of the string and return it
    return f + str.substr(1, str.length-1);
}