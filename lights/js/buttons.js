var screenHeight = screen.availHeight;
var screenWidth = screen.availWidth;
function changeButton (adress) {
	var state=document.getElementById(adress).state;
	//console.log(document.getElementById(adress).state);
	imgElement=document.getElementById("Img"+adress);
	if (state == "1") {
		//document.getElementById(adress).style.backgroundColor = '#00ff00';
		if (document.getElementById(adress).alt == "Big") {
			imgElement.src = "lights/images/png/buttonBigOn.png";
			imgElement.onerror="this.onerror=null; this.src='lights/images/png/buttonBigOn.png'";
		} else {
			imgElement.src = "lights/images/png/buttonOn.png";
			imgElement.onerror="this.onerror=null; this.src='lights/images/png/buttonOn.png'";
		}
		document.getElementById(adress).state="0";
	} else {
		//document.getElementById(adress).style.backgroundColor = 'red';
		if (document.getElementById(adress).alt == "Big") {
			imgElement.src = "lights/images/png/buttonBigOff.png";
			imgElement.onerror="this.onerror=null; this.src='lights/images/png/buttonBigOff.png'";
		} else {
			imgElement.src = "lights/images/png/buttonOff.png";
			imgElement.onerror="this.onerror=null; this.src='lights/images/png/buttonOff.png'";
		}
		document.getElementById(adress).state="1";
	}
	imgElement.style.display="none";
	imgElement.style.display="inline";
}

function refresh (adress) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "lights/cgi-bin/states.lua?adress="+adress+"&date=" + new Date().getTime(), true);
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 ){
		if (xmlHttp.status==200){
			var result = json_parse( xmlHttp.responseText );
			document.getElementById(adress).state=result.state;
			changeButton (result.adress);
		} else {
			console.log("URL: lights/cgi-bin/states.lua?adress="+adress);
			console.log("Status: "+xmlHttp.statusText);
		}
		}
	}
	setTimeout(function() {
		if (!(document.getElementById("Div"+adress).style.display=="none"))
			if (singleclickcancel == 'undefined')
				xmlHttp.send();
		refresh(adress);
	},3000);
}

function createButton(adress,count) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "lights/cgi-bin/states.lua?adress="+adress+"&date=" + new Date().getTime(), true);
	xmlHttp.onreadystatechange = function () {
	if (xmlHttp.readyState == 4 ){
	if (xmlHttp.status==200){    
		var result = json_parse( xmlHttp.responseText );
		var adress = result.adress;
		var state = result.state; 
		var name = result.name; 

		var imgElement=document.createElement("img");
		imgElement.id="Img"+adress;
		imgElement.name="ImgButton";
		imgElement.src = "lights/images/png/buttonOn.png";

		var textElement=document.createElement("text");
		textElement.id="Text"+adress;
		textElement.style.position="absolute";
		textElement.style.width="60%";
		textElement.style.height=Math.floor(0.25*screenHeight/count)+"px";
		textElement.style.fontSize = Math.floor(0.25*screenHeight/count)+"px";
		textElement.style.right="1em";
		textElement.style.bottom="5px";
		textElement.appendChild(document.createTextNode(name));

		var buttonElement = document.createElement("div");	
		buttonElement.ontouchstart = function () {mousedown(adress)};
		buttonElement.ontouchend = function () {mouseup(adress)};
		buttonElement.onmousedown = function () {mousedown(adress)};
		buttonElement.onmouseup = function () {mouseup(adress)};
		buttonElement.id = adress;
		buttonElement.value = name;
		buttonElement.alt = "";
		buttonElement.state = state;
		buttonElement.appendChild(imgElement);
		buttonElement.appendChild(textElement);

		var division  = document.createElement("div");
		division.id = "Div"+adress;
		division.style.position="relative";
		division.setAttribute("name", "buttonDiv");
		division.style.display="inline";
		division.appendChild(buttonElement);

		lightswitchElement = document.getElementById('lightswitch');
		lightswitchElement.appendChild(division);

		if (screenHeight<screenWidth) {
			styleHeight=Math.floor(0.7*screenHeight/count);
			imgElement.width = Math.floor(styleHeight*784/138);
			imgElement.height = styleHeight;
			division.style.height = styleHeight+"px";
			division.style.width = Math.floor(styleHeight*784/138)+"px";
			lightswitchElement.style.width = Math.floor(styleHeight*784/138)+"px";
		} else {
			styleWidth=Math.floor(0.7*screenWidth);
			imgElement.height = Math.floor(styleWidth*138/784);
			imgElement.width = styleWidth;
			division.style.width = styleWidth+"px";
			division.style.height = Math.floor(styleWidth*138/784)+"px";
			lightswitchElement.style.width = styleWidth+"px";
		}

		changeButton (adress);
		refresh(adress);
	}
	}
	}
	xmlHttp.send();
}
