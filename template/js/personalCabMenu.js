/*** Required variables and constants ***/

const cabMenu = document.getElementById('personalCabMenu');
const mainContent = document.querySelector('.cabMainContentWrapper');
const cabMenuBtn = document.getElementById('personalCabMenuBtn');
const mobileCabMenu = document.getElementById('mobileCabMenu');

let isMenuVisible = true; // current state of left Menu
let isMobileMenuVisible = false; // current state of tab Menu
let isMenuWasOpenedBeforeResize = false; // if left Menu was opened before the window was resized, that it disappeared

/*** Event listeners ***/

// Shows or hides left or tab menu depend on window width
cabMenuBtn.addEventListener('click', showOrHideMenu);

// Hides tab menu
document.getElementById('mobileCabMenu').addEventListener("click", (event) => {
	// Hides menu look main.js for makeInvisibleSmth() func description
	makeInvisibleSmth(event.target, "#mobileCabMenu", "delete");
	isMobileMenuVisible = false; // Changing current state of tab menu
});

// Changes menu depend on window width
window.addEventListener('resize', responsiveMenu);

/*** Event functions ***/

// Shows or hides left or tab menu depend on window width
function showOrHideMenu(event) {
	// More than 768px
	// Left menu
	if (window.innerWidth > 768) {
		if (isMenuVisible) hideMenu();
		else showMenu();
	}
	// Less or equal to 768px
	// Tab menu
	else {
		if (!isMobileMenuVisible) {
			isMobileMenuVisible = true; // Changing state
			mobileCabMenu.style.display = "flex"; // Making it visible
		}
	}
}

// Changing menu depend on window width
function responsiveMenu() {
	// More than 768px
	if (window.innerWidth > 768) {
		// Tab menu visible
		if (isMobileMenuVisible) {
			mobileCabMenu.style.display = "none"; // making it invisible
			isMobileMenuVisible = false; // changing current state
			showMenu();
		}
		// If menu had been opened at the time window was resized
		if (isMenuWasOpenedBeforeResize) {
			showMenu();
			isMenuWasOpenedBeforeResize = false; // changing current state
		}
	}
	// Less or equal to 768px AND if left menu is visible
	else if (isMenuVisible) {
		// Remembering that it was opened to open it if width would grater than 768px
		isMenuWasOpenedBeforeResize = true;
		hideMenu();
	}
}

/*** Helper functions ***/

// Function that hides left menu
function hideMenu() {
	isMenuVisible = false; // changing current state
	cabMenu.style.display = "none"; // making it invisible
	mainContent.style.width = '100%'; // setting to main content block valid width (without menu)
	mainContent.style.marginLeft = '0'; // removing margin
	cabMenuBtn.classList.remove('cabMenuVisible'); // removing class from cabMenuBtn (removes opacity from btn)
}

// Function that shows left menu
function showMenu() {
	cabMenu.classList.add('fadeInLeft'); // setting an animation
	isMenuVisible = true; // changing current state
	cabMenu.style.display = 'block'; // making it visible
	mainContent.style.width = 'calc(100% - 250px)'; // setting to main content block valid width (width menu)
	mainContent.style.marginLeft = '30px'; // setting margin
	cabMenuBtn.classList.add('cabMenuVisible'); // adding class to cabMenuBtn (adds opacity to btn)
}