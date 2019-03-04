/* Important varriables and constants */
// a variale which define if top menu is opened currently or not
let live = false;

/* Event Listeners */

/*** MAIN MENU ***/
// when user clicks on burger pick, I open menu(make it visible with display: flex;)
document.getElementById('body').addEventListener("click", (event) => {
	// Checking if user clicked specifically on .burger btn
	if (event.target.classList.contains('burger'))
		makeVisibleFlex("#mainMenu") // Look at main.js to get more about this func
});
// when user wants to shut menu(make it invisible with display: none;)
// Look at main.js to get more about event func
document.getElementById('mainMenu').addEventListener("click", (event) => makeInvisibleSmth(event.target, "#mainMenu", "delete"));

/* --------- */

/*** TOP MENU ***/
// Check if user scrolled enough to show or hide top menu
window.addEventListener('scroll', topMenu);
// Remove animation close classes(to prevent their repeating further) and set dsplay none
// Checking if #fixedMenu exists
if (document.getElementById('fixedMenu'))
	document.getElementById("fixedMenu").addEventListener('animationend', fixTopMenu);

/* Event functions */

// A function which checks current scroll position and decides if its needed to show or hide top menu
function topMenu(event) {
	// Checking if #fixedMenu exists
	if (document.getElementById('fixedMenu')) {
		// a checker which determines on how much has to be scrolled to show or hide top menu
		let showAndCloseBorderPx = 200; 

		if (window.pageYOffset > showAndCloseBorderPx) {
			// Show menu (animation is already set in HTML)
			makeVisibleFlex("#fixedMenu") // look main.js to find a comment to this func
			live = true;
		}
		if (window.pageYOffset < showAndCloseBorderPx) {
			// Bind an animation an visually hide menu (if its opened)
			if (live) document.getElementById('fixedMenu').classList.add("fadeOutUpBig");
			live = false;
		}
	}
}

// A function which fixes top menu after accomplishing an animation
function fixTopMenu(event) {
	// Checks if specifically close animation has ended
	if (event.animationName === "fadeOutUpBig") {
		// Unbind animation class to prevent animation repeating further (For example, on open menu)
		document.getElementById('fixedMenu').classList.remove("fadeOutUpBig");
		// REQUIRED -> display: none;
		document.getElementById('fixedMenu').style.display = "none";
	}
}