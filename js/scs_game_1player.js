function StartGame(Difficulty) {
	//$( ":mobile-pagecontainer" ).pagecontainer( "change", "newgame.html?difficulty=" + Difficulty);
	window.location = "game.html?difficulty=" + Difficulty;
}

function GameSetup() {

	//console.log('game setup');

	var difficulty = queryObj()["difficulty"];

	switch(difficulty) {
		case "expert":
			GAME_DIFFICULTY 	= difficulty;
			GAME_SHOW_BORDER 	= true;
			GAME_SHOW_DOTS 		= true;
			GAME_SHOW_BGCOLOR 	= true;
			$('#myTab').show();
			break;
		case "hard":
			GAME_DIFFICULTY 	= difficulty;
			GAME_SHOW_BORDER 	= true;
			GAME_SHOW_DOTS 		= true;
			GAME_SHOW_BGCOLOR 	= true;
			$('#myTab').show();
			break;
		case "medium":
			GAME_DIFFICULTY 	= difficulty;
			GAME_SHOW_BORDER 	= true;
			GAME_SHOW_BGCOLOR 	= true;
			$('#myTab').show();
			break;
		case "tutorial": // tutorial now inaccessible
			GAME_TUTORIAL 		= true;
			GAME_DIFFICULTY 	= 'easy';
			GAME_SHOW_BGCOLOR 	= true;
		default:
			GAME_DIFFICULTY 	= 'easy';
			GAME_SHOW_BGCOLOR 	= true;
			break;
	}

	$('#difficulty').html(GAME_DIFFICULTY);

	// Guess Count and Timer will remain from game to game; must reset them.
	NUMBER_OF_TRIES = 1;
	$('#minutes').html('00');
	$('#seconds').html('00');



	
		// Add the right number of boxes
		var blank_guess     = '<div class="obj J_currentObj" data-value="x" data-bgcolor="y" data-bordertype="z">?</div>'; // default of data-[value] = a non-number

		for (var i=0; i<NUMBER_OF_LOCATIONS; i++) { 
		//	$( ".obj_container" ).append( blank_guess );
		}


		if (GAME_SHOW_BGCOLOR == true) {
			$('#tab_bgcolor').show();
			$('#prev_guess_legend_bgcolor').show();
		}

		if (GAME_SHOW_BORDER == true) {
			$('#tab_border').show();
			$('#prev_guess_legend_border').show();
		}

		if (GAME_SHOW_DOTS == true) {
			$('#tab_dots').show();
			$('#prev_guess_legend_dot').show();
		}


	var ShowTimer = Setting_ShowTimer_Get();

	if (ShowTimer == 'yes') {
		$("#container_timer").show();
	}


    GetWinningCombination();
    Clock.start();

}


function GetWinningCombination() {

	// clear out prior to starting each round, 
	// otherwise it'll retain from the last game
	arrFinal = []; 

	// UPGRADE:
	// scroll through the objects instead of using another array
	// also, use a single function instead of multiple (one for Number, BgColor, etc)

	arrUsedBgColors = [];
	arrUsedBorder	= [];
	arrUsedValues 	= [];

    // Get the winning combination:
    // 		First get the combination of the unique values
    // 		then put it into arrFinal as objects

	// Background Color
    if (GAME_SHOW_BGCOLOR == true) {
    
	    while (arrUsedBgColors.length < NUMBER_OF_LOCATIONS) {
 			index  	= Math.floor(Math.random() * (arrPossibleBgColors.length) );
 			value 	= arrPossibleBgColors[index];

			// Ensure values are unique: if item is NOT in the array, add it in
			if( $.inArray(value, arrUsedBgColors) == -1 ){
				arrUsedBgColors.push(value);
			}
			
	    }
    }

   	// Border Color
    if (GAME_SHOW_BORDER == true) {

		while (arrUsedBorder.length < NUMBER_OF_LOCATIONS) {
		  
 			index  	= Math.floor(Math.random() * (arrPossibleBorder.length) );
 			value 	= arrPossibleBorder[index];

			// Ensure values are unique: if item is NOT in the array, add it in
			if( $.inArray(value, arrUsedBorder) == -1 ){
				arrUsedBorder.push(value);
			}
	    }
    }


 	if (GAME_SHOW_DOTS == true) {

	    // The Number
	    while (arrUsedValues.length < NUMBER_OF_LOCATIONS) {

		    index  	= Math.floor(Math.random() * (arrPossibleValues.length) );
			value 	= arrPossibleValues[index];

			// Ensure values are unique: if item is NOT in the array, add it in
			if( $.inArray(value, arrUsedValues) == -1 ){
				arrUsedValues.push(value);
			}
	    }
    }    


    // Add to arrFinal
    i = 0;
    while (arrFinal.length < NUMBER_OF_LOCATIONS) {

		arrFinal.push( new myObject(arrUsedValues[i], arrUsedBgColors[i], arrUsedBorder[i]) );
		i++;

    }

	$('#winning_combination').html(''); // reset incase the user hits "back" and then "forward"

	// the winning combination
	for (var i=0; i<NUMBER_OF_LOCATIONS; i++) {

			xx = ''
			xx = xx + '<li>';
			xx = xx + '	<div class="border border_' + arrFinal[i].bordertype + '">';
			xx = xx + '		<div class="background background_' + arrFinal[i].bgcolor + '">';
			xx = xx + '			<div class="dot dot_' + arrFinal[i].thevalue + '">';
			xx = xx + '          </div>';
			xx = xx + '       </div>';
			xx = xx + '  </div>';
			xx = xx + '</li>';

			$('#winning_combination').append(xx);
	}

	//console.log(arrUsedValues);
	//console.log('winning background: ' + arrUsedBgColors);
	//console.log(arrUsedBorder);

}

