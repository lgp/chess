var stage;
var bgTileLayer;
var pieceLayer;
var fgTileLayer;

var isWhite;

var socket;

var tileSize = 100;
var boardSize = 800;

/*
	Function: initPage
	
	Initializes the page, including instantiating the stage and layers.  Called in the $(document).ready() function.
	
	Global vars:
	
		stage - The game stage, used by KineticJS
		bgTileLayer - The tiles that will be highlighted and are colored gray/white
		pieceLayer - Where the actual pieces are drawn
		fgTileLayer - Where the tiles that detect clicks/hover and which provide borders are placed
*/
function initPage() {
	stage = new Kinetic.Stage({
		height: boardSize,
		width: boardSize,
		container: 'game'
	});
	bgTileLayer = new Kinetic.Layer();
	pieceLayer = new Kinetic.Layer();
	fgTileLayer = new Kinetic.Layer();
	
	stage.add(bgTileLayer);
	stage.add(pieceLayer);
	stage.add(fgTileLayer);
	
	loader();
	
	connect('localhost', '8080');
}

/*
	Function: drawBoard
	
	Draws the board whenever an update event comes in.
	
	Paramaters:
	
		board - The board to be drawn.
	
	
*/
function drawBoard(board) {
	if(loaded == elemToLoad) {
		clearBoard();
		for (i in board) {
			for (j in board[i]) {
				drawTile(i, j, i*tileSize, j*tileSize, board[i][j]);
			}
		}
		stage.draw();
	} else {
		console.log('here');
		window.setTimeout(function() {drawBoard(board)}, 1000);
	}
}

/*
	Function: drawTile
	
	Draws an individual tile.
	
	Paramaters:
		
		i - I iterator of array
		j - J iterator of array
		x - X coordinate (0-7) of tile
		y - Y coordiante (0-7) of tile
		piece - ID of piece
*/
function drawTile(i,j,x,y,piece) {
	drawBGTile(i,j,x,y);
	drawPiece(i,j,x,y,piece);
	drawFGTile(i,j,x,y,piece);
}

/*
	Function: drawBGTile
	
	Draws background tiles.
	
	Paramaters:
	
		i - i iterator of array
		j - j iterator of array
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
*/
function drawBGTile(i,j,x,y) {
	var bgcolor;
	if (j%2 == 0) {
		if (i%2 == 0) {
			bgcolor = '#BFBFBF';
		} else {
			bgcolor = '#FFFFFF';
		}
	} else {
		if (i%2 == 0) {
			bgcolor = '#FFFFFF';
		} else {
			bgcolor = '#BFBFBF'
		}
	}	var id = String(i) + String(j);
	var newRect = new Kinetic.Rect({
		width: tileSize,
		height: tileSize,
		x: x,
		y: y,
		fill: bgcolor
	});
	newRect.id = String(i) + String(j);
	bgTileLayer.add(newRect);
}

/*
	Function: drawPiece
	
	Draws pieces.
	
	Paramaters:
	
		i - I iterator of array
		j - J iterator of array
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
		piece - ID of piece (color(b,w), piece ID(r,h,k,p,b,q))
*/
function drawPiece(i,j,x,y,piece) {
	var newImg;
	var pieceSet;
	switch (piece.charAt(0)) {
		case 'b':
			pieceSet = pieces.black;
			break;
		case 'w':
			pieceSet = pieces.white;
			break;
	}
	switch(piece.charAt(1)) {
		case 'b':
			newImg = pieceSet.bishop;
			break;
		case 'h':
			newImg = pieceSet.knight;
			break;
		case 'k':
			newImg = pieceSet.king;
			break;
		case 'p':
			newImg = pieceSet.pawn;
			break;
		case 'q':
			newImg = pieceSet.queen;
			break;
		case 'r':
			newImg = pieceSet.rook;
			break;
	}
	if (piece != 'ee') {
		var newImg = new Kinetic.Image({
			image: newImg,
			x:x,
			y:y,
			height:tileSize,
			width:tileSize
		});
		newImg.id = String(i) + String(j);
		pieceLayer.add(newImg);
	}
}

/*
	Function: drawFGTile
	
	Draws foreground tiles.
	
	Paramaters:
		
		i - I iterator of array
		j - J iterator of array
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
		piece - ID of piece (color(b,w), piece ID(r,h,k,p,b,q))
*/
function drawFGTile(i,j,x,y,piece) {
	var newRect = new Kinetic.Rect({
		width:tileSize,
		height: tileSize,
		x:x,
		y:y,
		strokeWidth:1,
		stroke: 'black'
	});
	newRect.id = String(i) + String(j);
	newRect.i = i;
	newrect.j = j;
	newRect.piece = piece;
	newRect.on('click', function() {
		move(this.i, this.j, this.piece);
	});
	fgTileLayer.add(newRect);
}

