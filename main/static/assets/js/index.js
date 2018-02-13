// No images or JS were harmed in the making of this pen

window.onload =  function(){

	setTimeout(triggerAnimation, 9200)
}

function  triggerAnimation(){
	var dummy = document.querySelector("#dummy");
	var dia = window.innerWidth;
	var h = window.innerHeight;
	
	var t = (dia - h)/2;
	dummy.style.top = "-" + t + "px";
	dummy.style.left = "0vw";
	dummy.style.width = "100vw";
	dummy.style.height = "100vw";

	var form = document.querySelector("#form");
	form.style.top = t + "px";
	form.style.left = "0vw";
	form.style.width = "100vw";
	form.style.height = "100vh";
	setTimeout(changeBorderRadius, 900);
}

function changeBorderRadius(){
	var dummy = document.querySelector("#dummy");
	dummy.style.borderRadius = "0"
}