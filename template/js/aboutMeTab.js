/* Important varriables and constants */

// amount of pixels which user scrolled
// needed to understand if users scrolls up or down
let scrollTopAboutPx = 0;
// (Size) Bg photo that should change its size when user scrolls
// It will be changed while scrolling 
let heightBgPercent = 200; // 100 <= heightBgPercent <= 200

/* Add event listeners */
// Makes visisble a tab with photo and article on click
// makeVisibleFlex() - look main.js
document.getElementById('showDataAboutMe').addEventListener("click", () => makeVisibleFlex("#aboutMe"));
// Starts an animation of fading out elements on click (on close btn)
document.getElementById('closeAbout').addEventListener("click", animateRemoveAbout);
// Removes classes which are respoinsible for fading out animation
// Makes tab invisible (display: none) on the end of animation
document.getElementById('aboutMe').addEventListener("animationend", hideAbout);
// Changes bg(photo) depend when user scrolls About(article) content
document.getElementById('aboutData').addEventListener("scroll", changeMyPhoto);

/*** Events Functions ***/

// A function that bind some animation classes(and starts animation)
function animateRemoveAbout(event) {
	// Bind animation classes
	document.getElementById('aboutData').classList.add("fadeOutDownBig");
	document.getElementById('myPhoto').classList.add("fadeOutUpBig");
	document.getElementById('aboutMe').classList.add("fadeOut"); // make tab invisible

	event.target.style.display = "none"; // make close btn invisible for a while
}

// A function that cancel all previous fade out animations(to not to repeat them on open)
// Makes tab invisible to allow user interact with a site
function hideAbout(event) {
	// Checks if animation that jus ended has a specific name(to not to mistake with opening animations)
	if (event.animationName === "fadeOut") {
		let aboutMe = document.getElementById('aboutMe'); // get tab

		// Unbind animation classes
		document.getElementById('aboutData').classList.remove("fadeOutDownBig");
		document.getElementById('myPhoto').classList.remove("fadeOutUpBig");
		aboutMe.classList.remove("fadeOut");

		// Allow user interact with a site (bcs tab is transparent currently)
		aboutMe.style.display = "none";
		// Make close btn visible(for future opening)
		document.getElementById('closeAbout').style.display = "block";
	}
}

// A functions which changes a bg photo size depend on scrolling About article
function changeMyPhoto(event) {
	// Get scrolled length
	let currentScrollTopPx = event.target.scrollTop;
	// Get block with photo bg
	let myPhoto = document.getElementById("myPhoto");
	// A step which adds to or subtracts from current bg size
	let stepPercent = 2;

	// If previous scrolled length less than current, so its obviously
	// DOWN SCROLL
	// Make bg size less
	if (scrollTopAboutPx < currentScrollTopPx) {
		heightBgPercent -= stepPercent; // decreasing var which responsible for height
		// Validating (100 <= heightBgPercent <= 200)
		if (heightBgPercent <= 200 && heightBgPercent >= 100)
			// Changing bg photo size
			myPhoto.style.backgroundSize = heightBgPercent + "%";
	}
	// If previous scrolled length greater than current, so its obviously 
	// UP SCROLL
	// Increase bg size
	else {
		heightBgPercent += stepPercent; // increasing var which responsible for height
		// Validating (100 <= heightBgPercent <= 200)
		if (heightBgPercent <= 200 && heightBgPercent >= 100)
			// Changing bg photo size
			myPhoto.style.backgroundSize = heightBgPercent + "%";
	}

	// To accomplish this rule - (100 <= heightBgPercent <= 200)
	if (heightBgPercent < 100) heightBgPercent = 100;
	else if (heightBgPercent > 200) heightBgPercent = 200;
	// changing previous scroll top on current
	scrollTopAboutPx = currentScrollTopPx;
}