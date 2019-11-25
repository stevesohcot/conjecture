// START Initial setup
//      called on the first time it's loaded
//      Global variables

    $(document).bind("mobileinit", function(){
      //$.mobile.defaultPageTransition = "slide";
    });

    var arrFinal                = []; // store the solution for each puzzle

    var arrUsedBgColors         = []; // store items that are in the final solution
    var arrUsedBorder           = [];
    var arrUsedValues           = [];

    var NUMBER_OF_TRIES         = 1; // attempts in each round of the individual game
    var SHOW_INSPIRATIONAL_TEXT = 0; // tell user they didn't win; how to read the results
    
    var arrPossibleBgColors     = ['green','orange','blue','yellow','red','white'];
    var arrPossibleBorder       = ['green','orange','blue','yellow','red','white'];
    var arrPossibleValues       = [1,2,3,4,5,6];

    var AUTO_WIN                = false; // debugging purposes

    var NUMBER_OF_LOCATIONS     = 4;

    var GAME_DIFFICULTY         = 'easy';
    var GAME_SHOW_BGCOLOR       = false;
    var GAME_SHOW_BORDER        = false;
    var GAME_SHOW_DOTS          = false;


    //var GAME_TUTORIAL           = false;
    //var GAME_TUTORIAL_STEP      = 0;



    // this is needed so they don't accidentally "select/highlight" the items
    document.onselectstart = document.onmousedown = function() { return false; }

    

// END Initial setup - called on the first time it's loaded


    // help prevent window from scrolling in iPad
    //$(document).bind('touchmove', false);


    // Potential upgrade: Open the Help Dialog -> pause the timer
    //                          ... and resume timer onClose of the Help


function ShowHelpPage2() {

    $('#subpage1').hide();
    $('#subpage2').show();
    $('#panelTitle').html("If you're wrong");
}


function ShowHelpAdditionalText() {

    var DifficultyPlaying = $('#difficulty').html();
    if (!DifficultyPlaying) {
        DifficultyPlaying = 'easy';
    }
    
    DifficultyPlaying = DifficultyPlaying.toLowerCase();
    $('.help_additional_page1_easy').hide();
    $('.help_additional_page1_medium').hide();
    $('.help_additional_page1_hard').hide();
    $('.help_additional_page1_' + DifficultyPlaying ).show();

    $('.help_additional_page2_easy').hide();
    $('.help_additional_page2_medium').hide();
    $('.help_additional_page2_hard').hide();
    $('.help_additional_page2_' + DifficultyPlaying ).show();

    if (DifficultyPlaying == 'medium') {
        $('.help_object').html('items');
        $('.pic_help').attr('src',function(i,e){
         return e.replace("previous-guess-hint.png","previous-guess-hint-medium.jpg");
        });
    }

    if (DifficultyPlaying == 'hard') {
        $('.help_object').html('items');
        $('.pic_help').attr('src',function(i,e){
         return e.replace("previous-guess-hint.png","previous-guess-hint-hard.jpg");
        });
    }


}


$(document).on('pagebeforeshow', '#page-help2', function(){
  ShowHelpAdditionalText();
});



// Close the Help Dialog: always go back to the "first page"
$(document).on('pagebeforehide', '#page-help-1', function(){
    $('#subpage2').hide();
    $('#subpage1').show();
    $('#panelTitle').html("HOW TO PLAY");
});


$(document).on('pagebeforeshow', '#page-help-1', function(){
    ShowHelpAdditionalText();    
});


$(document).on('pagebeforeshow', "#page-settings",function () {
  
  var x = Setting_ShowTimer_Get();

  if (x == 'yes') {
    $("#BtnSetting_ShowTimer").attr('value', 'Show Timer: Yes');
  }
    
});


$(document).on('pagebeforeshow', "#page-pause",function () {
    var quotes = [
                    "Go ahead, you deserve a break.",
                     "What's wrong, a phone call from mommy?", 
                     "Don't leave me!",
                     "Did Abraham Lincoln get a break?",
                     "I am starting to question your dedication."
                     ];
    $('#catch_phrase').html( quotes[Math.floor(Math.random() * quotes.length)] );
});





$(document).on('pagebeforeshow', '#page-home', function() {
    
    /*
    var TutorialComplete = localStorage.getItem('TutorialComplete');

    // only process if they completed the tutorial
    if (TutorialComplete != null) {
        $('#game_home_difficulties').show();
        $('#game_home_otherbuttons').show();        
    }
    */
    
    // Unlock Medium/Hard if there is a high score for that difficulty
    x = localStorage.getItem('easy');
    if (x != null) {
        $('#medium').removeClass('disabled');
    }

    x = localStorage.getItem('medium');
    if (x != null) {
        $('#hard').removeClass('disabled');
    }

});


$(document).on('pagebeforeshow', "#page-game",function () {
 
    GameSetup();
    changeInstructions();
    jTab();
    draganddrop();

    // Pause the game when the window is loses focus
    Visibility.addListener(function(evt_type, value){
       
      if (evt_type == 'visibility_change') {

        if (value == true) {
            Clock.pause();
        } else {
            Clock.resume();
        }

      }

    });

    // resume the timer if it was in use (comes back from "Help" and "Pause" dialog)
    if (Clock.totalSeconds != 0) {
         Clock.resume();
    }

    var difficulty = $('#difficulty').html();
    if (difficulty == 'medium') {
        $('.help_object').html('items');
        $('.pic_help').attr('src',function(i,e){
         return e.replace("previous-guess-hint.png","previous-guess-hint-medium.jpg");
        });
    }

    if (difficulty == 'hard') {
        $('.help_object').html('items');
        $('.pic_help').attr('src',function(i,e){
         return e.replace("previous-guess-hint.png","previous-guess-hint-hard.jpg");
        });
    }



    $( ".JC_item_droppable" ).draggable({
        drag:function(event, ui){
            InstructDragFromTop();
            return false;
        }
    });





});


