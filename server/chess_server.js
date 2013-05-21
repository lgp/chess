var io = require('socket.io').listen(8080);


var room = new Room();
room.init();

function Room() {
	this.init = function() {
		this.colors = ['black', 'white'];
		this.turn = 'white';
		this.board = [8];
		for(var i=0; i<8; i++) this.board[i] = [8];
		this.locboard = [8];
		for(var i=0; i<8; i++) this.locboard[i] = [8];
		for(var i=0; i<8; i++)
			for(var j=0; j<8; j++) {
				this.board[i][j] = 'ee';
				this.locboard[i][j] = 'ee';
			}
		this.board[0][0] = 'wr';
		this.locboard[0][0] = new Piece('wr', {x:0,y:0});
		this.board[1][0] = 'wh';
		this.locboard[1][0] = new Piece('wh', {x:1,y:0});
		this.board[2][0] = 'wb';
		this.locboard[2][0] = new Piece('wb', {x:2,y:0});
		this.board[3][0] = 'wq';
		this.locboard[3][0] = new Piece('wq', {x:3,y:0});
		this.board[4][0] = 'wk';
		this.locboard[4][0] = new Piece('wk', {x:4,y:0});
		this.board[5][0] = 'wb';
		this.locboard[5][0] = new Piece('wb', {x:5,y:0});
		this.board[6][0] = 'wh';
		this.locboard[6][0] = new Piece('wh', {x:6,y:0});
		this.board[7][0] = 'wr';
		this.locboard[7][0] = new Piece('wr', {x:7,y:0});
		this.board[0][7] = 'br';
		this.locboard[0][7] = new Piece('br', {x:0,y:7});
		this.board[1][7] = 'bh';
		this.locboard[1][7] = new Piece('bh', {x:1,y:7});
		this.board[2][7] = 'bb';
		this.locboard[2][7] = new Piece('bb', {x:2,y:7});
		this.board[3][7] = 'bk';
		this.locboard[3][7] = new Piece('bk', {x:3,y:7});
		this.board[4][7] = 'bq';
		this.locboard[4][7] = new Piece('bq', {x:4,y:7});
		this.board[5][7] = 'bb';
		this.locboard[5][7] = new Piece('bb', {x:5,y:7});
		this.board[6][7] = 'bh';
		this.locboard[6][7] = new Piece('bh', {x:6,y:7});
		this.board[7][7] = 'br';
		this.locboard[7][7] = new Piece('br', {x:7,y:7});
		for(var j=0; j<this.board.length; j++)
			 for(var i=1; i<7; i+=5){
				if(i == 1) {
					this.board[j][i] = 'wp';
					this.locboard[j][i] = new Piece('wp', {x:j,y:i});
				}
				else {
					this.board[j][i] = 'bp';
					this.locboard[j][i] = new Piece('bp', {x:j,y:i});
				}
			}
		this.print();
	}
	this.move = function(oldl, newl) {
		this.board[newl.x][newl.y] = this.board[oldl.x][oldl.y];
		this.locboard[newl.x][newl.y] = this.locboard[oldl.x][oldl.y];
		this.board[oldl.x][oldl.y] = 'ee';
		this.locboard[oldl.x][oldl.y] = 'ee';
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
	this.print = function() {
		console.log(this.board);
	}
}

function Piece(type, initloc) {
	this.type = type;
	this.color = type.substring(0,1);
	this.loc = initloc;
	this.validmoves = [];
	this.hasMoved = false;
	this.getMoved = function() {
		return this.hasMoved;
	}
	this.upgrade = function(newpiece) {
		switch(this.type) {
			case 'wp':
				if(this.loc.y === 7) this.type = this.color + newpiece;
				break;
			case 'bp':
				if(this.loc.y === 0) this.type = this.color + newpiece;
				break;
			default:
				break;
		}
	}
	this.logValidMoves() {
		console.log('valid moves: ');
		for(var i=0; i<validmoves.length; i++) {
			console.log('[' + this.validmoves[i].x + '][' + this.validmoves[i].y + ']');
		}
	}
	this.move = function(newloc) {
		this.getMoves();
		console.log('got into move: ' + this.type + ' moving to [' + newloc.x + '][' + newloc.y + ']' );
		this.logValidMoves();
		if(this.validmoves.indexOf(newloc) !== -1) {
			console.log('and it was a valid move');
			room.move(loc, newloc);
			this.loc = newloc;
			this.hasMoved = true;
			this.getMoves();
			return true;
		}
		else return false;
	}
	this.getMoves = function() {
		var x = this.loc.x;
		var y = this.loc.y;
		switch(type) {
			case 'wp':
				if(!this.getMoved() && room.locboard[x][y+2] === 'ee')
					this.validmoves.push({x:x, y:y+2});
				if((y<7) && room.locboard[x][y+1] === 'ee') this.validmoves.push({x:x, y:y+1});
				if((y<7 && x<7) && room.locboard[x+1][y+1].color === 'b') this.validmoves.push({x:x+1, y:y+1});
				if((y<7 && x>1) && room.locboard[x-1][y+1].color === 'b') this.validmoves.push({x:x-1, y:y+1});
				break;
			case 'bp':
				if(!this.getMoved() && room.locboard[x][y-2] === 'ee')
					this.validmoves.push({x:x, y:y-2});
				if((y>1) && room.locboard[x][y-1] === 'ee') this.validmoves.push({x:x, y:y-1});
				if((y>1 && x<7) && room.locboard[x+1][y-1].color === 'w') this.validmoves.push({x:x+1, y:y-1});
				if((y>1 && x>1) && room.locboard[x-1][y-1].color === 'w') this.validmoves.push({x:x-1, y:y-1});
				break;
			case 'wr':
				for(var i=x+1; i < 7 && room.locboard[i][y] === 'ee'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'b') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; i > 1 && room.locboard[i][y] === 'ee'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'b') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; i < 7 && room.locboard[x][i] === 'ee'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'b') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; i > 1 && room.locboard[x][i] === 'ee'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'b') this.validmoves.push({x:x, y:i-1});
				}
				break;
			case 'br':
				for(var i=x+1; i < 7 && room.locboard[i][y] === 'ee'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'w') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; i > 1 && room.locboard[i][y] === 'ee'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'w') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; i < 7 && room.locboard[x][i] === 'ee'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'w') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; i > 1 && room.locboard[x][i] === 'ee'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'w') this.validmoves.push({x:x, y:i-1});
				}
				break;
			case 'wh':
				if((x<6 && y<7) && (room.locboard[x+2][y+1] === 'ee' || room.locboard[x+2][y+1].color === 'b')) this.validmoves.push({x:x+2, y:y+1});
				if((x<7 && y<6) && (room.locboard[x+1][y+2] === 'ee' || room.locboard[x+1][y+2].color === 'b')) this.validmoves.push({x:x+1, y:y+2});
				if((x<6 && y>1) && (room.locboard[x+2][y-1] === 'ee' || room.locboard[x+2][y-1].color === 'b')) this.validmoves.push({x:x+2, y:y-1});
				if((x<7 && y>2) && (room.locboard[x+1][y-2] === 'ee' || room.locboard[x+1][y-2].color === 'b')) this.validmoves.push({x:x+1, y:y-2});
				if((x>2 && y<7) && (room.locboard[x-2][y+1] === 'ee' || room.locboard[x-2][y+1].color === 'b')) this.validmoves.push({x:x-2, y:y+1});
				if((x>2 && y>1) && (room.locboard[x-2][y-1] === 'ee' || room.locboard[x-2][y-1].color === 'b')) this.validmoves.push({x:x-2, y:y-1});
				if((x>1 && y<6) && (room.locboard[x-1][y+2] === 'ee' || room.locboard[x-1][y+2].color === 'b')) this.validmoves.push({x:x-1, y:y+2});
				if((x>1 && y>2) && (room.locboard[x-1][y-2] === 'ee' || room.locboard[x-1][y-2].color === 'b')) this.validmoves.push({x:x-1, y:y-2});
				break;
			case 'bh':
				if((x<6 && y<7) && (room.locboard[x+2][y+1] === 'ee' || room.locboard[x+2][y+1].color === 'w')) this.validmoves.push({x:x+2, y:y+1});
				if((x<7 && y<6) && (room.locboard[x+1][y+2] === 'ee' || room.locboard[x+1][y+2].color === 'w')) this.validmoves.push({x:x+1, y:y+2});
				if((x<6 && y>1) && (room.locboard[x+2][y-1] === 'ee' || room.locboard[x+2][y-1].color === 'w')) this.validmoves.push({x:x+2, y:y-1});
				if((x<7 && y>2) && (room.locboard[x+1][y-2] === 'ee' || room.locboard[x+1][y-2].color === 'w')) this.validmoves.push({x:x+1, y:y-2});
				if((x>2 && y<7) && (room.locboard[x-2][y+1] === 'ee' || room.locboard[x-2][y+1].color === 'w')) this.validmoves.push({x:x-2, y:y+1});
				if((x>2 && y>1) && (room.locboard[x-2][y-1] === 'ee' || room.locboard[x-2][y-1].color === 'w')) this.validmoves.push({x:x-2, y:y-1});
				if((x>1 && y<6) && (room.locboard[x-1][y+2] === 'ee' || room.locboard[x-1][y+2].color === 'w')) this.validmoves.push({x:x-1, y:y+2});
				if((x>1 && y>2) && (room.locboard[x-1][y-2] === 'ee' || room.locboard[x-1][y-2].color === 'w')) this.validmoves.push({x:x-1, y:y-2});
				break;
			case 'wb':
				for(var i=x+1, j=y+1; i<7 && j<7 && room.locboard[i][j] === 'ee'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'b') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; i>1 && j>1 && room.locboard[i][j] === 'ee'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'b') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; i<7 && j>1 && room.locboard[i][j] === 'ee'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'b') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; i>1 && j<7 && room.locboard[i][j] === 'ee'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'b') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'bb':
				for(var i=x+1, j=y+1; i<7 && j<7 && room.locboard[i][j] === 'ee'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'w') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; i>1 && j>1 && room.locboard[i][j] === 'ee'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'w') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; i<7 && j>1 && room.locboard[i][j] === 'ee'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'w') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; i>1 && j<7 && room.locboard[i][j] === 'ee'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'w') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'wq':
				for(var i=x+1; i < 7 && room.locboard[i][y] === 'ee'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'b') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; i > 1 && room.locboard[i][y] === 'ee'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'b') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; i < 7 && room.locboard[x][i] === 'ee'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'b') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; i > 1 && room.locboard[x][i] === 'ee'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'b') this.validmoves.push({x:x, y:i-1});
				}
				for(var i=x+1, j=y+1; i<7 && j<7 && room.locboard[i][j] === 'ee'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'b') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; i>1 && j>1 && room.locboard[i][j] === 'ee'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'b') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; i<7 && j>1 && room.locboard[i][j] === 'ee'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'b') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; i>1 && j<7 && room.locboard[i][j] === 'ee'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'b') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'bq':
				for(var i=x+1; i < 7 && room.locboard[i][y] === 'ee'; i++){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i+1][y].color === 'w') this.validmoves.push({x:i+1, y:y});
				}
				for(var i=x-1; i > 1 && room.locboard[i][y] === 'ee'; i--){
					this.validmoves.push({x:i, y:y});
					if(room.locboard[i-1][y].color === 'w') this.validmoves.push({x:i-1, y:y});
				}
				for(var i=y+1; i < 7 && room.locboard[x][i] === 'ee'; i++){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i+1].color === 'w') this.validmoves.push({x:x, y:i+1});
				}
				for(var i=y-1; i > 1 && room.locboard[x][i] === 'ee'; i--){
					this.validmoves.push({x:x, y:i});
					if(room.locboard[x][i-1].color === 'w') this.validmoves.push({x:x, y:i-1});
				}
				for(var i=x+1, j=y+1; i<7 && j<7 && room.locboard[i][j] === 'ee'; i++, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j+1].color === 'w') this.validmoves.push({x:i+1, y:j+1});
				}
				for(var i=x-1, j=y-1; i>1 && j>1 && room.locboard[i][j] === 'ee'; i--, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j-1].color === 'w') this.validmoves.push({x:i-1, y:j-1});
				}
				for(var i=x+1, j=y-1; i<7 && j>1 && room.locboard[i][j] === 'ee'; i++, j--) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i+1][j-1].color === 'w') this.validmoves.push({x:i+1, y:j-1});
				}
				for(var i=x-1, j=y+1; i>1 && j<7 && room.locboard[i][j] === 'ee'; i--, j++) {
					this.validmoves.push({x:i, y:j});
					if(room.locboard[i-1][j+1].color === 'w') this.validmoves.push({x:i-1, y:j+1});
				}
				break;
			case 'wk':
				var badmoves = room.getBlack();
				if((x<7) && (room.locboard[x+1][y] === 'ee' || room.locboard[x+1][y].color === 'b') && badmoves.indexOf({x:x+1, y:y}) === -1)
					this.validmoves.push({x:x+1, y:y});
				if((x>1) && (room.locboard[x-1][y] === 'ee' || room.locboard[x-1][y].color === 'b') && badmoves.indexOf({x:x-1, y:y}) === -1)
					this.validmoves.push({x:x-1, y:y});
				if((y<7) && (room.locboard[x][y+1] === 'ee' || room.locboard[x][y+1].color === 'b') && badmoves.indexOf({x:x, y:y+1}) === -1)
					this.validmoves.push({x:x, y:y+1});
				if((y>1) && (room.locboard[x][y-1] === 'ee' || room.locboard[x][y-1].color === 'b') && badmoves.indexOf({x:x, y:y-1}) === -1)
					this.validmoves.push({x:x, y:y-1});
				break;
			case 'bk':
				var badmoves = room.getBlack();
				if((x<7) && (room.locboard[x+1][y] === 'ee' || room.locboard[x+1][y].color === 'w') && badmoves.indexOf({x:x+1, y:y}) === -1)
					this.validmoves.push({x:x+1, y:y});
				if((x>1) && (room.locboard[x-1][y] === 'ee' || room.locboard[x-1][y].color === 'w') && badmoves.indexOf({x:x-1, y:y}) === -1)
					this.validmoves.push({x:x-1, y:y});
				if((y<7) && (room.locboard[x][y+1] === 'ee' || room.locboard[x][y+1].color === 'w') && badmoves.indexOf({x:x, y:y+1}) === -1)
					this.validmoves.push({x:x, y:y+1});
				if((y>1) && (room.locboard[x][y-1] === 'ee' || room.locboard[x][y-1].color === 'w') && badmoves.indexOf({x:x, y:y-1}) === -1)
					this.validmoves.push({x:x, y:y-1});
				break;
			default:
				break;
		}
		return this.validmoves;
	}
	this.getMoves();
}

io.on('connection', function(socket) {
	if(room.colors.length == 0) socket.disconnect();
	var color = room.colors.pop();
	socket.emit('color', {color: color});
	socket.set('color', color, function(){});
	socket.emit('update', room.board);
	
	socket.on('move', function(data) {
		var fx = data.from.x, fy = data.from.y;
		socket.get('color', function(err, color) {
			if(color === room.turn) {
				if(data.upgrade !== false) {
					room.locboard[fx][fy].upgrade(data.upgrade);
				}
				else {
					console.log('attempting move of: ' + room.locboard[fx][fy].type + '[' + fx + ']' + '[' + fy + '] to: [' + data.to.x + ']' + '[' + data.to.y + ']');
					if(room.locboard[fx][fy].move(data.to)) console.log('moved');
					else socket.emit('badMove');
				}
			}
			else {
				console.log('NOT PLAYERS TURN: ' + color);
				socket.emit('badMove');
			}
			io.sockets.emit('update', room.board);
			room.print();
		});
	});
});