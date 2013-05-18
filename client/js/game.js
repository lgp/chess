var stage;
var bgTileLayer;
var pieceLayer;
var fgTileLayer;

var white;



/*
	Function: initPage
	
	Initializes the page, including instantiating the stage and layers.  Called in the $(document).ready() function.
	
	Variables used:
	
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

$(document).ready(function() {
	initPage();
});