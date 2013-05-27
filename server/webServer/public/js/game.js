/*
	File: game.js
	
	All the logic for the client-side.  Requires the game.html file, jQuery, and Kinetic.js
*/

/*
	Variable: stage
	
	The game stage, used by KineticJS.
*/
var stage;
/*
	Variable: bgTileLayer
	
	The tiles that will be highlighted and are colored gray/white.
*/
var bgTileLayer;
/*
	Variable: pieceLayer
	
	Where the actual pieces are drawn.
*/
var pieceLayer;
/*
	Variable: fgTileLayer
	
	Where the tiles that detect clicks/hover and which provide borders are placed.
*/
var fgTileLayer;

var isWhite;

/*
	Variable: socket
	
	The socket initialized and used by socket.io for communication to the server.
*/
var socket;

/*
	Variable: board
	
	The board sent by the last update event.
*/
var board;

var tileSize = 100;
var boardSize = 800;

/*
	Variable: kingMoved
	
	Whether the king has been moved.
*/
var kingMoved = false;
/*
	Variable: rook1Moved
	
	Whether the rook at x = 0 has been moved.
*/
var rook1Moved = false;
/*
	Variable: rook2Moved
	
	Whether the rook at x = 7 has been moved.
*/
var rook2Moved = false;

/*
	Variable: pieces
	
	The object that holds all of the piece images.  Loaded by <loader>.
*/
var pieces = {black:{}, white:{}};
/*
	Variable: loaded
	
	Number of loaded elements.  Used primarily by <loader>.
*/
var loaded = 0;
var elemToLoad = 12;

/*
	Variable: emptyColor
	
	The RGBA color that is used to highlight empty squares, in string form.
*/
var emptyColor = 'rgba(212,250,250,0.8)';
/*
	Variable: enemyColor
	
	The RGBA color that is used to highlight enemy squares, in string form.
*/
var enemyColor = 'rgba(225,0,0,0.8)';

