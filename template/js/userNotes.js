/*** Event listeners ***/

document.getElementById('body').addEventListener('click', (event) => {
	openNote(event);
	closeNote(event);
});

/*** Event functions ***/

// Function that opens note content, makes it visible
function openNote(event) {
	// If user clicked on invitation to look at note
	if (event.target.classList.contains('invitationToLook')) {
		event.target.style.display = 'none'; // So, making invitation to look note invisible
		// And main note content visible. Its located lower.
		event.target.nextElementSibling.style.display = 'flex';
	}
}

// Function that closes note content, makes it invisible
function closeNote(event) {
	// If user clicked on dark side around note or on close note btn
	if (event.target.classList.contains('noteInnerWrap') || event.target.classList.contains('closeNote')) {
		// Than getting this object
		let note = event.target;
		// If it doesn't contain .noteInnerWrap class, so look for it, as it class that contains all the note content
		// If it contains .noteInnerWrap class, so I've already got note obj
		if (!event.target.classList.contains('noteInnerWrap'))
			note = findParentByClassName(event.target, 'noteInnerWrap'); // look main.js

		note.style.display = 'none'; // making note content invisible
		// making invitation to look note visible. its located higher.
		note.previousElementSibling.style.display = 'block';
	}
}