$(document).on('pagebeforehide', "#page-game",function () {
   Clock.pause();
});



//$(document).on('click',"li.last",function(){
$(document).on('click',"#previous_guesses",function(){

    $.mobile.changePage("#page-help2");

    /*

        $('#what_the_numbers_mean_2').toggle();

        // Only show for 2 seconds, if visible
        if ( $('#what_the_numbers_mean_2').is(":visible")   ) {
           //how_to_read_the_legend
            setTimeout(function(){
                $('#what_the_numbers_mean_2').fadeOut();
            },2500);
        }
    */

});


$(document).on('click',".JC_item_droppable",function(){
   InstructDragFromTop();
});


function InstructDragFromTop() {
    // a function because it appears twice:
    // if the user clicks on OR tries to drag

    // show it, and have it remain on the screen
    //  until the user guesses

    $('#tutorial_reminder_drag_from_top').show();

    $(function(){
        // Self-executing recursive animation
        (function pulse(){
            $( "#tutorial_reminder_drag_from_top" ).delay(200).animate({'opacity':1}).delay(3000).animate({'opacity':0},pulse);
        })();
    });


}

function jTab(){
    $(".box-row > li").click(function(){
        $(this).addClass("selected").siblings().removeClass("selected");
    });
    $('#myTab li > a').on('click',function(e){
        e.preventDefault();
    });
    $('#myTabContent .tab-pane').hide();
    $('#myTabContent .tab-pane.active').show();
    $('#myTab li').on('click',function(){
        var selected  = $(this).children('a').attr('href');
        $('#myTab li').removeClass('active');
        $(this).addClass('active');
        $('#myTabContent .tab-pane.in').removeClass('active in');
        $('#myTabContent .tab-pane').hide();
        $('#myTabContent '+ selected +'').addClass('active in');
        $('#myTabContent '+ selected +'').show();
    });
}
function changeInstructions(){
    $(".tabs > li > a[href=#tab1]").click(function() {
        $("#hint-value").text("a color");
    });
    $(".tabs > li > a[href=#tab2]").click(function() {
        $("#hint-value").text("a color");
    });
    $(".tabs > li > a[href=#tab3]").click(function() {
        $("#hint-value").text("dots");
    });
}
function draganddrop() {
    var data_class_bg       = "background";
    var data_class_border   = "border";
    var data_class_dot      = "dot";
    var data_bordercolor    = "";
    var data_bgcolor        = "";
    var data_dot            = "";
    var data_parent_class   = "";
    $( ".JC_item_draggable" ).draggable({
        revert:true,
        revertDuration: 0,
        containment: "#my_guess_selection",
        drag:function(event, ui){
            data_parent_class = $(event.target).parent().attr('class');
            if(data_parent_class.indexOf("backgrounds") != -1) {
                data_class_bg = $(event.target).attr('class');
                data_bgcolor = $(event.target).attr('data-bgcolor');
            } else if(data_parent_class.indexOf("borders") != -1){
                data_class_border = $(event.target).attr('class');
                data_bordercolor = $(event.target).attr('data-bordercolor');
            } else if(data_parent_class.indexOf("dots") != -1){
                data_class_dot = $(event.target).attr('class');
                data_dot = $(event.target).attr('data-dot');
            }
        }
    });
    $(".JC_item_droppable").droppable({
        accept: '.JC_item_draggable',
        drop: function(event, ui) {

            if(data_parent_class.indexOf("backgrounds") != -1) {
                $(event.target).children().find('.background').removeClass('background_blank background_green background_pink background_orange background_blue background_yellow background_red background_white').addClass(data_class_bg);
                $(event.target).children().find('.background').attr('data-bgcolor',data_bgcolor);
                $(event.target).children().children().find('.dot').removeClass('question');
            } else if(data_parent_class.indexOf("borders") != -1){
                $(event.target).children('.border').removeClass('border_green border_pink border_orange border_blue border_yellow border_red border_white').addClass(data_class_border);
                $(event.target).children('.border').attr('data-bordercolor',data_bordercolor);
                $(event.target).children().children().find('.dot').removeClass('question');
            } else if(data_parent_class.indexOf("dots") != -1){
                $(event.target).children().children().find('.dot').removeClass('dot_1 dot_2 dot_3 dot_4 dot_5 dot_6 question').addClass(data_class_dot);
                $(event.target).children().children().find('.dot').attr('data-dot',data_dot);
            }

            $(event.target).children().find('.JC_item_draggable').removeClass('JC_item_draggable');

        }
    });
}


// START High Score

    $(document).on('pagebeforeshow', '#page-highscore', function(){

      // menuNavigation - called in body onload
        ShowHighScoreValues('easy');
    });

    $(document).on('click',".nbs-flexisel-nav-right",function(){
        var selected = $('.game-level').children('li').eq(2).text();
        ShowHighScoreValues(selected);

    });
    $(document).on('click',".nbs-flexisel-nav-left",function(){
        var selected = $('.game-level').children('li').eq(0).text();
       ShowHighScoreValues(selected);
    });
    function menuNavigation(){
        $(".game-level").flexisel({
            visibleItems: 1,
            animationSpeed: 1000,
            autoPlay: false,
            autoPlaySpeed: 3000,
            pauseOnHover: true,
            enableResponsiveBreakpoints: false,
            responsiveBreakpoints: {
                portrait: {
                    changePoint:480,
                    visibleItems: 1
                },
                landscape: {
                    changePoint:640,
                    visibleItems: 2
                },
                tablet: {
                    changePoint:768,
                    visibleItems: 3
                }
            }
        });
    }

// END High Score