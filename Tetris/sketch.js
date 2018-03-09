/* To do
    shit + down = direct to the bottom
*/

var tetrominoList = ["I", "O", "T", "S", "Z", "J", "L"];
var shapes = [];
var pause = false;
var end = false;

var grid = [];
var gridColor = [50, 50, 50, 255];
var gridCol = 10;
var gridRow = 20;
var gridX = 100;
var gridY = 100;
var reso = 30;
var gap = 2;

var leftDownTime = 0;
var rightDownTime = 0;
var downDownTime = 0;
var minDownTime = 10;
var hardDrop = false;

var updateAllSpeed = 25;
var time = 0;
var updateTime = 0;
var linesCompleted = 0;
var score = 0;
var bestScore = 0;
var level = 1;
var linesPerLevel = 10;

// Ininitalization and declaration of the setInterval functions
function setup() {
    // Print information
    print("v0.7");
    print("Hi! You can use the ARROWS, SPACEBAR to pause, and ENTER at the end to start a new game.");
    
    // Create canvas and background
    createCanvas(windowWidth, windowHeight, 0, 0);
    background(0);
    
    // Create the grid and the first shapes, initizalize the positions
    reso = min(floor(windowWidth/gridCol*0.4), floor(windowHeight/gridRow*0.9));
    gap = reso/15;
    
    gridX = floor(windowWidth/2 - gridCol*reso/2);
    gridY = floor(windowHeight/2 - gridRow*reso/2) + reso/2;
    newGrid();
    
    shapes[0] = new Shape(3, -2);
    shapes[1] = new Shape(12, 6);
    
    textFont("Helvetica");
    textSize(reso);
    scoreX = gridX + 11.68*reso;
    scoreY = gridY + reso;
    
    // SetInterval
    setInterval(checkUpdateAll, updateAllSpeed);
    setInterval(checkKeyDown, 25);
}

function draw() {
    drawBackground();
    shapes[0].display();
    shapes[1].display();
    
    if (pause) {
        fill(255);
        text("PAUSE", gridX - reso/2, gridY - 1.5*reso);
    }
}

function drawBackground() {
    background(0);
    
    // Write the score
    fill(255);
    text(score, scoreX, scoreY);
    text(linesCompleted, scoreX, scoreY + 1.5*reso);
    text(level, scoreX, scoreY + 3*reso);
    
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            fill(color(grid[i][j][0], grid[i][j][1], grid[i][j][2], grid[i][j][3]));
            ellipse(gridX + reso*i, gridY + reso*j, reso - gap, reso - gap);
        }
    }
}

function checkUpdateAll() {
    time += updateAllSpeed / 1000;
    updateTime += 1;
    var updateTimeRequired = 1000/updateAllSpeed / pow(1.2, level - 1);
    
    if (updateTime >= updateTimeRequired) {
        updateAll();
        updateTime = 0;
    }
}

function updateAll() { 
    if (!pause && !end) {
        // If there is a collision down, write the shape in grid[] and make a new shape
        if (shapes[0].collisionDown()) {
            shapes[0].endShape(); // Add the shape to the grid
            checkLines(); // Check if the newly added shape closes a line
            nextShapes(); // Update current & next shapes
            checkEnd(); // End the game if the new shape already has a collision
        } else {
            // The shape goes down by 1 px
            shapes[0].y += 1;
        }
    }
}

// Perform actions when keys are pressed
function keyPressed() {
    if (keyCode === 32) { // Space bar
        pause = !pause;
    }
    if (keyCode === 13) { // Enter
        newGame();
        end = !end;
    } 
    if (keyCode === LEFT_ARROW) {
        leftDownTime = 0;
        shapes[0].collisionLeft();
    } 
    if (keyCode === RIGHT_ARROW) {
        rightDownTime = 0;
        shapes[0].collisionRight();
    }
    if (keyCode === UP_ARROW) {
        shapes[0].update();
    }
    if (keyCode === DOWN_ARROW) {
        if (keyIsDown(16)) { // Shite + DOWN = hard drop
            hardDrop = true;
            while(hardDrop && !end && !pause) {
                updateAll();
            }
        } else {
            downDownTime = 0;
            updateAll();
        }
    }
}

