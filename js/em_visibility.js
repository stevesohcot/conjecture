// https://dl.dropboxusercontent.com/u/2683925/estante-components/js/estante/em_visibility.js

function _visibility() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onvisibilitychange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onvisibilitychange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onvisibilitychange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onvisibilitychange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onvisibilitychange;

    var isHidden = false
    var isBlurred = false

    function onvisibilitychange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = { 
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
            };

        evt = evt || window.event;
        var prevIsHidden = isHidden;
    	//console.info(evt.type)
        if (evt.type in evtMap)
            isHidden = evtMap[evt.type] == h;
        else
            isHidden = this[hidden];
        runOnChangeLater()
    }

    $(window).blur(function(){
    	//console.info('blur')
        var prevIsBlurred = isBlurred;
    	isBlurred = true;
        runOnChangeLater()
    })

    $(window).focus(function(){
    	//console.info('focus')
    	isBlurred = false;
        runOnChangeLater()
    })

    window.addEventListener('message', iframelistener, false);

    var iframeHasFocus = undefined

    function iframelistener(event){
    	//console.log('iframe '+event.data)
    	iframeHasFocus = event.data == 'focus';
    	//console.log('iframeHasFocus: '+iframeHasFocus);
    	runOnChangeLater();
    }

    var state = {
    	willRunLater: false
    	// counter: 0
    };
    function runOnChangeLater(){
    	//console.log('runlater: '+state.willRunLater)
    	if(!state.willRunLater){
    		setTimeout(function(){
    			onchange();
    			state.willRunLater = false;
    		}, 20)
    	}
    	state.willRunLater = true;
    }

    var isReallyHidden = false

    function onchange(){
    	var iframeactive = document.activeElement.tagName.toLowerCase() == 'iframe'
    	var previsReallyHidden = isReallyHidden
    	isReallyHidden = isHidden || (isBlurred && !iframeactive) || (isBlurred && iframeHasFocus == false)
    	if(isReallyHidden != previsReallyHidden){
    		fireListeners('visibility_change', isReallyHidden)
    	}

    	// var s = ''
    	// state.counter++
    	// s += state.counter+': ';
    	// s += 'activeElement='+document.activeElement+', '
    	// s += 'isHidden='+isHidden+', '
    	// s += 'isBlurred='+isBlurred+', '
    	// // s += 'document['+hidden+']='+document[hidden]+', '
    	// s += 'iframeactive='+iframeactive+', '
    	// s += 'iframeHasFocus='+iframeHasFocus+', '
    	// console.log(s)
    }

    function fireListeners(evt_type, value){
    	for (i in listeners){
    		listeners[i](evt_type, value);
    	}
    }

    var listeners = []

    function addListener(f){
    	listeners.push(f)
    }
    function removeListener(f){
    	for(i in listeners){
    		if(f == listeners[i]){
    			listeners.splice(i, 1);
    			break;
    		}
    	}
    }

    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if(isiPad) { //nothing above will be triggered

        var lastTime = new Date().getTime();
        setInterval(function(){
            var now = new Date().getTime();
            var delay = now - lastTime;
            if(delay > 5000){
                fireListeners('wakeup', delay);
            }
            lastTime = now;
        }, 500)
        document.documentElement.ontouchend = function(){
            var now = new Date().getTime();
            lastTime = now;
            dolog('touchend');
        }
    }

    return {
    	addListener: addListener,
    	removeListener: removeListener,
    }
}
var Visibility = _visibility();