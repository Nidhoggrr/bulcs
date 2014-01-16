var switchLock = 'undefined';
function switchLight (adress) {
if(switchLock == 'undefined') {
	switchLock = '1';
	var state=document.getElementById(adress).state;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "lights/cgi-bin/states.lua?api=1&adress="+adress+"&state="+state, true);

	if (state == "1") {
		playSound("lights/sounds/charge");
	} 
	if (state == "0") {
		playSound("lights/sounds/shutdown");
	}
	xmlHttp.onreadystatechange = function () {
		changeButton (adress);
	}
	setTimeout(function() {
		xmlHttp.send();
		switchLock = 'undefined';
	},800);
}
}

