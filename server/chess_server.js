var io = require('socket.io');


function Room() {
	this.colors = ['black', 'white'];
	this.turn = 'white';
	this.board = [][];
	this.locboard = [][];
	for(var i=0; i<8; i++)
		for(var j=0; j<8; j++) {
			this.board[i][j] = 'e';
			this.locboard[i][j] = 'e';
		}
	this.board[0][0] = 'wr';
	this.locboard[0][0] = new Piece('wr', {0,0});
	this.board[1][0] = 'wh';
	this.locboard[1][0] = new Piece('wh', {1,0});
	this.board[2][0] = 'wb';
	this.locboard[2][0] = new Piece('wb', {2,0});
	this.board[3][0] = 'wq';
	this.locboard[3][0] = new Piece('wq', {3,0});
	this.board[4][0] = 'wk';
	this.locboard[4][0] = new Piece('wk', (4,0});
	this.board[5][0] = 'wb';
	this.locboard[5][0] = new Piece('wb', {5,0});
	this.board[6][0] = 'wh';
	this.locboard[6][0] = new Piece('wh', {6,0});
	this.board[7][0] = 'wr';
	this.locboard[7][0] = new Piece('wr', {7,0});
	this.board[0][7] = 'br';
	this.locboard[0][7] = new Piece('br', {0,7});
	this.board[1][7] = 'bh';
	this.locboard[1][7] = new Piece('bh', {1,7});
	this.board[2][7] = 'bb';
	this.locboard[2][7] = new Piece('bb', {2,7});
	this.board[3][7] = 'bk';
	this.locboard[3][7] = new Piece('bk', {3,7});
	this.board[4][7] = 'bq';
	this.locboard[4][7] = new Piece('bq', {4,7});
	this.board[5][7] = 'bb';
	this.locboard[5][7] = new Piece('bb', {5,7});
	this.board[6][7] = 'bh';
	this.locboard[6][7] = new Piece('bh', {6,7});
	this.board[7][7] = 'br';
	this.locboard[7][7] = new Piece('br', {7,7});
	for(var j=0; j<board.length; j++)
		 for(var i=1; i<7; i+=5){
			if(i == 1) {
				this.board[j][i] = 'wp';
				this.locboard[j][i] = new Piece('wp', {j,i});
			}
			else {
				board[j][i] = 'bp';
				this.locboard[j][i] = new Piece('bp', {j,i});
			}
		}
	this.move = function(oldl, newl) {
		this.board[newl.x][newl.y] = this.board[oldl.x][oldl.y];
		this.locboard[newl.x][newl.y] = this.locboard[oldl.x][oldl.y];
		this.board[oldl.x][oldl.y] === 'e';
		this.locboard[oldl.x][oldl.y] === 'e';
		if(this.turn === 'white') this.turn = 'black';
		else this.turn = 'white';
	}
	this.getBlack = function() {
		var blackmoves = [];
		for(var i=0; i<7; i++)
			for(var j=0; j<7; j++)
				if(this.locboard[i][j].color === 'b') blackmoves = blackmoves.concat(this.locboard[i][j].getMoves());
				
		return blackmoves;
	}
	this.getWhite = function() {
		var whitemoves = [];
		for(var i=0; i<7; i++)
			for(var j=0; j<7; j++)
				if(this.locboard[i][j].color === 'w') whitemoves = whitemoves.concat(this.locboard[i][j].getMoves());
				
		return whitemoves;
	}
}

var room = new Room();