function myObject(thevalue, bgcolor, bordertype){	
	this.bgcolor 	= bgcolor;
	this.bordertype	= bordertype
	this.thevalue 	= thevalue;
};

function RunTutorial() {

	var arrColorsTheyGuessed 	= [];
	var arrColorsNotInSolution 	= [];

	var error_no_blanks_allowed 	= false;
	var error_no_duplicates_allowed = false;

	switch (GAME_TUTORIAL_STEP) {

		case 0:

			// Generate new solution:
			// - item NOT in solution
			// - item they guessed in position 2 (correct)
			// - item they guessed in position 3 (correct)
			// - item they guessed in position 1 (right color, wrong position)

			// find the 2 colors that they did NOT use
			guesses 					= $( ".current_row>li.obj" ).find(".background");
			data_attribute_checking		= 'data-bgcolor';

			$.each( guesses, function( GuessKey, value ) {
				current_guess 	= $(guesses[GuessKey]).attr(data_attribute_checking);
				
				if (current_guess == '') {
					error_no_blanks_allowed = true;
				}

				if ( $.inArray( current_guess , arrColorsTheyGuessed)  !== -1 ) {
					error_no_duplicates_allowed = true;
				}

				arrColorsTheyGuessed.push(current_guess);
			});

			if (error_no_blanks_allowed == true) {
				alert('Each of the 4 boxes needs a color');
				return false;
			}


			if (error_no_duplicates_allowed == true) {
				alert('Select 4 different colors');
				return false;
			}

			$.each( arrPossibleBgColors, function( key, value ) {
				if ( $.inArray( value , arrColorsTheyGuessed)  == -1 ) {
					arrColorsNotInSolution.push(value)
				}
			});

			//console.log('They Guessed: ' + arrColorsTheyGuessed);
			//console.log('not in solution:' + arrColorsNotInSolution);
			
			arrFinal = []; 
			arrUsedBgColors = [];
			arrUsedBgColors.push(arrColorsNotInSolution[0]);
			arrUsedBgColors.push(arrColorsTheyGuessed[3]);
			arrUsedBgColors.push(arrColorsTheyGuessed[2]);
			arrUsedBgColors.push(arrColorsTheyGuessed[1]);


		    i = 0;
		    while (arrFinal.length < NUMBER_OF_LOCATIONS) {
				arrFinal.push( new myObject(arrUsedValues[i], arrUsedBgColors[i], arrUsedBorder[i]) );
				i++;
		    }


		 	$('#winning_combination').html(''); // reset

			// re-populate
			for (var i=0; i<NUMBER_OF_LOCATIONS; i++) {

				xx = ''
				xx = xx + '<li>';
				xx = xx + '	<div class="border border_' + arrFinal[i].bordertype + '">';
				xx = xx + '		<div class="background background_' + arrFinal[i].bgcolor + '">';
				xx = xx + '			<div class="dot dot_' + arrFinal[i].thevalue + '">';
				xx = xx + '          </div>';
				xx = xx + '       </div>';
				xx = xx + '  </div>';
				xx = xx + '</li>';

				$('#winning_combination').append(xx);
			}


			// remove objective, display first set of instructions
			$("#instructions").delay(500).fadeTo("slow", 0.00, function(){ //fade
			     $(this).slideUp("slow", function() { //slide up
			        $(this).remove(); //then remove from the DOM							
					
					$('.tutorial_first_position_color').html( arrColorsNotInSolution[0] );
					$('#my_guess_selection').hide();
					$('#container_btnGuess').hide();
					$("#page-tutorial_dialog").show();
					$('.guesses-count').html('1');
					$('#previous_guesses').show();
			     });
			 });
		
			var new_round = $(".current_row").clone();
			$( new_round ).removeClass('current_row').addClass('obj_guess').removeClass('obj_container');

			countRightBkgroundRightPosition = 1;
			countRightBkgroundWrongPosition = 3;

			var PerfectResult = '';
			var Results = '';
			Results  = '<li class="last">';
			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundRightPosition + '</span>';
			Results += '</p>';
			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundWrongPosition + '</span>';
			Results += '</p>';
			Results += "</li>";

			$( new_round ).append(Results);
			$( "#insert_previous_guess_here" ).prepend( new_round );

			// Update Step 2, as long as I have the variables
			$('.tutorial_second_position_color').html( arrColorsTheyGuessed[3] );
			$('.tutorial_fourth_position_color').html( arrColorsTheyGuessed[1] );

		break;

		case 1:

			// if it's not the intended solution, notify and change the current guess
			var arrTutorialStepTwoShouldBe 	= [];
			var arrTheyJustGuessed 			= [];

			arrTutorialStepTwoShouldBe.push( $('.tutorial_first_position_color').html() );
			arrTutorialStepTwoShouldBe.push(arrUsedBgColors[3]);
			arrTutorialStepTwoShouldBe.push(arrUsedBgColors[2]);
			arrTutorialStepTwoShouldBe.push(arrUsedBgColors[1]);

			guesses 					= $( ".current_row>li.obj" ).find(".background");
			data_attribute_checking		= 'data-bgcolor';

			$.each( guesses, function( GuessKey, value ) {
				current_guess 	= $(guesses[GuessKey]).attr(data_attribute_checking);				
				arrTheyJustGuessed.push(current_guess);
			});

			var strTutorialStepTwoShouldBe 	= JSON.stringify(arrTutorialStepTwoShouldBe);
			var strTheyJustGuessed 			= JSON.stringify(arrTheyJustGuessed);

			if ( strTutorialStepTwoShouldBe != strTheyJustGuessed) {

				alert("You were supposed to move ONLY the " + $('.tutorial_first_position_color').html() + " to the first position.\n\nLet's pretend that's what you did.");

				$( "ul.current_row > li > div> div:eq(0)" ).removeClass('background_blank background_green background_pink background_orange background_blue background_yellow background_red background_white').addClass( 'background_' + $('.tutorial_first_position_color').html()  );
				$( "ul.current_row > li > div> div:eq(1)" ).removeClass('background_blank background_green background_pink background_orange background_blue background_yellow background_red background_white').addClass( 'background_' + (arrUsedBgColors[3])  );
				$( "ul.current_row > li > div> div:eq(2)" ).removeClass('background_blank background_green background_pink background_orange background_blue background_yellow background_red background_white').addClass( 'background_' + (arrUsedBgColors[2])  );
				$( "ul.current_row > li > div> div:eq(3)" ).removeClass('background_blank background_green background_pink background_orange background_blue background_yellow background_red background_white').addClass( 'background_' + (arrUsedBgColors[1])  );

				$( "ul.current_row > li > div> div:eq(0)" ).attr('data-bgcolor', $('.tutorial_first_position_color').html() );
				$( "ul.current_row > li > div> div:eq(1)" ).attr('data-bgcolor', (arrUsedBgColors[3]) );
				$( "ul.current_row > li > div> div:eq(2)" ).attr('data-bgcolor', (arrUsedBgColors[2]) );
				$( "ul.current_row > li > div> div:eq(3)" ).attr('data-bgcolor', (arrUsedBgColors[1]) );

			}

			

			var new_round = $(".current_row").clone();
			$( new_round ).removeClass('current_row').addClass('obj_guess').removeClass('obj_container');

			countRightBkgroundRightPosition = 2;
			countRightBkgroundWrongPosition = 4;

			var PerfectResult = '';
			var Results = '';
			Results  = '<li class="last">';
			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundRightPosition + '</span>';
			Results += '</p>';

			PerfectResult = ' class="perfect_result"';

			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundWrongPosition + '</span>';
			Results += '</p>';
			Results += "</li>";

			$( new_round ).append(Results);
			$( "#insert_previous_guess_here" ).prepend( new_round );


			RemoveColorsNotInSolution();

			$('#tutorial_reminder_1').hide();
			$('.guesses-count').html('2');
			$('#tutorial_title').html('How To Play (2 of 3)');
			$('#tutorial_2_1').show();

			$('#my_guess_selection').hide();
			$('#container_btnGuess').hide();
			$("#page-tutorial_dialog").show();

			localStorage.setItem('TutorialComplete', 'yes');
			
		break;

		case 2:
			// validate they should be here, otherwise don't proceed
			guesses 					= $( ".current_row>li.obj" ).find(".background");
			data_attribute_checking		= 'data-bgcolor';

			var arrTheyJustGuessed 			= [];

			$.each( guesses, function( GuessKey, value ) {
				current_guess 	= $(guesses[GuessKey]).attr(data_attribute_checking);				
				arrTheyJustGuessed.push(current_guess);
			});

			var strUsedBgColors 		= JSON.stringify(arrUsedBgColors);
			var strTheyJustGuessed 		= JSON.stringify(arrTheyJustGuessed);

			//console.log(strUsedBgColors);
			//console.log(strTheyJustGuessed);
			if ( strUsedBgColors != strTheyJustGuessed) {

				var RealAnswer = "";

				$.each( arrUsedBgColors, function( GuessKey, value ) {
					RealAnswer = RealAnswer  + value + ', ';
				});

				RealAnswer = RealAnswer.substring(0, RealAnswer.length - 2)

				alert("The correct order should be: " +  RealAnswer + ".\n\nTry again.");

				return false;
			}




			var new_round = $(".current_row").clone();
			$( new_round ).removeClass('current_row').addClass('obj_guess').removeClass('obj_container');

			countRightBkgroundRightPosition = 4;
			countRightBkgroundWrongPosition = 4;

			var PerfectResult = ' class="perfect_result"';
			var Results = '';
			Results  = '<li class="last">';
			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundRightPosition + '</span>';
			Results += '</p>';

			PerfectResult = ' class="perfect_result"';

			Results += '<p>';
			Results += '<span ' + PerfectResult + '>' + countRightBkgroundWrongPosition + '</span>';
			Results += '</p>';
			Results += "</li>";

			$( new_round ).append(Results);
			$( "#insert_previous_guess_here" ).prepend( new_round );

			$('#tutorial_reminder_2').hide();
			$('.guesses-count').html('3');
			$('#tutorial_title').html('Congratulations!');
			$('#tutorial_3_1').show();

			$('#my_guess_selection').hide();
			$('#container_btnGuess').hide();
			$("#page-tutorial_dialog").show();

			// Toggle so they can play the game

		break;

	}

	GAME_TUTORIAL_STEP++;

}

