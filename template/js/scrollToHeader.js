// Bind an event listener
document.getElementById('body').addEventListener('click', scrollToHeader);

function scrollToHeader(event) {
	// Check if the user clicked directly on nav menu header(and not somewhere else)
	if (event.target.classList.contains('navHeader')) {
		let obj = event.target; // to shorten code
		// Getting an header id which helps to find an element to scroll to
		let headerId = obj.getAttribute('headerId');
		// Getting all elements(max = 2) with following headerId
		let headers = document.querySelectorAll('[headerId="'+ headerId +'"]');

		// Creating a variable that will contain an element to scroll(header)
		let header;
		/* Due to we have max 2 elems with equal headerId, so its easy to remove that one which is responsible
		only for navigation(it contains .navHeader class). Its not a real header element that we need.*/
		if (headers[0].classList.contains('navHeader')) header = headers[1];
		else header = headers[0];

		/* Defining a length to scroll
			scrollToPx = current Scroll + amount of px from top of window by header - 50px(To show menu and not to hide header);
		*/
		let scrollToPx = window.pageYOffset + header.getBoundingClientRect().y - 50;
		let scrollDurationMs = 500;
		// Running function which will scrolll to needed element from scroll.js
		doScrolling(scrollToPx, scrollDurationMs);
	}
}