function checkKeyDown() {
    if (keyIsDown(LEFT_ARROW)) {
        leftDownTime += 1;
        if (leftDownTime >= minDownTime) {
            shapes[0].collisionLeft();
        }
    } 
    if (keyIsDown(RIGHT_ARROW)) {
        rightDownTime += 1;
        if (rightDownTime >= minDownTime) {
            shapes[0].collisionRight();
        }
    }
    if (keyIsDown(DOWN_ARROW)) {
        downDownTime += 1;
        if (downDownTime >= minDownTime) {
            updateAll();
        }
    }
}

// Resize the canvas if the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    reso = min(floor(windowWidth/gridCol*0.4), floor(windowHeight/gridRow*0.9));
    gap = reso/15;
    gridX = floor(windowWidth/2 - gridCol*reso/2);
    gridY = floor(windowHeight/2 - gridRow*reso/2) + reso/2;
    textSize(reso);
    scoreX = gridX + 11.68*reso;
    scoreY = gridY + reso;
}

// Create an empty grid
function newGrid() {
    for (var i = 0; i < gridCol; i++) {
        grid[i] = [];
        for (var j = 0; j < gridRow; j++) {
            grid[i][j] = gridColor;
        }
    }
}

// Check if the newly added shape closes a line
function checkLines() {
    // Variables for the relative y position of the shape and the lines closed
    var linesClosed = [];
    
    // For each of 4 lines potentially closed, check if the points are equal to background
    for (var i = shapes[0].y; i < shapes[0].y + 4 && i < 20; i++) {
        // Initialize
        var lineClosed = true;
        
        // Lines above line 0 do not count
        if (i < 0) {
            lineClosed = false;
            break
        }
        
        // Check if there is an empty space in the line
        for (var j = 0; j < gridCol; j++) {
            if (grid[j][i] == gridColor) {
                lineClosed = false;
                break;
            }
        }
        
        // If the line is closed, add it to the list of lines closed
        if (lineClosed) {
            linesClosed.push(i);
        }
    }

    // Add lines completed and eventually update the level
    linesCompleted += linesClosed.length;
    if (linesCompleted > linesPerLevel * level) {
        level += 1;
    }
    
    // Add score depending on lines closed
    switch (linesClosed.length) {
        case 1:
            score += 40 * level;
            break;
        case 2:
            score += 100 * level;
            break;
        case 3:
            score += 300 * level;
            break;
        case 4:
            score += 1200 * level;
    }
    
    // Remove the lines that were closed
    for (var i = linesClosed.length - 1; i >= 0; i--) {
        // Translate the lines higher that the line closed
        for (var j = linesClosed[i] + (linesClosed.length - 1 - i); j >= 1; j--) { // Lines from lineClosed[i]
            for (var k = 0; k < gridCol; k++) {
                grid[k][j] = grid[k][j-1];
            }
        }
        // Add a new empty line at the top
        for (var k = 0; k < gridCol; k++) {
            grid[k][0] = gridColor;
        }
    }
}

// Update current & next shapes
function nextShapes() {
    shapes.splice(0, 1);
    shapes[0].x = 3;
    shapes[0].y = -2;
    shapes[1] = new Shape(12, 6);
    downDownTime = 0; // Refresh keyDown timer of DOWN_ARROW
    hardDrop = false;
}

// End if the new shape already has a collision
function checkEnd() {
    if (shapes[0].collision()) {
        print("The End! Press ENTER to start a new game");
        end = true;
    }  
}

// Refresh the grid & score, begin a new game
function newGame() {
    newGrid();
    shapes.splice(0, 1);
    shapes[0] = new Shape(3, -2);
    shapes[1] = new Shape(12, 6);

    if (score > bestScore) {
        bestScore = score;
    }
    
    level = 1
    score = 0;
    linesCompleted = 0;
}