function TutorialGoToStepOnePartTwo() {
	$('#tutorial_1_1').hide();
	$('#tutorial_1_2').show();
	$('#tutorial_title').html('Right now...');
}

function TutorialCloseStepOne(){
	$('#tutorial_1_2').hide();
	$('#page-tutorial_dialog').hide();
	$('#my_guess_selection').show();
	$('#container_btnGuess').show();
	$('#tutorial_reminder_1').show();

	$(function(){
	    // Self-executing recursive animation
	    (function pulse(){
	        $( "#tutorial_reminder_1" ).delay(200).animate({'opacity':1}).delay(3000).animate({'opacity':0},pulse);
	    })();
	});

}

function TutorialCloseStepTwo() {
	$('#tutorial_2_1').hide();
	$('#page-tutorial_dialog').hide();
	$('#my_guess_selection').show();
	$('#container_btnGuess').show();
	$('#tutorial_reminder_2').show();

	$(function(){
	    // Self-executing recursive animation
	    (function pulse(){
	        $( "#tutorial_reminder_2" ).delay(200).animate({'opacity':1}).delay(3000).animate({'opacity':0},pulse);
	    })();
	});

}


function Guess() {

	/*
	if (GAME_TUTORIAL == true) {
		RunTutorial();
		return false;
	}
	*/

	$('#tutorial_reminder_drag_from_top').hide();

	// Did they win?
	var TheyWon 							= false;
	
	var countRightBkgroundRightPosition 	= 0;
	var countRightBkgroundWrongPosition 	= 0;

	var countRightBorderRightPosition 		= 0;
	var countRightBorderWrongPosition 		= 0;

	var countRightDotRightPosition 			= 0;
	var countRightDotWrongPosition 			= 0;

	var x;

	x = ValidateGuess('background');
	countRightBkgroundRightPosition = x[0];
	countRightBkgroundWrongPosition = x[1];	
	//console.log('Background: right: ' + x[0] + ' wrong: ' + x[1]);

	x = ValidateGuess('border');
	countRightBorderRightPosition = x[0];
	countRightBorderWrongPosition = x[1];
	//console.log('Border: right: ' + x[0] + ' wrong: ' + x[1]);

	x = ValidateGuess('dots');
	countRightDotRightPosition = x[0];
	countRightDotWrongPosition = x[1];
	//console.log('Dots: right: ' + x[0] + ' wrong: ' + x[1]);

		// Possible upgrade:
		// loop through all guesses at once
		// also
		// once they get all (4) right (but not the right position),
		// 		recreate the "cycle" to only show them / hide the ones that aren't used


     // Append their guess to the end - even if they win on this round
		
		// Copy the last row in preparation for the next ("new") last row
		var new_round = $(".current_row").clone();

		// make sure we don't copy this NEW row
		$( new_round ).removeClass('current_row');

		// add "obj_guess" and remove "obj_container"
		$( new_round ).addClass('obj_guess').removeClass('obj_container');

		// potential upgrade: remove JC_item_draggable from children
		


		/*
			<li class="last">
	            <p> <span >2</span><span>1</span><span>3</span></p>
	            <p> <span >1</span><span>1</span><span>0</span></p>
       		</li>
		*/

		// START Show the Results
			
			var PerfectResult = '';

			var Results = '';
			Results  = '<li class="last">';


			// Right Item but the WRONG Position
				
				Results += '<p>';

				if (GAME_SHOW_BGCOLOR == true) {
					
					if (NUMBER_OF_LOCATIONS == countRightBkgroundWrongPosition) {
						PerfectResult = ' class="perfect_result"';
						RemoveColorsNotInSolution();
					} else {
						PerfectResult = '';
					}

					Results += '<span ' + PerfectResult + '>' + countRightBkgroundWrongPosition + '</span>';
				}

				if (GAME_SHOW_BORDER == true) {

					if (NUMBER_OF_LOCATIONS == countRightBorderWrongPosition) {
						PerfectResult = ' class="perfect_result"';
						RemoveBordersNotInSolution();
					} else {
						PerfectResult = '';
					}

					Results += '<span ' + PerfectResult + '>' + countRightBorderWrongPosition + '</span>';
				}

				if (GAME_SHOW_DOTS == true) {

					if (NUMBER_OF_LOCATIONS == countRightDotWrongPosition) {
						PerfectResult = ' class="perfect_result"';
						RemoveDotsNotInSolution();
					} else {
						PerfectResult = '';
					}
					
					Results += '<span ' + PerfectResult + '>' + countRightDotWrongPosition + '</span>';
				}

				Results += '</p>';


			// Right Item AND Right Position
				
				Results += '<p>';

				if (GAME_SHOW_BGCOLOR == true) {

					if (NUMBER_OF_LOCATIONS == countRightBkgroundRightPosition) {
						PerfectResult = ' class="perfect_result"';
					} else {
						PerfectResult = '';
					}

					Results += '<span ' + PerfectResult + '>' + countRightBkgroundRightPosition + '</span>';

				}

				if (GAME_SHOW_BORDER == true) {

					if (NUMBER_OF_LOCATIONS == countRightBorderRightPosition) {
						PerfectResult = ' class="perfect_result"';
					} else {
						PerfectResult = '';
					}

					Results += '<span ' + PerfectResult + '>' + countRightBorderRightPosition + '</span>';
				}

				if (GAME_SHOW_DOTS == true) {

					if (NUMBER_OF_LOCATIONS == countRightDotRightPosition) {
						PerfectResult = ' class="perfect_result"';
					} else {
						PerfectResult = '';
					}

					Results += '<span ' + PerfectResult + '>' + countRightDotRightPosition + '</span>';
				}

				Results += '</p>';




			Results += "</li>";
		// END show the Results

		$( new_round ).append(Results);

		// actually append it in
		$( "#insert_previous_guess_here" ).prepend( new_round );


		//var guesses 	= $( ".current_row>li.obj" ).find(".background");
		//$( new_round ).find('.background').removeClass('JC_item_draggable').addClass('background_green');

		// Update the number of tries
		$( ".guesses-count" ).html(NUMBER_OF_TRIES);
		$( "#total_guesses" ).html(NUMBER_OF_TRIES);
		
		
    


 	// Check if they won
 	// Done AFTER the last guess is appended

	// auto-set these to win if they're not in use
	if (GAME_SHOW_BGCOLOR == false) {
		intCorrectBgColor = NUMBER_OF_LOCATIONS;
	}

	if (GAME_SHOW_BORDER == false) {
		countRightBorderRightPosition = NUMBER_OF_LOCATIONS;
	}


	if (GAME_SHOW_DOTS == false) {
		countRightDotRightPosition = NUMBER_OF_LOCATIONS;
	}

  	if (
      	(countRightBkgroundRightPosition == NUMBER_OF_LOCATIONS) &&
      	(countRightBorderRightPosition 	== NUMBER_OF_LOCATIONS) &&
      	(countRightDotRightPosition == NUMBER_OF_LOCATIONS)
  	) {
		TheyWon = true;
  	}


  	if (AUTO_WIN == true) {
  		TheyWon = true;
  	}


     if (TheyWon == true) {

		if (NUMBER_OF_TRIES ==1) {
			winning_tries_text = "1 try ";
			alert("You solved it on your first try?!\n\nYou must be incredibly lucky... or you're cheating.\n\nEither way, good job!");
		} else {
			winning_tries_text = NUMBER_OF_TRIES + " tries ";
		}

		$("#instructions").hide();
		$('#what_the_numbers_mean_2').hide();
		$("#previous_guesses").show();



		$('#winning_tries_and_time').html( winning_tries_text + " in " + $('#minutes').html() + ":" + $('#seconds').html() );

		// Get original array of high scores
		// to compare if they got a NEW high score
		RetrieveHighScores( $('#difficulty').html() );
		var OrigHighScore 	= JSON.stringify(arrHighScores);

		Clock.pause();
		AddHighScore();

		var NewHighScore 	= JSON.stringify(arrHighScores);
		if ( OrigHighScore != NewHighScore) {
			$('#NewHighScore').show();
		}

		
		$('#my_guess_selection').hide();
		
		$('#container_btnGuess').hide();
		$('#you_win').show();
		$('#you_win_continue').show();
		$('#container_ad').show();

     } else {

     		if (SHOW_INSPIRATIONAL_TEXT == 0) {

				$("#instructions_header").fadeOut(function() {
				  $(this).text("Not Quite").fadeIn();
				});

				$("#instructions_body").fadeOut(function() {
				  $(this).text("Try again...").fadeIn();
				});

				SHOW_INSPIRATIONAL_TEXT++;

			} 

		
			// remove objective, display the inspirational text
			$("#instructions").delay(1800).fadeTo("slow", 0.00, function(){ //fade
			     $(this).slideUp("slow", function() { //slide up
			         $(this).remove(); //then remove from the DOM

			         // AFTER it fades:
		 			$( "#previous_guesses" ).fadeIn( "slow", function() {

						// Animation complete
						$('#inspirational_text').fadeIn("slow");

						/*
			 				//how_to_read_the_legend
			 				$('#what_the_numbers_mean_2').show();
			 				setTimeout(function(){
						        $('#what_the_numbers_mean_2').fadeOut();
						    },2000);
						*/
					});

			     });
			 });
     }

     NUMBER_OF_TRIES++;

}