/*
	Function: clearBoard
	
	Clears all the layers so that the board can be redrawn
*/
function clearBoard() {
	bgTileLayer.removeChildren();
	pieceLayer.removeChildren();
	fgTileLayer.removeChildren();
}

/*
	Function: move
	
	Handles the moving of pieces.
	
	Paramaters:
	
		i - I iterator of array
		j - J iterator of array
		piece - ID of piece (color(b,w), piece ID(r,h,k,p,b,q))
*/
function move(i,j,piece) {
	if (piece.charAt(0) == 'b' && isWhite || piece.charAt(0) == 'w' && !isWhite) {
		return;
	}
	switch(piece.charAt(1)) {
		case 'b':
			case 'b':
			highlightBishop(i,j);
			break;
		case 'h':
			highlightKnight(i,j);
			break;
		case 'k':
			highlightKing(i,j);
			break;
		case 'p':
			highlightPawn(i,j);
			break;
		case 'q':
			highlightQueen(i,j);
			break;
		case 'r':
			highlightRook(i,j);
			break;
	}
}

/*
	Function: highlightBishop
	
	Highlights squares for bishop movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightBishop(i,j) {
	
}

/*
	Function: highlightKing
	
	Highlights squares for king movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightKing(i,j) {
	
}

/*
	Function: highlightKnight
	
	Highlights squares for knight movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightKnight(i,j) {
	
}

/*
	Function: highlightPawn
	
	Highlights squares for pawn movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightPawn(i,j) {
	
}

/*
	Function: highlightQueen
	
	Highlights squares for queen movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightQueen(i,j) {
	
}

/*
	Function: highlightRook
	
	Highlights squares for rook movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightRook(i,j) {
	
}

/*
	Function: resetHighlight
*/
function resetHighlight() {
	for (i in fgTileLayer.children) {
		fgTileLayer.children[i].fill = 'rgba(0,0,0,0)';
	}
	fgTileLayer.draw();
}

/*
	Function: connect
	
	Connects the client to the game server.
	
	Paramaters:
		
		host - IP of game server
		port - Port of game server
		
	Global vars:
		
		socket - Socket used to send all game data
*/
function connect(host, port) {
	socket = io.connect('http://' + host + ':' + port, {reconnect: false});
	listeners();
}

/*
	Function: listeners
	
	Sets up all socket.io listeners
	
	Global vars:
	
		socket - Socket used to send all game data
*/
function listeners() {
	//Connection event--currently no data passed
	socket.on('connect', function() {
		alert("You've been connected");
	});
	
	//Sets colors
	socket.on('color', function(data) {
		if (data.color == 'white')
			isWhite = true;
		else
			isWhite = false;
	});
	
	//Updates board from server
	socket.on('update', function(data) {
		drawBoard(data);
	});
	
	//Bad move handler
	socket.on('badMove', function() {
		alert('Sorry, that was a bad move.  Try a different one');
	});
}

var pieces = {black:{}, white:{}};
var loaded = 0;
var elemToLoad = 12;

/*
	Function: loader
	
	Loads anything needed--for now, just images.
	
	Global vars:
		
		loaded - Number of loaded elements
		pieces - The object that holds all of the piece images
*/
function loader() {
	pieces.black.bishop = new Image();
	pieces.black.bishop.src = 'img/pieces/smooth/bishopDark.gif';
	pieces.white.bishop = new Image();
	pieces.white.bishop.src = 'img/pieces/smooth/bishopLight.gif';
	pieces.black.king = new Image();
	pieces.black.king.src = 'img/pieces/smooth/kingDark.gif';
	pieces.white.king = new Image();
	pieces.white.king.src = 'img/pieces/smooth/kingLight.gif';
	pieces.black.knight = new Image();
	pieces.black.knight.src = 'img/pieces/smooth/knightDark.gif';
	pieces.white.knight = new Image();
	pieces.white.knight.src = 'img/pieces/smooth/knightLight.gif';
	pieces.black.pawn = new Image();
	pieces.black.pawn.src = 'img/pieces/smooth/pawnDark.gif';
	pieces.white.pawn = new Image();
	pieces.white.pawn.src = 'img/pieces/smooth/pawnLight.gif';
	pieces.black.queen = new Image();
	pieces.black.queen.src = 'img/pieces/smooth/queenDark.gif';
	pieces.white.queen = new Image();
	pieces.white.queen.src = 'img/pieces/smooth/queenLight.gif';
	pieces.black.rook = new Image();
	pieces.black.rook.src = 'img/pieces/smooth/rookDark.gif';
	pieces.white.rook = new Image();
	pieces.white.rook.src = 'img/pieces/smooth/rookLight.gif';
	for (i in pieces.black) {
		pieces.black[i].onload = function() {
			loaded++;
		}
	}
	for (i in pieces.white) {
		pieces.white[i].onload = function() {
			loaded++;
		}
	}
}

window.onload = function() {
	initPage();
};