/***************
================

CONSTANTS

================
***************/
var PIECE_WIDTH = 50, PIECE_HEIGHT = 50, ROWS = 4, COLS = 3, RADIUS = 175;


(function(){

	window.__Grid__ = Grid;
	window.__Game__ = Game;
	window.__Piece__ = Piece;

/***************
================

Game
@config
grid: Grid
peiceList: Array<Peice>
[debug] = false

@function start
@params `none` 

@function setPieceEventListeners
@params peice: Peice


@function snapPeice
@params peice: Peice


@function dragDiv
@params piece: Peice


@function log
@params (same as console.log params)


@function debug
@params bool: boolean


================
***************/
function Game(grid, pieceList, debug=false){
	this.grid = grid;
	this.pieceList = pieceList;
	this.debug(debug);
}


Game.prototype.start = function(){
	this.dragDiv = this.dragDiv.bind(this);

	pieceList.forEach(p => {
		var i = p.ele.getAttribute('data_pos');
		if(i != "n"){
			this.grid.addPiece(p, this.grid.cells[parseInt(i, 16)])
		}
		this.setPieceEventListeners(p);
	})

	this.grid.cells.forEach((cell, index)=>{
		// console.log(text[index]);
		cell.cell.innerText = text[index];
	})
}

Game.prototype.setPieceEventListeners = function(piece){
	var ele = piece.ele;
	piece.ele.setAttribute('draggable', false);
	ele.addEventListener('click', controlPiece.bind(this));

	function controlPiece(){
		this.log("CONTROL PIECE");
		this.snapPiece(piece);
		if(piece.toggleDrag()){
			ele.addEventListener('mousemove',this.dragDiv(piece) , false);		
		}else{
			ele.removeEventListener('mousemove', this.dragDiv(piece), false);
			this.log('removeEventListener...', ele.onmousemove);
		}
	}
}

Game.prototype.snapPiece = function(piece){
	
	if(!piece.isDraggable)return;
	if(this.grid.isInsideTable(piece.rect())){
		this.grid.snapToGrid(piece);
	}else{
		// console.log(piece)
		piece.setBack();
		// this.grid.hightlightGridBlock(piece.rect());
	}
}

Game.prototype.dragDiv = function(piece){
	return (function(e){
		if(piece.isDraggable){
			piece.removeCell();
			var ele = e.target;
			
			var [left, top] = services.getAbsolutePosition(ele.parentNode, [e.clientX, e.clientY]);
			ele.style.left = left - (ele.offsetWidth/2) + "px";
			ele.style.top = top - (ele.offsetHeight/2) + "px";

			this.grid.hightlightGridBlock(ele.getClientRects()[0]);
		}
	}).bind(this)
}

Game.prototype.log = function(msg){
	// do nothing 
}

Game.prototype.debug = function(bool){
	if(bool)
		this.log = console.log;
	this.grid.log = this.log;
	this.pieceList.forEach(p=> {
		p.log = this.log
	})
	this.grid.cells.forEach(c=> {
		c.log = this.log
	})
}

Game.prototype.setSequence = function(arr){
	arr.forEach((el, index)=>{
		this.grid.addPiece()	
	})
	
}

Game.prototype.getSequence = function(){
	return this.grid.cells.map(c => c.getPieceIndex());
}

/***************
================

Piece
@config
ele : HTMLNode
[cell : Cell] = null

@function rect 
@params `none`


@function setCell 
@params cell: Cell


@function toggleDrag 
@params `none`


@function highlight 
@params `none`


@function removeCell 
@params `none`


@function getIndex 
@params `none`


@function setBack 
@params `none`


================
***************/
function Piece(ele,id=0, cell=null){
	this.ele = ele;
	this.cell = cell;
	this.isDraggable = false;
	this.id = id;
}

Piece.prototype.rect = function(){
	return this.ele.getClientRects()[0];
}

Piece.prototype.setCell = function(cell){
	this.cell = cell;
	var [left, top] = services.getAbsolutePosition(this.ele.parentNode, [cell.rect().left, cell.rect().top])
	this.ele.style.top = top + "px";
	this.ele.style.left = left + "px";	
}

Piece.prototype.toggleDrag = function(){
	this.isDraggable = !this.isDraggable;
	if(this.isDraggable){
		this.removeCell();
		this.ele.style.zIndex = 999;
	}else{
		this.ele.style.zIndex = 10;
	}
	this.highlight();
	return this.isDraggable;
}

Piece.prototype.highlight = function(){
	var old = document.querySelector('.selected');
	if(this.isDraggable){
		if(old)
			old.className = old.className.replace('selected', '');
		this.ele.className += " selected";
	}else{
		if(old == this.ele){
			old.className = old.className.replace('selected', '');
		}

	}
}

Piece.prototype.removeCell = function(){
	if(this.cell){
		// console.log(this.cell)
		this.cell.removePiece();
	}
	this.cell = null;
}

Piece.prototype.getIndex = function(){
	// return this.ele.getAttribute('data-index');
	return this.id;
}

Piece.prototype.setBack = function(){
	// if(this.cell != null)this.removeCell();
	var [left, top] = services.getPieceDefaultPosition(this.ele.parentNode, this.getIndex());
	this.ele.style.top = top + "px";
	this.ele.style.left = left + "px";
}


/***************
================

Grid
@config
table: HTMLNode
cells: HTMLNodeList
[config] = {rows:3 , height:3}

@function addPiece 
@params piece: Peice, cell: Cell

@function hightlightGridBlock 
@params eleRect: DOMRect

@function snapToGrid 
@params piece: Peice

@function findClosestBlock 
@params eleRect: DOMRect

@function isInsideTable 
@params eleRect: DOMRect

@function getCenterX 
@params rect: DOMRect

@function getCenterY 
@params rect: DOMRect

================
***************/
function Grid(table, cells, config={rows:3, cols:3}){
	this.table = table;
	this.cells = Array.prototype.map.call(cells, c => new Cell(c));
	this.tableRect = table.getClientRects()[0];
	this.pieceList = new Array();
	this.config = config;
}

Grid.prototype.addPiece = function(piece, cell){
	this.log(piece, cell, this);
	if(cell.isFree()){
		// console.log("is Free ->", cell.isFree())
		piece.setCell(cell);
		cell.setPiece(piece);
	}else{
		piece.setBack();
	}
}

Grid.prototype.hightlightGridBlock = function(eleRect){

	if(this.isInsideTable(eleRect)){
		var cell = this.findClosestBlock(eleRect);
		if(cell)
		{
			cell.highlight();
		}
	}else{
		var old = document.querySelector('.highlighted');
		if(old){
			old.classname = old.className.replace('highlighted', '');
		}
	}
}

Grid.prototype.snapToGrid = function(piece){
	var eleRect = piece.rect();
	var cell = this.findClosestBlock(eleRect);
	this.log(cell);
	this.addPiece(piece, cell);
}

Grid.prototype.findClosestBlock = function(eleRect){
	var xCenter = this.getCenterX(eleRect);
	var yCenter = this.getCenterY(eleRect);
	var cell = null;
	var flag = false;
	this.cells.forEach((ele)=>{
		if(flag)return;
		var X = this.getCenterX(ele.rect());
		var Y = this.getCenterY(ele.rect());
		var distance = Math.sqrt(Math.pow((xCenter - X), 2) + Math.pow((yCenter - Y), 2));
		if(distance < 1.25*PIECE_WIDTH){
			cell = ele;
			flag = true;
		}
	})
	return cell;
}


Grid.prototype.isInsideTable = function(eleRect){
	
	// var rightBoundary = (this.getCenterX(eleRect) < this.tableRect.right);
	// var leftBoundary = (this.getCenterX(eleRect) > this.tableRect.left);
	// var bottomBoundary = (this.getCenterY(eleRect) < this.tableRect.bottom);
	// var topBoundary = (this.getCenterY(eleRect) > this.tableRect.top);
	
	// return (
	// 	rightBoundary &&
	// 	leftBoundary && 
	// 	bottomBoundary &&
	// 	topBoundary
	// )

	var xCenter = this.getCenterX(eleRect);
	var yCenter = this.getCenterY(eleRect);
	var X = this.getCenterX(this.tableRect);
	var Y = this.getCenterY(this.tableRect);
	var distance = Math.sqrt(Math.pow((xCenter - X), 2) + Math.pow((yCenter - Y), 2));
	return ( distance <= RADIUS + PIECE_WIDTH  && distance >= RADIUS - PIECE_WIDTH)
}

Grid.prototype.getCenterX = function(rect){

	// this.log('getCenterX >> ', rect.x, rect.width);
	return rect.x + (rect.width/2);
}

Grid.prototype.getCenterY = function(rect){
	return rect.y + (rect.height/2);
}

/***************
================

Cell

@function rect
@params `none`

@function setPiece
@params piece: Peice

@function getPieceIndex
@params `none`

@function removePiece
@params piece: Peice

@function highlight
@params piece: Peice


================
***************/
function Cell(cell, piece=null){
	this.cell = cell;
	this.highlighted = false;
	this.piece = piece;
}

Cell.prototype.rect = function(){
	return this.cell.getClientRects()[0];
}

Cell.prototype.setPiece = function(piece){
	// console.log('setPiece', piece)
	// this.cell.style.backgroundColor = "#0ff";
	this.piece = piece;
	// console.log(this, this.isFree())
}

Cell.prototype.getPieceIndex = function(){
	if(this.piece){
		return this.piece.getIndex();
	}
	return null;
}

Cell.prototype.isFree = function(){
	return this.piece == null;
}


Cell.prototype.removePiece = function(piece){
	// this.cell.style.backgroundColor = "#00f";
	this.piece = null;
}

Cell.prototype.highlight = function(piece){
	var old = document.querySelector('.highlighted');
	if(old){
		old.className = old.className.replace('highlighted', '');
	}
	this.cell.className += ' highlighted';
}
Cell.prototype.setRed = function(peice){
	this.cell.className += " red";
	console.log(this.cell.className)
	setTimeout(()=>{
		this.cell.className = this.cell.className.replace(' red', '');
	}, 4000)
}


/***************
================

other very useful functions

================
***************/

services = {};

services.getAbsolutePosition = function(eleParent, pageOffsets){	
	var [pageLeft, pageTop] = pageOffsets;
	// console.log(pageOffsets)
	// console.log(pageOffsets, window.scrollX, window.scrollY)
	var parentRect = eleParent.getBoundingClientRect();
	
	return [pageLeft - parentRect.x + window.scrollX, pageTop - parentRect.y + window.scrollY]
	// return pageOffsets;
}

services.getPieceDefaultPosition = function(eleParent, index){
	var container = document.querySelector('.image_container');
	var containerRect = container.getClientRects()[0];
	var spacing = 10;
	var padding = 20;
	var capacity = Math.floor((containerRect.width - 2*padding + spacing)/(PIECE_WIDTH + spacing));
	var left = (index%capacity)*(PIECE_WIDTH + spacing) + padding;
	var top = Math.floor(index/capacity)*(PIECE_HEIGHT + spacing) + padding;
	console.log(index, capacity, index%capacity, Math.floor(index/capacity))
	return services.getAbsolutePosition(eleParent, [left + containerRect.left, top + containerRect.top]);
}

})(window);