function ValidateGuess(ObjectChecking) {

	var intRightPosition 			= 0;
	var intRightObject	 			= 0;

	var arrAlreadyGuessed 			= [];
	
	var guesses 					= ''
	var arrPossibleValues 			= '';
	var data_attribute_checking 	= '';
	var ObjPropertyOfFinalArray		= '';

	switch(ObjectChecking) {
		case 'background':  
			guesses 					= $( ".current_row>li.obj" ).find(".background");
			arrPossibleValues 			= arrUsedBgColors;
			data_attribute_checking		= 'data-bgcolor';
			ObjPropertyOfFinalArray		= 'bgcolor';
		  	break;

		case 'border':  
			guesses 					= $( ".current_row>li.obj" ).find(".border");
			arrPossibleValues 			= arrUsedBorder;
			data_attribute_checking		= 'data-bordercolor';
			ObjPropertyOfFinalArray		= 'bordertype';
		  	break;

		case 'dots':
			guesses 					= $( ".current_row>li.obj" ).find(".dot");
			arrPossibleValues 			= arrUsedValues;
			data_attribute_checking		= 'data-dot';
			ObjPropertyOfFinalArray		= 'thevalue';
		  	break;

	}


 	// Loop through each guess
      $.each( guesses, function( GuessKey, GuessValue ) {
           
       		//current_guess 	= $(guesses[GuessKey]).attr('data-bgcolor');
       		current_guess 	= $(guesses[GuessKey]).attr(data_attribute_checking);

       		// need to convert the string to an integer to compare correctly
       		if (ObjectChecking == 'dots') {
       			current_guess = parseInt(current_guess);
       		}

			// is there an exact match of item + position
			// AND it wasn't already checked
			
            if ( 
            		(arrFinal[GuessKey].ObjPropertyOfFinalArray == current_guess ) &&
					( $.inArray( current_guess , arrAlreadyGuessed)  == -1 ) 
            	) {                
				
					// Updated to dynamically get the right property of arrFinal[GuessKey]
					// (arrFinal[GuessKey].bgcolor == current_guess ) --- original

					intRightPosition++;             

				// right item, wrong position
				// AND wasn't previously checked
            } else if ( 
            	 
            	 ($.inArray( current_guess , arrPossibleValues)  != -1  ) &&
            	 ($.inArray( current_guess , arrAlreadyGuessed)  == -1)

            	 ) { 
                   
                   	// The item is in the solution, but the wrong position
                	// Find the corect position in the solution
                	
                	CorrectPosition = 0;
		            $.each( arrPossibleValues, function( key, val ) {
		            	
		            	if (val  == current_guess ) {
		            		CorrectPosition = key;
		            		return false; // exit loop early
		            	}

		            });

		            // Whatever the user has in that correct position, is it the right one?
		            if ( current_guess == $(guesses[CorrectPosition]).attr(data_attribute_checking) ) {
						intRightPosition++;
						intRightObject++; // The only change between old and new: increment here, too
		            } else {
						intRightObject++;
		            }

             }

             // don't process this guess again
             arrAlreadyGuessed.push(current_guess);
           
	  });

	// return an array of 2 items
	var results = new Array();
	results[0] 	= intRightPosition;
	results[1] 	= intRightObject;

	return results;
}


function RemoveColorsNotInSolution() {
	$.each( arrPossibleBgColors, function( key, value ) {
		if ( $.inArray( value , arrUsedBgColors)  == -1 ) {
			$('#myTabContent > #tab1 > ul > .background_' + value).css('visibility','hidden');
		}
	});
}

function RemoveBordersNotInSolution() {
	$.each( arrPossibleBorder, function( key, value ) {
		if ( $.inArray( value , arrUsedBorder)  == -1 ) {
			$('#myTabContent > #tab2 > ul > .border_' + value).css('visibility','hidden');
		}
	});
}

function RemoveDotsNotInSolution() {
	$.each( arrPossibleValues, function( key, value ) {
		if ( $.inArray( value , arrUsedValues)  == -1 ) {
			$('#myTabContent > #tab3 > ul > .dot_' + value).css('visibility','hidden');
		}
	});
}