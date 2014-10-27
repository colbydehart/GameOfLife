var width = 60,
    height = 60,
    i,j;

document.addEventListener('DOMContentLoaded', function(){
  var gol = new Game(),
  $grid = document.getElementById('grid');

  gol.randomGrid();
  gol.buildGrid($grid);
  setInterval(function(){
    $grid.innerHTML = '';
    gol.calcTick();
    gol.buildGrid($grid);
  }, 50);

});


function Game(){
  this.grid = [];
  for (i = 0; i < height; i++) {
    this.grid[i] = [];
    for (j = 0; j < width; j++) {
      this.grid[i][j] = 0;
    }
  }

  this.randomGrid = function(){
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        this.grid[i][j] = Math.floor(Math.random()+0.2);
        // this.grid[i][j] = 1;
      }
    }
    // this.grid[1][1]=this.grid[1][0]=this.grid[1][2]=1;
  };
  
  this.buildGrid =function($grid){
    var frag = document.createDocumentFragment();
    for(i = 0; i < height; i++){
      var row = document.createElement('tr');
      for(j=0; j<width; j++){
        var col = document.createElement('td');
        if(this.grid[i][j]){ 
          col.classList.add('alive');
          if(this.grid[i][j]>1) col.classList.add('old');
        }
        row.appendChild(col);
      }
      frag.appendChild(row);
    }
    $grid.appendChild(frag);
  };

  this.calcTick = function(){
    var newGrid = new Game();
    
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        var curEl = this.grid[i][j];
        if(isAlive(i, j, this.grid)){
          newGrid.grid[i][j] = 1;
          if(this.grid[i][j]) newGrid.grid[i][j] = 2;
        }
      }
    }
    this.grid = newGrid.grid;
  };

  function isAlive(y,x,arr){
    var el = arr[y][x],
        neighbors=0, k, l;
    for (k = y===0?0:-1; k < 2; k++) {
      for (l = x===0?0:-1; l < 2; l++) {
        if(arr[k+y] && arr[k+y][l+x] && !(k===0&&l===0))
          neighbors++;
      }
    }
    if(!el && neighbors === 3){
      return true;
    }
    else if(el && ( neighbors === 2 || neighbors === 3 ))
      return true;
    else return false;
  }
  
  return this;
}
