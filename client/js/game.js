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
		fill: bgcolor,
		id: String(i) + String(j)
	});
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
		if (newImg.width > newImg.height) {
			newImg.divisor = newImg.width/tileSize;
		} else if (newImg.width < newImg.height) {
			newImg.divisor = newImg.height/tileSize;
		}
		var width = newImg.width/newImg.divisor;
		var height = newImg.height/newImg.divisor;
		var xOff = Math.floor(tileSize/2) - Math.floor(width/2);
		var yOff = Math.floor(tileSize/2) - Math.floor(height/2);
		var newImg = new Kinetic.Image({
			image: newImg,
			x:x + xOff,
			y:y + yOff,
			height:height,
			width:width,
			id: String(i) + String(j)
		});
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
		stroke: 'black',
		id: String(i) + String(j)
	});
	newRect.highlighted = false;
	newRect.i = i;
	newRect.j = j;
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

var currSelectedPiece = {i:null,j:null};

/*
	Function: move
	
	Handles the moving of pieces.
	
	Paramaters:
	
		i - I iterator of array
		j - J iterator of array
		piece - ID of piece (color(b,w), piece ID(r,h,k,p,b,q))
*/
function move(i,j,piece) {
	i = Number(i);
	j = Number(j);
	console.log(i,j,piece);
	if ((piece.charAt(0) == 'b' && isWhite || piece.charAt(0) == 'w' && !isWhite) && !lookupTile(2,i,j).highlighted) {
		return;
	} else if (lookupTile(2,i,j).highlighted) {
		socket.emit('move', {from: {x: currSelectedPiece.i, y: currSelectedPiece.j}, to: {x: i, y:j}, upgrade: false});
		console.log( {from: {x: currSelectedPiece.i, y: currSelectedPiece.j}, to: {x: i, y:j}, upgrade: false});
	} else if (currSelectedPiece.i == i && currSelectedPiece.j == j) {
		resetHighlight();
		currSelectedPiece = {i:null, j:null};
	} else {
		resetHighlight();
		currSelectedPiece.i = i;
		currSelectedPiece.j = j;
		switch(piece.charAt(1)) {
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
}

/*
	Function: highlightBishop
	
	Highlights squares for bishop movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightBishop(i,j) {
	var enemyToken;
	if (isWhite)
		enemyToken = 'b';
	else
		enemyToken = 'w';
	helper(i,j,1,1);
	helper(i,j,-1,-1);
	helper(i,j,-1,1);
	helper(i,j,1,-1);
	
	/*
		Function: helper
		
		Highlights each diagonal.  Used in <highlightBishop>
		
		Paramaters:
			i - I iterator of array
			j - J iterator of array
			iMult - Direction of diagonal
			jMult - Direction of diagonal
	*/
	function helper(i,j,iMult,jMult) {
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee' || tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i, j);
			if (tileToHighlight.piece != 'ee')
				break;
		}
	}
}

/*
	Function: highlightKing
	
	Highlights squares for king movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightKing(i,j) {
	var enemyToken;
	if (isWhite)
		enemyToken = 'b';
	else
		enemyToken = 'w';
		
	helper(i,j,1,1);
	helper(i,j,-1,-1);
	helper(i,j,-1,1);
	helper(i,j,1,-1);
	helper(i,j,1,0);
	helper(i,j,-1,0);
	helper(i,j,0,1);
	helper(i,j,0,-1);
	
	/*
		Function: helper
		
		Highlights each square.  Used in <highlightKing>.
		
		Paramaters:
			i - I iterator of array
			j - J iterator of array
			di - Direction to travel
			dj - Direction to travel
	*/
	function helper(i,j,di,dj) {
		i += di;
		j += dj;
		if (i < 0 || i > 7 || j < 0 || j > 7) {
		} else {
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee' || tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i, j);
			//if (tileToHighlight.piece != 'ee')
		} 
	}
}

/*
	Function: highlightKnight
	
	Highlights squares for knight movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightKnight(i,j) {
	helper(i+1,j-2);
	helper(i-1,j-2);
	helper(i+1,j+2);
	helper(i-1,j+2);
	helper(i+2,j-1);
	helper(i+2,j+1);
	helper(i-2,j-1);
	helper(i-2,j+1);
	
	/*
		Function: helper
		
		Highlights each square.  Used in <highlightKnight>.
		
		Paramaters:
			i - I iterator of array of square to highlight
			j - J iterator of array of square to highlight
	*/
	function helper(i,j) {
		var enemyToken;
		if (isWhite)
			enemyToken = 'b';
		else
			enemyToken = 'w';
		if (i > -1 && i < 8 && j > -1 && j < 8) {
			var newTile = lookupTile(2,i,j);
			if (newTile.piece == 'ee' || newTile.piece.charAt(0) == enemyToken)
				highlight(i, j);
		}
	}
}