/***************
================

create scene

================
***************/



var state;
var text = ["fire", "air", "water","fire", "air", "water","fire", "air", "water","fire", "air", "water"]
// var pieces = ['./img/pieces/superman/image_part_005.jpg','./img/pieces/superman/image_part_005.jpg', './img/pieces/superman/image_part_009.jpg', './img/pieces/superman/image_part_001.jpg', './img/pieces/superman/image_part_007.jpg', './img/pieces/superman/image_part_002.jpg', './img/pieces/superman/image_part_004.jpg', './img/pieces/superman/image_part_008.jpg', './img/pieces/superman/image_part_003.jpg', './img/pieces/superman/image_part_006.jpg','./img/pieces/superman/image_part_006.jpg' ]

var board = document.getElementById('board');
var container  = document.createElement('div');
container.className = "image_container";
board.appendChild(container);



var tableEle = document.createElement('div');
tableEle.className = 'grid';
for(var i = 0; i< ROWS; i++){
	// var tr = document.createElement('div');
	for(var k = 0; k< COLS; k++){
		var cell = document.createElement('div');
		cell.className = "cell";
		// postion peices on a circle
		var theta = (i*Math.PI/2 + (k-1)*Math.PI/6);
		var x = RADIUS*Math.sin(theta);
		var y = - RADIUS*Math.cos(theta);
		// console.log(theta/Math.PI)
		cell.style.transform = "translateX(" + x + "px) translateY(" + y +"px)";
		// tr.appendChild(cell);
		tableEle.appendChild(cell);
	}
	
}

