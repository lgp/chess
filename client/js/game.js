var stage;
var bgTileLayer;
var pieceLayer;
var fgTileLayer;

var white;

var socket;

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
		height: 960,
		width: 960,
		container: 'game'
	});
	bgTileLayer = new Kinetic.Layer();
	pieceLayer = new Kinetic.Layer();
	fgTileLayer = new Kinetic.Layer();
	
	stage.add(bgTileLayer);
	stage.add(pieceLayer);
	stage.add(fgTileLayer);
}

/*
	Function: drawBoard
	
	Draws the board whenever an update event comes in.
	
	Paramaters:
	
		board - The board to be drawn.
	
	
*/
function drawBoard(board) {
	for (i in board) {
		for (j in board[i]) {
			
		}
	}
	stage.draw();
}

/*
	Function: drawbgTile
	
	Draws background tiles.
	
	Paramaters:
	
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
*/
function drawbgTile(x,y) {
}

/*
	Function: drawPiece
	
	Draws pieces.
	
	Paramaters:
	
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
		id - ID of piece (color(b,w), piece ID(r,h,k,p,b,q))
*/
function drawPiece(x,y,id) {
}

/*
	Function: drawfgTile
	
	Draws foreground tiles.
	
	Paramaters:
	
		x - X coordinate (0-7) of tile
		y - Y coordinate (0-7) of tile
*/
function drawfgTile(x,y) {
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
	Function: connect
	
	Connects the client to the game server.
	
	Paramaters:
		
		host - IP of game server
		port - Port of game server
		
	Global vars:
		
		socket - Socket used to send all game data
*/
function connect(host, port) {
	socket = io.connect('http://' + host + ':' + port);
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
			white = true;
		else
			white = false;
	});
	
	//Updates board from server
	socket.on('update', function(data) {
		drawBoard(data.board);
	});
	
	//Bad move handler
	socket.on('badMove', function() {
		alert('Sorry, that was a bad move.  Try a different one');
	});
}

$(document).ready(function() {
	initPage();
});