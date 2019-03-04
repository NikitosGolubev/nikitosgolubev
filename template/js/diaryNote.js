/*** Event listeners ***/

// A group of events which are related with click on body(so click on some particular class)
document.getElementById('body').addEventListener('click', (event) => {
	showDiaryNote(event);
	hideDiaryNote(event);
});

/*** Event functions ***/

// Shows diary note
function showDiaryNote(event) {
	// Cheking if diaryNote was clicked or its children were clicked
	let isDiaryNoteWasClicked = true;
	// If user clicked not particularly on .diaryNote, he might clicked on its children
	if (!event.target.classList.contains('diaryNote'))
		// Trying to find diaryNote by element on which user clicked, if its found, so its child of diaryNote
		isDiaryNoteWasClicked = findParentByClassName(event.target, 'diaryNote');
	// If user clicked on .diaryNote or on its children
	if (isDiaryNoteWasClicked)
		makeVisibleFlex('.diaryNoteWindow'); // look at main.js
}

// Hides diary note
function hideDiaryNote(event) {
	makeInvisibleSmth(event.target, '.diaryNoteWindow', 'delete'); // look at main.js
}