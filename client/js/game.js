var stage;
var bgTileLayer;
var pieceLayer;
var fgTileLayer;



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
	
}

$(document).ready(function() {
	initPage();
});