// Configuration variables
var width = 100,
    height = 40,
    px = 8,
    i, j;
// Array method for finding an element at an index where
// index can be less than 0 or greater than length
// for making infinite grids.
Array.prototype.elAt = function(index){
  return this.slice(index%this.length)[0];
};

document.addEventListener('DOMContentLoaded', function(){
  var gol = new Game(),
     $grid = document.createElement('canvas');

  $grid.height = height*px;
  $grid.width = width*px;
  document.body.appendChild($grid);
  $grid = $grid.getContext('2d');

  gol.randomGrid();
  gol.buildGrid($grid);
  setInterval(function(){
    $grid.innerHTML = '';
    gol.calcTick();
    gol.buildGrid($grid);
  }, 80);

});


function Game(){
  // Constructor for the grid
  this.grid = [];
  for (i = 0; i < height; i++) {
    this.grid[i] = [];
    for (j = 0; j < width; j++) {
      this.grid[i][j] = 0;
    }
  }

  this.randomGrid = function(){
    var ratio;
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        // This ratio makes the edges more likely for creation
        ratio = (Math.abs((height/2)-i)/height/2)*
                (Math.abs((width/2)-j)/width/2);
        this.grid[i][j] = Math.floor(Math.random()+ratio*5);
      }
    }
  };
  
  this.buildGrid =function($grid){
    // Old method for the table
    //
    // var frag = document.createDocumentFragment();
    // for(i = 0; i < height; i++){
    //   var row = document.createElement('tr');
    //   for(j=0; j<width; j++){
    //     var col = document.createElement('td');
    //     if(this.grid[i][j]){ 
    //       col.classList.add('alive');
    //       if(this.grid[i][j]>1) col.classList.add('old');
    //     }
    //     row.appendChild(col);
    //   }
    //   frag.appendChild(row);
    // }
    // $grid.appendChild(frag);
    //
    $grid.strokeStyle="#111";
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        switch(this.grid[i][j]){
        case 1:
          $grid.fillStyle = "rgb(41,161,93)";
          $grid.fillRect(j*px,i*px,px,px);
          $grid.strokeRect(j*px,i*px,px,px);
          break;
        case 2:
          $grid.fillStyle = "rgb(40,110,65)";
          $grid.fillRect(j*px,i*px,px,px);
          $grid.strokeRect(j*px,i*px,px,px);
          break;
        case false:
          $grid.clearRect(j*px, i*px, px, px);
          break;
        }
      }
    }
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
        else if(this.grid[i][j]) newGrid.grid[i][j] = false; 
      }
    }
    this.grid = newGrid.grid;
  };

  function isAlive(y,x,arr){
    var el = arr[y][x],
        neighbors=0, k, l;
    for (k = -1; k < 2; k++) {
      for (l = -1; l < 2; l++) {
        if(arr.elAt(k+y).elAt(l+x) && !(k===0&&l===0))
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
