// Configuration variables
var width = 80,
    height = 80,
    px = 10,
    i, j,
    clicked = false,
    timeInt = 80,
    gol = new Game();

// Array method for finding an element at an index where
// index can be less than 0 or greater than length
// for making infinite grids.
Array.prototype.elAt = function(index){
  return this.slice(index%this.length)[0];
};

document.addEventListener('DOMContentLoaded', function(){
  //create the grid, set it's size, and get context
  var $grid = document.createElement('canvas');
  $grid.height = height*px;
  $grid.width = width*px;
  document.body.appendChild($grid);
  //Preventselecting on the grid
  $grid.addEventListener('selectstart', function(e){
    e.preventDefault();return false;
  }, false);
  //sets clicked flag to true of false for drawing.
  document.addEventListener('mousedown',function(event){
    clicked = true;
  });
  document.addEventListener('mouseup',function(){
    clicked = false;
  });
  //Draws new living cells
  $grid.addEventListener('mousemove', mouseDraw);
  $grid.addEventListener('mousedown', mouseDraw);
  $grid = $grid.getContext('2d');

  // build the initial grid
  gol.randomGrid();
  gol.calcTick(true);
  gol.buildGrid($grid);
  //set an interval to apply rules and build grid, stopping
  //when grid is stable
  var living = true, a =1;
  $button = document.querySelector('button');
  // $button.addEventListener('click', function(){
    var intervalId = setInterval(function(){
      $grid.innerHTML = '';
      living = gol.calcTick();
      gol.buildGrid($grid);
      a++;
      if(!living){ 
        console.log("done. lived for " + a + " ticks");
        var $p = document.createElement('p');
        $p.innerHTML = "Done. Lived for " + a + " ticks.";
        document.body.appendChild($p);
        clearInterval(intervalId);
      }
    }, timeInt);
  // });

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
    //Creates a random grid with the corners and edges
    //having a greater chance for random generation
    var ratio;
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        // This ratio makes the edges more likely for creation
        ratio = (Math.abs((height/2)-i)/height/2)*
                (Math.abs((width/2)-j)/width/2);
        this.grid[i][j] = Math.floor(Math.random()+ratio*3);
      }
    }
  };
  
  this.buildGrid =function($grid){
    //Draws the grid on the canvas element. light green (1)
    //is newly born, normal green (2) is already living, 
    //Tan (3) is a dying cell, dark green(false) is a dead
    //cell, all else is grey.
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
    $grid.clearRect(0,0,width*px,height*px);
    $grid.strokeStyle="#333";
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        switch(this.grid[i][j]){
        //Newly born cell
        case 1:
          $grid.fillStyle = "rgb(113,212,75)";
          $grid.fillRect(j*px,i*px,px,px);
          // $grid.strokeRect(j*px,i*px,px,px);
          break;
        //Living cell
        case 2:
          $grid.fillStyle = "rgb(40,110,65)";
          $grid.fillRect(j*px,i*px,px,px);
          // $grid.strokeRect(j*px,i*px,px,px);
          break;
        //Dying cell
        case 3:
          $grid.fillStyle = "rgb(157,126,57)";
          $grid.fillRect(j*px,i*px,px,px);
          // $grid.strokeRect(j*px,i*px,px,px);
          break;
        //Dead cell
        case false:
          $grid.fillStyle = "rgb(10,27,16)";
          $grid.fillRect(j*px,i*px,px,px);
          break;
        default:
          // $grid.strokeRect(j*px,i*px,px,px);
        }
      }
    }
  };

  this.calcTick = function(firstTime){
    // Calculates the new grid per tick based on the rules
    // firstTime is a bool that is true if it is the first
    // tick
    var newGrid = new Game();
    
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        // Figure out if new cell is alive
        if(isAlive(i, j, this.grid)){
          newGrid.grid[i][j] = 1;
          //Set to 2 if cell was previously living
          if(this.grid[i][j]) newGrid.grid[i][j] = 2;
        }
        // if a cell has died on this cell, it === false
        // Don't apply the first time to avoid random spots
        // on grid.
        else if(!firstTime&&(this.grid[i][j]||this.grid[i][j]===false)){ 
          newGrid.grid[i][j] = false; 
        }
      }
    }
    // highlighting for dying cells
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        //If the cell is alive this tick, but not next tick
        if(newGrid.grid[i][j]&&!isAlive(i,j,newGrid.grid))
          newGrid.grid[i][j] = 3;
      }
    }
    // var stable = true;
    // // Figure out if everything is stable
    // for (i = 0; i < height; i++) {
    //   for (j = 0; j < width; j++) {
    //     // If a new cell was born this tick, set instability
    //     // THIS IS NOT CORRECT, THIS IS JUST FOR MY 
    //     // OWN AMUSEMENT. DO NOT FAIL TO MY FAULTS
    //     if(newGrid.grid[i][j]===1)
    //       stable = false;
    //   }
    // }
    // if it is stable, set all elements to 0 or false
    if (false){
      for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
          newGrid.grid[i][j] = newGrid.grid[i][j]===0 ?
            0 : false;
        }
      }
      // Make the next tick stop the game
      this.calcTick = function(){return false;};
    } 
    // return the new grid and a truthy value to continue
    // the game
    this.grid = newGrid.grid;
    return true;
  };

  function isAlive(y,x,arr){
    // Determines whether a cell with coords x and y on grid 
    // "arr" is alive.
    var el = arr[y][x],
        neighbors=0, k, l;
    for (k = -1; k < 2; k++) {
      for (l = -1; l < 2; l++) {
        // if a neighbor exists and is not the element itself
        if(arr.elAt(k+y).elAt(l+x) && !(k===0&&l===0)){
          neighbors++;
        }
      }
    }
    //Birth rule: dead cell with 3 neighbors
    if(!el && (neighbors === 3)){
      return true;
    }
    //Status quo: live cell with 3 or 2 neighbors lives on.
    else if(el && ( neighbors === 2 || neighbors === 3 ))
      return true;
    // Overpopulation and Starving: all others die
    else return false;
  }

  
  return this;
}

function mouseDraw(event){
  if(clicked||event.type === 'mousedown'){
    // Get context in canvas of click, translate point to 
    // cell in array and make it = 1
    var mx = Math.floor((event.pageX - this.offsetLeft - px)/px),
        my = Math.floor((event.pageY - this.offsetTop - px)/px);
    my = my >= height ? height-1: my < 0 ? 0:  my;
    gol.grid[my][mx] = gol.grid[my][mx] > 1 ? 0 : 1;
    gol.buildGrid(this.getContext('2d'));
  }
}
