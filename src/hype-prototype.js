//Hype Prototype library
// Parameters:
// - data-slides
// - data-remote
// - data-remote-delay

//CONFIG
var speed = 0.8; //transition speed
var transition = "push"; //types of transition: instant, fade, swap, push
// http://mikemurko.com/general/jquery-keycode-cheatsheet/
var nextKeys= [39, 40, 34];
var prevKeys= [37, 38, 33];

//HELPERS
function isHypeLoaded(){
	return !(typeof HYPE === 'undefined');
}
//getHypeDocument: get the main Hype object to work with 
function getHypeDocument(){
	var name = "index";
	for(var key in HYPE.documents){
		name = key;
      	}
      	return HYPE.documents[name];
}

//transitionType: get a transition type
function transitionType(hypeDocument,type){
	var result = [hypeDocument.kSceneTransitionInstant, hypeDocument.kSceneTransitionInstant];
	if(type == "fade"){
		 result = [hypeDocument.kSceneTransitionCrossfade, hypeDocument.kSceneTransitionCrossfade];
	} else if (type == "swap") {
		result = [hypeDocument.kSceneTransitionSwap, hypeDocument.kSceneTransitionSwap];
	} else if (type = "push") {
		result = [hypeDocument.kSceneTransitionPushRightToLeft, hypeDocument.kSceneTransitionPushLeftToRight];
	}
	return result;
}

function getParam(name){
	var result = null;
	var param = $('script').last().attr('data-'+name);
	if(typeof param !== 'undefined'){
		result = param;
	}
	return result;
}

function queryFrame(id, query){
	return $("#"+id+" iframe").contents().find(query);
}


function getScroll(element){
	var el = (typeof element !== "undefined")?element:document;
	return $(el).scrollTop();
}

function scrollTo(pos, element){
	var el = (typeof element !== "undefined")?element:'html,body';
	$(el).animate({
          scrollTop: pos
        }, 500);
}

//NAVIGATION BASED ON URL PARAMETERS


function updateSceneFromHash(){
	var hash = window.location.hash;
	var sceneName=hash.replace('#','');
	var hypeDocument = getHypeDocument();
	if(hash.length == 0){
		sceneName = hypeDocument.sceneNames()[0];
	}
	if(sceneName != hypeDocument.currentSceneName() ){
		hypeDocument.showSceneNamed(sceneName, hypeDocument.kSceneTransitionInstant);
	}
}


//Updates the scene when the hash changes (Does not update on initial hash value)
$(window).bind( 'hashchange', function(e) { 
	updateSceneFromHash();
  			
});


//Updates the scene based on the initial value of the hash (hack to make sure HYPE variable is available).
$(window).load(function (){
    var i = setInterval(function (){
        if (isHypeLoaded()){
            clearInterval(i);
   			updateSceneFromHash();
    	}
    }, 100);
});


//HISTORY SUPPORT

// Back button triggers scene changes.
jQuery(document).ready(function($) {
	if (window.history && window.history.pushState) {
		$(window).on('popstate', function() {
			updateSceneFromHash();
		});
	}
});

//Function to indicate in Hype which transitions get into the history stack
function updateState(){ //Should be called AFTER jumping to the scene.
	var hypeDocument = getHypeDocument();
	var sceneName = hypeDocument.currentSceneName();
	window.history.pushState('forward', null, '#'+sceneName);
}



//INPUT
function getInputFromFrame(name){
	return queryFrame(name,"input").val();
}

function setInputFromFrame(name, value){
	return queryFrame(name,"input").val(value);
}

function animateOnType(element){
	return false;
}


//SLIDES
// only if data-slides = true

//var slidesParam = $('script').last().attr('data-slides');
//var slidesParam = getParam("slides");
//var slides = (!!slidesParam) && (slidesParam.toLowerCase() == "true");
var slides = getParam("slides") && getParam("slides").toLowerCase() == "true";
if(slides){
	$(function(){
		$( "body" ).keyup(function(e){
		var hypeDocument = getHypeDocument();
			var t = transitionType(hypeDocument, transition);
			if($.inArray(e.which, nextKeys) > -1){
				hypeDocument.showNextScene(t[0], speed);
			}else if ($.inArray(e.which, prevKeys) > -1){
				hypeDocument.showPreviousScene(t[1], speed)
			}
		});	
	});
}

//WIZARD OF OZ
var ozLastDestination = null;
var ozUpdatePage = function(){
		$.getJSON(ozUrl, function(destination) {
			if(ozLastDestination!=destination){
				ozLastDestination=destination;
				window.location='#'+destination;
			}
		});
	
	}

var ozDelay = getParam('remote-delay');
ozDelay = ozDelay||5000;
var ozUrl = getParam('remote');
if(ozUrl){
	$(function() {
		setInterval(ozUpdatePage, ozDelay)
    });
}

    