/*
	Function: initPage
	
	Initializes the page, including instantiating the stage and layers.  Called in the $(document).ready() function.
	
	Global vars:
	
		- <stage>
		- <bgTileLayer>
		- <pieceLayer>
		- <fgTileLayer>
*/
function initPage() {
	if (window.innerHeight < window.innerWidth)
		boardSize = window.innerHeight;
	else
		boardSize = window.innerWidth;
	tileSize = boardSize/8;
	$('#game').css('width', boardSize + 'px');
	$('#game').css('height', boardSize + 'px');
	stage = new Kinetic.Stage({
		height: boardSize,
		width: boardSize,
		container: 'game'
	});
	window.location.href = '#game';
	
	bgTileLayer = new Kinetic.Layer();
	pieceLayer = new Kinetic.Layer();
	fgTileLayer = new Kinetic.Layer();
	
	stage.add(bgTileLayer);
	stage.add(pieceLayer);
	stage.add(fgTileLayer);
	
	loader();
	
	connect('localhost', '8080');
	
	$(window).resize(function() {
		
	});
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
				var y = j-3;
				y *= -1;
				y += 4;
				drawTile(i, j, i*tileSize, y*tileSize, board[i][j]);
			}
		}
		stage.draw();
	} else {
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
	
	Clears all the layers so that the board can be redrawn.
*/
function clearBoard() {
	bgTileLayer.removeChildren();
	pieceLayer.removeChildren();
	fgTileLayer.removeChildren();
}

/*
	Function: drawTurn
	
	Tells the player whose turn it is.
	
	Paramaters:
	
		color - The color sent in the update event
*/
function drawTurn(color) {
	var yourTurn = "It is your turn.";
	var blackTurn = "It is black's turn.";
	var whiteTurn = "It is white's turn.";
	if (color == 'white') {
		if (isWhite) $('#turn').text(yourTurn);
		else $('#turn').text(whiteTurn);
	} else {
		if (isWhite) $('#turn').text(blackTurn);
		else $('#turn').text(yourTurn);
	}
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
		handleSpecialMoveCheck(lookupTile(2,currSelectedPiece.i,currSelectedPiece.j),currSelectedPiece.i,currSelectedPiece.j);
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
	Function: handleSpecialMoveCheck
	
	Checks for various special moves to enable things like castling.  Called by <move>.
	
	Global vars:
		- <kingMoved>
		- <rook1Moved>
		- <rook2Moved>
*/
function handleSpecialMoveCheck(tile,i,j) {
	if (isWhite) {
		if (tile.piece.charAt(1) == 'k')
			kingMoved = true;
		if (tile.piece.charAt(1) == 'r' && i == 0 && j == 0)
			rook1Moved = true;
		if (tile.piece.charAt(1) == 'r' && i == 7 && j == 0)
			rook2Moved = true;
	} else {
		if (tile.piece.charAt(1) == 'k')
			kingMoved = true;
		if (tile.piece.charAt(1) == 'r' && i == 0 && j == 7)
			rook1Moved = true;
		if (tile.piece.charAt(1) == 'r' && i == 7 && j == 7)
			rook2Moved = true;
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
		var enemyToken = getEnemyToken();
		done = false;
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0 && !done) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee' || tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i, j, true);
			if (tileToHighlight.piece != 'ee') {
				if (tileToHighlight.piece.charAt(0) == enemyToken)
					highlight(i,j,false);
				else
					done = true;
			}
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
	helper(i,j,1,1);
	helper(i,j,-1,-1);
	helper(i,j,-1,1);
	helper(i,j,1,-1);
	helper(i,j,1,0);
	helper(i,j,-1,0);
	helper(i,j,0,1);
	helper(i,j,0,-1);
	
	castle(i,j);
	
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
		var enemyToken = getEnemyToken();
		i += di;
		j += dj;
		if (i < 0 || i > 7 || j < 0 || j > 7) {
		} else {
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee')
				highlight(i, j, true);
			else if (tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i,j,false);;
		} 
	}
	
	/*
		Function: castle
		
		Handles castling highlighting.  Used in <highlightKing>.
		
		Paramaters:
			i - I iterator of array
			j - J iterator of array
		
		Global vars:
			- <kingMoved>
			- <rook1Moved>
			- <rook2Moved>
	*/
	function castle(i,j) {
		if (!kingMoved && (!rook1Moved || !rook2Moved)) {
			if (!rook1Moved) {
				if (isWhite) {
					var occupied = false;
					for (k = 1; k < 4 && !occupied; k++) {
						if (lookupTile(2,i-k,j).piece != 'ee')
							occupied = true;
					}
					if (!occupied)
						highlight(i-2,j,true);
				} else {
					occupied = false;
					for (k = 1; k < 4 && !occupied; k++) {
						if (lookupTile(2,i-k,j).piece != 'ee')
							occupied = true;
					}
					if (!occupied)
						highlight(i-2,j,true);
				}
			}
			if (!rook2Moved) {
				if (isWhite) {
					var occupied = false;
					for (k = 1; k < 3 && !occupied; k++) {
						if (lookupTile(2,i-k,j).piece != 'ee')
							occupied = true;
					}
					if (!occupied)
						highlight(i+2,j,true);
				} else {
					var occupied = false;
					for (k = 1; k < 3 && !occupied; k++) {
						if (lookupTile(2,i-k,j).piece != 'ee')
							occupied = true;
					}
					if (!occupied)
						highlight(i+2,j,true);
				}
			}
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
		var enemyToken = getEnemyToken();
		if (i > -1 && i < 8 && j > -1 && j < 8) {
			var newTile = lookupTile(2,i,j);
			if (newTile.piece == 'ee')
				highlight(i, j,true);
			if (newTile.piece.charAt(0) == enemyToken)
				highlight(i,j,false);
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
				highlight(i,j+1,true);
			if (i < 7) {
				if (lookupTile(2,i+1,j+1).piece.charAt(0) == 'b')
					highlight(i+1,j+1,false);
			}
			if (i > 0) {
				if (lookupTile(2,i-1,j+1).piece.charAt(0) == 'b')
					highlight(i-1,j+1,false);
			}
			if (j == 1 && lookupTile(2,i,j+2).piece == 'ee')
				highlight(i,j+2,true);
		}
	} else {
		if (j > 0) {
			if (lookupTile(2,i,j-1).piece == 'ee')
				highlight(i,j-1,true);
			if (i < 7) {
				if (lookupTile(2,i+1,j-1).piece.charAt(0) == 'w')
					highlight(i+1,j-1,false);
			}
			if (i > 0) {
				if (lookupTile(2,i-1,j-1).piece.charAt(0) == 'w')
					highlight(i-1,j-1,false);
			}
			if (j == 6 && lookupTile(2,i,j-2).piece == 'ee')
				highlight(i,j-2,true);
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
		var enemyToken = getEnemyToken();
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee')
				highlight(i, j, true);
			if (tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i,j,false);
			if (tileToHighlight.piece != 'ee' && tileToHighlight.piece.charAt(0) != enemyToken)
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
		var enemyToken = getEnemyToken();
		while (i >= 0 && i <= 7 && j <= 7 && j >= 0) {
			i += 1*iMult;
			j += 1*jMult;
			if (i < 0 || i > 7 || j < 0 || j > 7)
				break;
			var tileToHighlight = lookupTile(2,i,j);
			if (tileToHighlight.piece == 'ee')
				highlight(i, j, true);
			if (tileToHighlight.piece.charAt(0) == enemyToken)
				highlight(i,j,false);
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
		isEmpty - If the square is empty or not
*/
function highlight(i,j,isEmpty) {
	var highlightColor;
	if (isEmpty)
		highlightColor = emptyColor;
	else
		highlightColor = enemyColor;
	var tileToHighlight = lookupTile(2,i,j);
	tileToHighlight.setFill(highlightColor);
	tileToHighlight.highlighted = true;
	fgTileLayer.draw();
}

/*
	Function: getEnemyToken
	
	Passes back the enemy token as a one-character string.
*/
function getEnemyToken() {
	if (isWhite)
		return enemyToken = 'b';
	else
		return enemyToken = 'w';
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
	
	Resets the highlight so that a new piece can be highlighted.
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
		
		- <socket>
*/
function connect(host, port) {
	socket = io.connect('http://' + host + ':' + port, {reconnect: false});
	listeners();
}

/*
	Function: listeners
	
	Sets up all socket.io listeners
	
	Global vars:
	
		- <socket>
*/
function listeners() {
	//Connection event--currently no data passed
	socket.on('connect', function() {
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
		board = data.board;
		drawBoard(data.board);
		drawTurn(data.color);
	});
	
	//Bad move handler
	socket.on('badMove', function() {
		alert('Sorry, that was a bad move.  Try a different one');
	});
}

/*
	Function: loader
	
	Loads anything needed--for now, just images.
	
	Global vars:
		
		- <loaded>
		- <pieces>
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

/*
	Function: scrollHandler
	
	Handles scroll event--called whenever the window is scrolled.  Mostly used to tell whether to display the scroll link.
*/
function scrollHandler() {
	var currYOffset = window.pageYOffset;
	var gameOffset = 161;
	$('.scrollLink').css('top',(currYOffset+10)+'px');
	if (currYOffset > gameOffset) {
		$('#scrollDown').css('display', 'none');
		$('#scrollUp').css('display', 'inline');
	} else if (currYOffset < gameOffset) {
		$('#scrollUp').css('display', 'none');
		$('#scrollDown').css('display', 'inline');
	} else {
		clearScrollLink();
	}
}

/*
	Function: clearScrollLink
	
	Sets .scrollLink to display: none.  Renders the scroll links invisible.  Mostly used by <scrollHandler>.
*/
function clearScrollLink() {
	$('.scrollLink').css('display', 'none');
}

/*
	Function: resizeHandler
	
	Handles the resizing of the window.  Resizes the board to fill the screen and scrolls to it.
*/
function resizeHandler() {
	clearScrollLink();
	if (window.innerHeight < window.innerWidth)
		boardSize = window.innerHeight;
	else
		boardSize = window.innerWidth;
	tileSize = boardSize/8;
	$('#game').css('width', boardSize + 'px');
	$('#game').css('height', boardSize + 'px');
	stage.setHeight(boardSize);
	stage.setWidth(boardSize);
	drawBoard(board);
	window.location.href = '#game';
}

window.onload = function() {
	initPage();
};

window.onscroll = function() {
	scrollHandler();
};

window.onresize = function() {
	resizeHandler();
};