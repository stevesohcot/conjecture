var arrHighScores = []; // create Global array

function objScore( tries, seconds, when){
	this.tries 		= tries;
	this.seconds	= seconds
	this.when		= when
};

function SetHighScores(Difficulty) {
	// dynamically enter the name of the Key of the Local Storage
	// will store in in something like localStorage.easy 
	localStorage.setItem(Difficulty, JSON.stringify(arrHighScores));
}

function RetrieveHighScores(Difficulty) {

	arrHighScores = []; // reset - no matter what

	// store in a local variable, incase null
	var RawData = localStorage.getItem(Difficulty);

	// only process if not null
	if (RawData != null) {

		var HighScoresStored = JSON.parse(RawData);
		
		$.each(HighScoresStored, function(i, obj) {
			arrHighScores.push( new objScore(obj.tries, obj.seconds, obj.when) );
		});
	}
}


function AddHighScore() {

	// Add new entry
	var Difficulty 	= $('#difficulty').html();
	var Tries 		= parseInt($('#total_guesses').html());
	var Seconds 	= Clock.totalSeconds;
	var When 		= new Date();

	// Get the current list
	RetrieveHighScores(Difficulty);

	arrHighScores.push( new objScore(Tries, Seconds, When) );	

	// console.log(arrHighScores);

	// Sort
	arrHighScores.sort(
	    firstBy(function (v1, v2) { return v1.tries - v2.tries; })
	    .thenBy(function (v1, v2) { return v1.seconds - v2.seconds; })
	    .thenBy(function (v1, v2) { return v1.when - v2.when; })
	);


		// Only retrieve the top 5 scores
		// Potential upgrade: only store 5 (not 6)
		var TempArray = $.merge([], arrHighScores);
		arrHighScores = []; // reset
		var i = 0;
		$.each(TempArray, function(i, obj) {
			arrHighScores.push( new objScore(obj.tries, obj.seconds, obj.when) );
			i++;
			if (i> 4) return false;			
		});

	// Save it
	SetHighScores(Difficulty);

	// Print out the new High Score list
	//ShowHighScoreValues(Difficulty);
}

function ShowHighScoreValues(Difficulty) {

	if (Difficulty == null) {
		Difficulty = 'easy';
	} else {
		Difficulty = Difficulty.toLowerCase();	
	}

	RetrieveHighScores(Difficulty); // populates arrHighScores

	$("#tblHighScores > tbody").empty();
	
	if ( $(arrHighScores).size() == 0 ) {

		$("#tblHighScores > tbody").append('<tr><td class="col1" colspan="3">No scores yet!</td></tr>');
	
	} else {

		$.each(arrHighScores, function(i, obj) {

			entryTime = GetMinutesFromSeconds(obj.seconds) + ':' +  GetSecondsFromSeconds(obj.seconds);
			entryWhen = new Date( obj.when );
			entryWhen = entryWhen.getMonth() + 1 + '/' + entryWhen.getDate() + '/' + entryWhen.getFullYear();

			$("#tblHighScores > tbody").append('<tr><td class="col1">' + obj.tries + '</td><td class="col2">' + entryTime + '</td><td class="col3">' + entryWhen + '</td></tr>');

		});

	}

}


/*
	https://github.com/Teun/thenBy.js
	// first by length of name, then by population, then by ID
	data.sort(
	    firstBy(function (v1, v2) { return v1.name.length - v2.name.length; })
	    .thenBy(function (v1, v2) { return v1.population - v2.population; })
	    .thenBy(function (v1, v2) { return v1.id - v2.id; });
	);
*/
firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();