function Piece(type, initloc) {
	this.type = type;
	this.color = type.substring(0,1);
	this.loc = initloc;
	this.validmoves = [];
	this.getMoves();
	this.move = function(newloc) {
		this.getMoves();
		if(this.validmoves.conatins(newloc)) {
			room.move(loc, newloc);
			this.loc = newloc;
			this.getMoves();
			return true;
		}
		else return false;
	}
	this.getMoves = function() {
		var x = loc.x;
		var y = loc.y;
		switch(type) {
			case 'wp':
				if(room.locboard[x][y+1] === 'e') this.validmoves.push({x:x, y:y+1});
				if(room.locboard[x+1][y+1].color === 'b') this.validmoves.push({x:x+1, y:y+1});
				if(room.locboard[x-1][y+1].color === 'b') this.validmoves.push({x:x-1, y:y+1});
				break;
			case 'bp':
				if(room.locboard[x][y-1] === 'e') this.validmoves.push({x:x, y:y-1});
				if(room.locboard[x+1][y-1].color === 'w') this.validmoves.push({x:x+1, y:y-1});
				if(room.locboard[x-1][y-1].color === 'w') this.validmoves.push({x:x-1, y:y-1});
				break;
			case 'wr':
				for(var i=x+1; room.locboards[i][y] === 'e'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'b') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; room.locboards[i][y] === 'e'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'b') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; room.locboards[x][i] === 'e'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'b') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; room.locboards[x][i] === 'e'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'b') this.validmoves.push({x:x, y:i-1});
				}
				break;
			case 'br':
				for(var i=x+1; room.locboards[i][y] === 'e'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'w') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; room.locboards[i][y] === 'e'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'w') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; room.locboards[x][i] === 'e'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'w') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; room.locboards[x][i] === 'e'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'w') this.validmoves.push({x:x, y:i-1});
				}
				break;
			case 'wh':
				if(room.locboard[x+2][y+1] === 'e' || room.locboard[x+2][y+1].color === 'b') this.validmoves.push({x:x+2, y:y+1});
				if(room.locboard[x+1][y+2] === 'e' || room.locboard[x+1][y+2].color === 'b') this.validmoves.push({x:x+1, y:y+2});
				if(room.locboard[x+2][y-1] === 'e' || room.locboard[x+2][y-1].color === 'b') this.validmoves.push({x:x+2, y:y-1});
				if(room.locboard[x+1][y-2] === 'e' || room.locboard[x+1][y-2].color === 'b') this.validmoves.push({x:x+1, y:y-2});
				if(room.locboard[x-2][y+1] === 'e' || room.locboard[x-2][y+1].color === 'b') this.validmoves.push({x:x-2, y:y+1});
				if(room.locboard[x-2][y-1] === 'e' || room.locboard[x-2][y-1].color === 'b') this.validmoves.push({x:x-2, y:y-1});
				if(room.locboard[x-1][y+2] === 'e' || room.locboard[x-1][y+2].color === 'b') this.validmoves.push({x:x-1, y:y+2});
				if(room.locboard[x-1][y-2] === 'e' || room.locboard[x-1][y-2].color === 'b') this.validmoves.push({x:x-1, y:y-2});
				break;
			case 'bh':
				if(room.locboard[x+2][y+1] === 'e' || room.locboard[x+2][y+1].color === 'w') this.validmoves.push({x:x+2, y:y+1});
				if(room.locboard[x+1][y+2] === 'e' || room.locboard[x+1][y+2].color === 'w') this.validmoves.push({x:x+1, y:y+2});
				if(room.locboard[x+2][y-1] === 'e' || room.locboard[x+2][y-1].color === 'w') this.validmoves.push({x:x+2, y:y-1});
				if(room.locboard[x+1][y-2] === 'e' || room.locboard[x+1][y-2].color === 'w') this.validmoves.push({x:x+1, y:y-2});
				if(room.locboard[x-2][y+1] === 'e' || room.locboard[x-2][y+1].color === 'w') this.validmoves.push({x:x-2, y:y+1});
				if(room.locboard[x-2][y-1] === 'e' || room.locboard[x-2][y-1].color === 'w') this.validmoves.push({x:x-2, y:y-1});
				if(room.locboard[x-1][y+2] === 'e' || room.locboard[x-1][y+2].color === 'w') this.validmoves.push({x:x-1, y:y+2});
				if(room.locboard[x-1][y-2] === 'e' || room.locboard[x-1][y-2].color === 'w') this.validmoves.push({x:x-1, y:y-2});
				break;
			case 'wb':
				for(var i=x+1, j=y+1; room.locboard[i][j] === 'e'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'b') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; room.locboard[i][j] === 'e'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'b') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; room.locboard[i][j] === 'e'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'b') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; room.locboard[i][j] === 'e'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'b') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'bb':
				for(var i=x+1, j=y+1; room.locboard[i][j] === 'e'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'w') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; room.locboard[i][j] === 'e'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'w') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; room.locboard[i][j] === 'e'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'w') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; room.locboard[i][j] === 'e'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'w') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'wq':
				for(var i=x+1; room.locboards[i][y] === 'e'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'b') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; room.locboards[i][y] === 'e'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'b') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; room.locboards[x][i] === 'e'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'b') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; room.locboards[x][i] === 'e'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'b') this.validmoves.push({x:x, y:i-1});
				}
				for(var i=x+1, j=y+1; room.locboard[i][j] === 'e'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'b') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; room.locboard[i][j] === 'e'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'b') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; room.locboard[i][j] === 'e'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'b') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; room.locboard[i][j] === 'e'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'b') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'bq':
				for(var i=x+1; room.locboards[i][y] === 'e'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'w') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; room.locboards[i][y] === 'e'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'w') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; room.locboards[x][i] === 'e'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'w') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; room.locboards[x][i] === 'e'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'w') this.validmoves.push({x:x, y:i-1});
				}
				for(var i=x+1, j=y+1; room.locboard[i][j] === 'e'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'w') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; room.locboard[i][j] === 'e'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'w') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; room.locboard[i][j] === 'e'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'w') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; room.locboard[i][j] === 'e'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'w') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'wk':
				var badmoves = room.getBlack();
				if((room.locboard[x+1][y] === 'e' || room.locboard[x+1][y].color === 'b') && badmoves.indexOf({x+1, y}) === -1)
					this.validmoves.push({x:x+1, y:y});
				if((room.locboard[x-1][y] === 'e' || room.locboard[x-1][y].color === 'b') && badmoves.indexOf({x-1, y}) === -1)
					this.validmoves.push({x:x-1, y:y});
				if((room.locboard[x][y+1] === 'e' || room.locboard[x][y+1].color === 'b') && badmoves.indexOf({x, y+1}) === -1)
					this.validmoves.push({x:x, y:y+1});
				if((room.locboard[x][y-1] === 'e' || room.locboard[x][y-1].color === 'b') && badmoves.indexOf({x, y-1}) === -1)
					this.validmoves.push({x:x, y:y-1});
				break;
			case 'bk':
				var badmoves = room.getBlack();
				if((room.locboard[x+1][y] === 'e' || room.locboard[x+1][y].color === 'w') && badmoves.indexOf({x+1, y}) === -1)
					this.validmoves.push({x:x+1, y:y});
				if((room.locboard[x-1][y] === 'e' || room.locboard[x-1][y].color === 'w') && badmoves.indexOf({x-1, y}) === -1)
					this.validmoves.push({x:x-1, y:y});
				if((room.locboard[x][y+1] === 'e' || room.locboard[x][y+1].color === 'w') && badmoves.indexOf({x, y+1}) === -1)
					this.validmoves.push({x:x, y:y+1});
				if((room.locboard[x][y-1] === 'e' || room.locboard[x][y-1].color === 'w') && badmoves.indexOf({x, y-1}) === -1)
					this.validmoves.push({x:x, y:y-1});
				break;
		}
		return this.validmoves;
	}
}

io.on('connection', function(socket) {
	if(room.colors.length == 0) socket.disconnect();
	socket.set('color', room.colors.pop(), function(){});
	
	socket.on('move', function(data) {
		var fx = data.from.x, fy = data.from.y;
		socket.get('color', function(err, color) {
			if(color === room.turn) {
				var moves = room.locboard[fx][fy].getMoves();
				if(moves.indexOf(data.to) === -1) room.move(data.from, data.to);
				else socket.emit('bad move');
			}
			else socket.emit('bad move');
			io.sockets.emit('update', room.board);
		});
	});
});