for(var i = 1; i <= 2; i++){
	var a = document.createElement('div');
	a.className = "ring ring_" + i;
	tableEle.appendChild(a);
}

board.insertBefore(tableEle, board.firstChild);

function getRandomNumber(){
	return ("000"+(Math.random()*999).toString()).slice(-3)
}






/***************
================

my game config

================
***************/

var table, cells__, pieces, grid, pieceList, game;

function setupConfig(){
	table = document.querySelector('.grid');
	cells__ = document.querySelector('.grid').querySelectorAll('.cell');
	pieces = document.querySelectorAll('.piece');

	grid = new __Grid__(table, cells__, {
		rows: ROWS,
		cols: COLS
	});
	pieceList = Array.prototype.map.call(pieces , (ele, i) => new __Piece__(ele, i));
	game = new __Game__(grid, pieceList, false);
}


/***************
================

Start ^_^ (yay!)

================
***************/


function openPuzzle(str=null){
	// console.log($(".piece"))
	$(".piece").remove();
	$('.highlighted').removeClass('highlighted');
	$('#puzzle').fadeIn();
	
	if(str)
		initPuzzle(str);
	else{
		getString(initPuzzle);
	}
	
}

function initPuzzle(str){
	var peiceNo = 0;
	var scene = document.createDocumentFragment();
	str.split("").forEach((el,index)=>{
		if(el == "h")return;

		var img = document.createElement('img');

		img.className = 'piece';
		img.src = '../static/assets/images/pieces/mama/' + (index + 1) + '.png';
		// img.setAttribute("data-index", index);
		img.position = "absolute";
		var pos = services.getPieceDefaultPosition(document.getElementById('board'), peiceNo)
		// var pos = services.getPieceDefaultPosition(document.body, peiceNo)
		img.style.top = pos[1] + "px";
		img.style.left = pos[0] + "px";
		img.style.width = PIECE_WIDTH + "px";
		img.style.height = PIECE_HEIGHT +  "px";
		img.setAttribute("data_pos", el);
		peiceNo++;
		scene.appendChild(img);
	})
	board.appendChild(scene);
	setupConfig();
	game.start();
}



