var mousedowntimer = null;
var singleclickcancel = 'undefined';
function mousedown(adress) {
	singleclickcancel = '1';
	mousedowntimer = setTimeout(function() {
	if (document.getElementById(adress).state=="1")
		document.getElementById(adress).state="0";
	else
		document.getElementById(adress).state="1";
	var buttonsDiv=document.getElementsByName("buttonDiv");
	division=document.getElementById("Div"+adress);
	imgElement=document.getElementById("Img"+adress);
	lightswitchElement=document.getElementById("lightswitch");
	if (document.getElementById(adress).alt == "") {
		//kleiner BUTTON soll gross werden
		for (var i=0;i<buttonsDiv.length;i++)
		{ 
			buttonsDiv[i].style.display="none";
		}
		division.style.display="inline";
		document.getElementById(adress).alt = "Big";
		if (screenHeight<screenWidth) { 
			imgElement.height = Math.floor(screenHeight*0.6);
			imgElement.width = Math.floor(714*screenHeight*0.6/358);
			division.style.height = Math.floor(screenHeight*0.6)+"px";
			division.style.width = Math.floor(714*screenHeight*0.6/358)+"px";
			lightswitchElement.style.width = Math.floor(0.6*screenHeight*714/358)+"px";
		} else {
			styleWidth=Math.floor(0.7*screenWidth); 
                        division.style.height = Math.floor(styleWidth*358/714)+"px"; 
                        imgElement.height = Math.floor(styleWidth*358/714); 
                        division.style.width = styleWidth+"px";
                        imgElement.width = styleWidth;
			lightswitchElement.style.width = styleWidth+"px";
		}
		document.getElementById("Text"+adress).style.bottom="1em";
		playSound("lights/sounds/close");
	} else {
		//EINZELBUTTON wird wieder klein
		for (var i=0;i<buttonsDiv.length;i++)
		{ 
			buttonsDiv[i].style.display="inline";
		}
		document.getElementById(adress).alt = "";
		if (screenHeight<screenWidth) {
                        styleHeight=Math.floor(0.7*screenHeight/buttonsDiv.length); 
                        division.style.width = Math.floor(styleHeight*784/138)+"px";
                        division.style.height = styleHeight+"px";
                        imgElement.width = Math.floor(styleHeight*784/138);    
                        imgElement.height = styleHeight;
			lightswitchElement.style.width = Math.floor(0.7*screenHeight*784/(138*buttonsDiv.length))+"px";
		} else {
			styleWidth=Math.floor(0.7*screenWidth); 
                        division.style.height = Math.floor(styleWidth*138/784)+"px"; 
                        division.style.width = styleWidth+"px";
                        imgElement.height = Math.floor(styleWidth*138/784); 
                        imgElement.width = styleWidth;
			lightswitchElement.style.width = styleWidth+"px";
		}
		document.getElementById("Text"+adress).style.bottom="5px";
		playSound("lights/sounds/open");
	}
	changeButton(adress);
	singleclickcancel = 'undefined';
	},500);
}

function mouseup(adress) {
	if (singleclickcancel=='1') {
		switchLight(adress);
	}
	clearTimeout(mousedowntimer);
	singleclickcancel = 'undefined';
}
