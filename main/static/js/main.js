// Move GIF with mouse
var lFollowX = 0;
var lFollowY = 0;
var x = 0;
var y = 0;
var friction = 1 / 30;

function moveBackground() {

	x += (lFollowX - x) * friction;
	y += (lFollowY - y) * friction;

	$('.positionx').text(x);
	$('.positiony').text(y);

	translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.2)';

	$('.stage').css({
		'-webit-transform': translate,
		'-moz-transform': translate,
		'transform': translate
	});

	window.requestAnimationFrame(moveBackground);

}

$(window).on('mousemove click', function(e) {

	var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
	var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
	lFollowX = (200 * lMouseX) / 100;
	lFollowY = (80 * lMouseY) / 100;

});

moveBackground();

// Random number generator
setInterval(function(){
	ChangeNumber1(); 
	ChangeNumber2(); 
	ChangeNumber3(); 
}, 50);
function ChangeNumber1() {
	var newNumber = Math.floor(Math.random(9) * 1000000);
	$('#randomnumber1').text(newNumber);
}
function ChangeNumber2() {
	var newNumber = Math.floor(Math.random(9) * 100000000);
	$('#randomnumber2').text(newNumber);
}
function ChangeNumber3() {
	var newNumber = Math.floor(Math.random(9) * 10000000000);
	$('#randomnumber3').text(newNumber);
}

setInterval(function(){
	ChangeNumber4(); 
}, 1500);
function ChangeNumber4() {
	var newNumber = Math.floor(Math.random(9) * 100000);
	$('#randomscan').text(newNumber);
}

// Load in dimensions
setTimeout(function(){ $('.dimension1').addClass('show') }, 1000);
setTimeout(function(){ $('.dimension2').addClass('show') }, 2000);
setTimeout(function(){ $('.dimension3').addClass('show') }, 3000);
setTimeout(function(){ $('.dimension4').addClass('show') }, 4000);
setTimeout(function(){ $('.dimension5').addClass('show') }, 5000);

var bombList = [];
var cells = [];
$(function __intit__(){
	
	var fragment = document.createDocumentFragment();		
	for(var i = 0; i< 12; i++){
		var row = document.createElement("div");
		row.className = 'row';
		for(var j = 0; j< 12; j++){
			var cell = document.createElement('div');
			cell.className = "minesweeper_cell";
			row.appendChild(cell);
			
			cell.setAttribute('i',i);
			cell.setAttribute('j',j);
			cell.addEventListener("click", function(e){
				var obj  = {};
				obj.cords = [e.target.getAttribute("i"), e.target.getAttribute("j")]
				var csrf_token = document.cookie.split("=")[1]
				var data = JSON.stringify(obj);
				console.log(data)
				// console.log(obj)
				$.ajax({
					"method": "POST",
					"data" : data,
					"headers":{
						"X-CSRFToken": csrf_token
					},
					"url": '/main/reveal/',
					"csrfmiddlewaretoken":csrf_token,
					"success": function(data){
							displayMinesweeper(createGrid(data.field),getCells())
					}


				})
				
			});
			cells.push(cell);

		}
		fragment.appendChild(row);
	}
	// console.log(document.querySelector('.stage'))
	document.querySelector('.stage').appendChild(fragment);
	// randBomb();
	
	displayMinesweeper(createGrid(window.str), getCells());
	
	
});

function getCells(){
	return cells;
}

function createGrid(str, old_str=""){

	var p,q;
	var grid = make2DArray(12, 12);
	for(p=0;p<12;p++){
		for(q=0;q<12;q++){
			grid[q][p]= str.substr(p*12+q, 1);
		}
	}
	return grid   			
}

function displayMinesweeper(grid,cell){
	var p,q;
	for(p=0;p<12;p++)
		for(q=0;q<12;q++) {
			if(grid[p][q]==1||grid[p][q]==2||grid[p][q]==3||grid[p][q]==4||grid[p][q]==5||grid[p][q]==6){
				console.log(grid, cell)
				displayNumber(cell[p*12+q],grid[p][q]);
			}
			else if (grid[p][q]=='b'){
				var flag=0;
				var bNo=bombList.length;
				for (var l=0;l<bNo;l++) {
					if (bombList[l]==p*12+q)
						flag=1;
				}
				if(flag==0){		
					explodeAnimate(cell[p*12+q]);
					bombList.push(p*12+q);
				}

			}
    	// console.log(bombList);
    }
}


function make2DArray(cols, rows) {
	// get string 
	var arr = new Array(cols);
	for (var i = 0; i < rows; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function randBomb(){
	var index = Math.floor(cells.length * Math.random());
	while(cells[index].data == "b"){
		index = Math.floor(cells.length * Math.random());
	}
	// exploded(cells[index])
	explodeAnimate(cells[index]);
}	



function explodeAnimate(ele){
	ele.className += " bomb";
	ele.setAttribute("data","b");
	var bomb_cells = [];
	var fragment = document.createDocumentFragment();
	for(var i = 0; i< 20; i++){
		var row = document.createElement("div");
		row.className = 'bomb-row';
		for(var j = 0; j< 20; j++){
			var cell = document.createElement('div');
			row.appendChild(cell);
			bomb_cells.push(cell);
		}
		fragment.appendChild(row);
	}
	// console.log(document.querySelector('.stage'))
	ele.appendChild(fragment);
	chooseEle(bomb_cells, ele)
}

function chooseEle(bomb_cells, ele){
	if(bomb_cells.length == 0){
		// setTimeout(randBomb, 300);
		return;
	}
	var index = Math.floor(bomb_cells.length * Math.random());
	bomb_cells[index].className += "bomb-cell";
	bomb_cells.splice(index, 1);
	setTimeout(function(){
		chooseEle(bomb_cells, ele)
	}, 10)
}

function exploded(ele){
	ele.setAttribute("data","b");
	ele.className += " exploded";

}

function displayNumber(ele, number){
	ele.innerHTML='';
	ele.setAttribute("data",number.toString());
	ele.className += " number";
	var p = document.createElement('p');
	p.innerText = number;
	ele.appendChild(p);
}