[document.querySelector('#submit_puzzle'), document.querySelector('#save_puzzle')].forEach(function(el){
	el.addEventListener('click', (e)=>{
		var v = document.querySelector('.ring_1');
		v.className += " glow";
		setTimeout(()=>{
			v.className = v.className.replace('glow', '');
		}, 2000)
		var boardSequence = game.getSequence();
		var string = encodeSequence(boardSequence);
		console.log(string , ' @ ', "/main/" + e.target.getAttribute("data-url"))
		
		var csrf_token = getCSRFToken();
		$.ajax({
			"method": "POST",
			"data" : JSON.stringify({
				string
			}),
			"url": '/main/' + e.target.getAttribute("data-url"),
			"headers":{
				"X-CSRFToken": csrf_token
			},
			success: function(data){
				console.log(data);
			}
		})
		setTimeout(closePuzzle, 1500);
	})
});

function encodeSequence(seq){
	console.log(seq);
	var obj = {};
	seq.forEach((el, i)=>{
		console.log(el)
		if(el != null){

			obj[el]=(i).toString(16);
		}
	})
	var str = "";
	for( var i = 0 ; i< 12; i++){
		if(obj[i]) str += obj[i];
		else str+="n";
	}
	return str;
}

// dummy implementation
// Game.prototype.checkSequence = function(){
// 	var sequence = this.getSequence()
// 	var result = {
// 		status: true,

// 	}

// 	sequence.forEach((ele, index)=>{
// 		if(ele!=index){
// 			result.status = false;
// 			if(!result.cells){
// 				result.cells = [index];
// 			}

// 			result.cells.push(index);
// 		}
// 	})
// 	return result;
// }


function closePuzzle(){
	$('#puzzle').fadeOut();
	
}


function getString(callback){
	console.log('get puzzle from main/puzzle')
	$.ajax({
		"method": "GET",
		"url": '/main/puzzle/',
		success: function(data){
			console.log("puzzle data =>", data)
			callback(data.puzzle);
		}
	})
}

// openPuzzle();