/*
	Function: highlightPawn
	
	Highlights squares for pawn movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightPawn(i,j) {
	if (isWhite) {
		if (j < 7) {
			if (lookupTile(2,i,j+1).piece == 'ee')
				highlight(i,j+1);
			if (i < 7) {
				if (lookupTile(2,i+1,j+1).piece.charAt(0) == 'b')
					highlight(i+1,j+1);
			}
			if (i > 0) {
				if (lookupTile(2,i-1,j+1).piece.charAt(0) == 'b')
					highlight(i-1,j+1);
			}
			if (j == 1 && lookupTile(2,i,j+2).piece == 'ee')
				highlight(i,j+2);
		}
	} else {
		if (j > 0) {
			if (lookupTile(2,i,j-1).piece == 'ee')
				highlight(i,j-1);
			if (i < 7) {
				if (lookupTile(2,i+1,j-1).piece.charAt(0) == 'w')
					highlight(i+1,j-1);
			}
			if (i > 0) {
				if (lookupTile(2,i-1,j-1).piece.charAt(0) == 'w')
					highlight(i-1,j-1);
			}
			if (j == 6 && lookupTile(2,i,j-2).piece == 'ee')
				highlight(i,j-2);
		}
	}
}

/*
	Function: highlightQueen
	
	Highlights squares for queen movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightQueen(i,j) {
	var enemyToken;
	if (isWhite)
		enemyToken = 'b';
	else
		enemyToken = 'w';
	helper(i,j,1,1);
	helper(i,j,-1,-1);
	helper(i,j,-1,1);
	helper(i,j,1,-1);
	helper(i,j,1,0);
	helper(i,j,-1,0);
	helper(i,j,0,1);
	helper(i,j,0,-1);
	
	/*
		Function: helper
		
		Highlights each square.  Used in <highlightQueen>.
		
		Paramaters:
			i - I iterator of array
			j - J iterator of array
			iMult - Direction of diagonal
			jMult - Direction of diagonal
	*/
	function helper(i,j,iMult,jMult) {
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee' || tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i, j);
			if (tileToHighlight.piece != 'ee')
				break;
		}
	}
}

/*
	Function: highlightRook
	
	Highlights squares for rook movement.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlightRook(i,j) {
	var enemyToken;
	if (isWhite)
		enemyToken = 'b';
	else
		enemyToken = 'w';
	helper(i,j,1,0);
	helper(i,j,-1,0);
	helper(i,j,0,1);
	helper(i,j,0,-1);
	
	/*
		Function: helper
		
		Highlights each square.  Used in <highlightRook>.
		
		Paramaters:
			i - I iterator of array
			j - J iterator of array
			di - Direction to travel
			dj - Direction to travel
	*/
	function helper(i,j,iMult,jMult) {
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee' || tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i, j);
			if (tileToHighlight.piece != 'ee')
				break;
		}
	}
}

/*
	Function: highlight
	
	Highlights individual square.
	
	Paramaters:
		i - I iterator of array
		j - J iterator of array
*/
function highlight(i,j) {
	var tileToHighlight = lookupTile(2,i,j);
	tileToHighlight.setFill('rgba(212,250,250,0.8)');
	tileToHighlight.highlighted = true;
	fgTileLayer.draw();
}

/*
	Function: lookupTile
	
	Looks up & returns tile
	
	Paramaters:
		layer - 0 for bgTileLayer, 1 for pieceLayer, 2 for fgTileLayer
		i - I iterator of array
		j - J iterator of array
*/
function lookupTile(layer,i,j) {
	switch(layer) {
		case 0:
			layer = bgTileLayer;
			break;
		case 1:
			layer = pieceLayer;
			break;
		case 2:
			layer = fgTileLayer;
			break;
	}
	var id = '#' + i + j;
	return layer.get(id)[0];
}

/*
	Function: resetHighlight
*/
function resetHighlight() {
	for (i in fgTileLayer.children) {
		fgTileLayer.children[i].setFill('rgba(0,0,0,0)');
		fgTileLayer.children[i].highlighted = false;
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