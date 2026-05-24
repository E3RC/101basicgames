var AI = {
  tictacToeMove: function(board, player) {
    for(var i=0;i<3;i++) for(var j=0;j<3;j++) if(board[i][j]===' '){board[i][j]=player;if(this.wins(board,player)){board[i][j]=' ';return[i,j];}board[i][j]=' ';}
    var opp=player==='X'?'O':'X';
    for(var i=0;i<3;i++) for(var j=0;j<3;j++) if(board[i][j]===' '){board[i][j]=opp;if(this.wins(board,opp)){board[i][j]=' ';return[i,j];}board[i][j]=' ';}
    if(board[1][1]===' ') return[1,1];
    var corners=[[0,0],[0,2],[2,0],[2,2]]; RNG.shuffle(corners);
    for(var k=0;k<corners.length;k++){var c=corners[k];if(board[c[0]][c[1]]===' ')return c;}
    var edges=[[0,1],[1,0],[1,2],[2,1]]; RNG.shuffle(edges);
    for(var k=0;k<edges.length;k++){var e=edges[k];if(board[e[0]][e[1]]===' ')return e;}
    return null;
  },
  wins: function(b,p) {
    for(var i=0;i<3;i++){if(b[i][0]===p&&b[i][1]===p&&b[i][2]===p)return true;if(b[0][i]===p&&b[1][i]===p&&b[2][i]===p)return true;}
    return(b[0][0]===p&&b[1][1]===p&&b[2][2]===p)||(b[0][2]===p&&b[1][1]===p&&b[2][0]===p);
  },
  boardFull: function(b) { for(var i=0;i<3;i++) for(var j=0;j<3;j++) if(b[i][j]===' ')return false; return true; }
};
