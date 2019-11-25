function CheatWinningCombo() {
  AUTO_WIN = true;
}

function SetDebugMode(){
  $( ".debug" ).each(function() {
    $( this ).show();
  });
}

function ClearData() {

  var r=confirm("Are you sure?\n\nYou'll erase all your high scores and have to work your way back up to the higher difficulties.");

  if (r==true) {
    localStorage.clear();
    arrHighScores = [];     // reset incase the page isn't refreshed
  }

}

function Setting_ShowTimer_Get() {
  // couldn't get true boolean to work  

  var x = localStorage.getItem('Setting_ShowTimer');

  if ((x == null) || (x == 'no')) {
    return 'no';
  } else {
    return 'yes';
  }

}

function Setting_ShowTimer_Set() {
  var y = Setting_ShowTimer_Get();
  if (y === 'yes') {
    localStorage.setItem('Setting_ShowTimer', 'no');
    $("#BtnSetting_ShowTimer").attr('value', 'Show Timer: No');
  } else {
    localStorage.setItem('Setting_ShowTimer', 'yes');
    $("#BtnSetting_ShowTimer").attr('value', 'Show Timer: Yes');
  }

}


//********************************************
// Other functions not specific to the game
//********************************************

/*

Clock.start();

$('#pauseButton').click(function () { Clock.pause(); });
$('#resumeButton').click(function () { Clock.resume(); });

*/
 
	var Clock = {
	  totalSeconds: 0,

	  start: function () {
	    var self = this;

	    this.interval = setInterval(function () {
	      self.totalSeconds += 1;

	      // /$("#hour").text(Math.floor(self.totalSeconds / 3600));
        $("#minutes").text( GetMinutesFromSeconds(self.totalSeconds) );
        $("#seconds").text( GetSecondsFromSeconds(self.totalSeconds) );

	      // max-out at 23:59
	      if (self.totalSeconds == 86399) {
	      	Clock.pause();
	      }

	    }, 1000);
	  },

	  pause: function () {
	    clearInterval(this.interval);
	    delete this.interval;
	  },

	  resume: function () {
	    if (!this.interval) this.start();
	  }

	};

  // pad numbers for the timer
  function pad(val) {
      var valString = val + "";
      if(valString.length < 2) {
          return "0" + valString;
      } else {
          return valString;
      }
  }


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function GetMinutesFromSeconds(Seconds) {
    return pad( Math.floor(Seconds / 60 % 60));
  }

  function GetSecondsFromSeconds(Seconds) {
    return pad( parseInt(Seconds % 60));
  }

  function queryObj() {
    // Usage:
    // var myParam = queryObj()["myParam"];

      var result = {}, keyValuePairs = location.search.slice(1).split('&');

      keyValuePairs.forEach(function(keyValuePair) {
          keyValuePair = keyValuePair.split('=');
          result[keyValuePair[0]] = keyValuePair[1] || '';
      });

      return result;
  }