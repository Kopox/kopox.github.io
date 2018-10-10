
/*
    TETRIS
    This project was made from scratch for Laure, who likes Tetris but don't like
    the visual pollution present when playing Tetris on random websites.
    It was made using p5.js, giving a "setup" function executing at the beginning and "draw" function executing each frame,
    as well as mathematical and drawing tools such as the "min" and "ellipse" functions.
*/
var tetrominoList = ["I", "O", "T", "S", "Z", "J", "L"]; // Tetrominos are Tetris pieces that are falling
var shapes = []; // Array storing the shapes to be displayed on screen
var pause = false; // Game pauses when true
var end = false; // Game freeze when true, until ENTER is pressed

var grid = []; // Two-dimensional array storing the color (as an array [red, green, blue]) of each position of the playing grid
var gridColor = [50, 50, 50, 255]; // Color of a position when there is no tetromino [red, green, blue, alpha]
var gridCol = 10;
var gridRow = 20;
var gridX = 100; // Initial x position of the grid, later adapted to the screen size
var gridY = 100; // Initial y position of the grid, later adapted to the screen size
var reso = 30; // Resolution of the game, i.e. width & height of a position in the grid, later adapted to the screen size
var gap = 2; // Cirles in the gris have a diameter of (reso - gap) to space them

var leftDownTime = 0; // Time since LEFT key is pressed, tetromino speed increases after some time
var rightDownTime = 0; // Time since RIGHT key is pressed, tetromino speed increases after some time
var downDownTime = 0; // Time since DOWN key is pressed, tetromino speed increases after some time
var minDownTime = 10; // Time after which the tetromino speed (left, right, or down) is increased
var hardDrop = false; // When true, a hard drop is performed (tetromino goes to the bottom)
var leftPressed = false; // Left key is pressed, additional boolean used to solve bug
var rightPressed = false; // Right key is pressed, additional boolean used to solve bug
var downPressed = false; // Down key is pressed, additional boolean used to solve bug

var updateAllSpeed = 25; // Minimum amount of ms between two frames of animation (game updated)
var time = 0; // Timer of the game
var updateTime = 0; // Used to count the time since the game was last updated
var linesCompleted = 0; // Total amount of lines completed
var score = 0; // Score based on the level and lines completed
var bestScore = 0; // Best score for this session
var level = 1; // Initial level = 1, increasing level => increasing speed
var linesPerLevel = 10; // Amount of lines to complete before going to the next level

// Ininitalization and declaration of the setInterval functions for the game to run
function setup() {
    // Print information
    print("v1.13");
    print("Hi! You can use the ARROWS, SPACEBAR to pause, and ENTER at the end to start a new game.");
    
    // Create canvas and background
    createCanvas(windowWidth, windowHeight, 0, 0);
    background(0);
    
    // Update the resolution and gap depending on the size of the window
    reso = min(floor(windowWidth/gridCol*0.4), floor(windowHeight/gridRow*0.9));
    gap = reso/15;
    
    // Update x and y positions of the grid depending on the size of the window
    gridX = floor(windowWidth/2 - gridCol*reso/2);
    gridY = floor(windowHeight/2 - gridRow*reso/2) + reso/2;
    
    // Create the grid and the first shapes, initizalize the positions
    newGrid(); // "grid" becomes a two-dimentional array "gridCol" (10) * "gridRow" (20), initilized at color "gridCol"
    shapes[0] = new Shape(3, -2); // Each tetromino is a "Shape" object, described in shape.js
    shapes[1] = new Shape(12, 6);
    
    // Chose the font, update the text size and position depending on the size of the window
    textFont("Helvetica");
    textSize(reso);
    scoreX = gridX + 11.68*reso;
    scoreY = gridY + reso;
    
    // SetInterval of the function checkUpdateAll managing the game
    // Each "updateAllSpeed" (25) ms, checks if the game must be updated depending on the speed of the level
    setInterval(checkUpdateAll, updateAllSpeed);
    
    // Counts the time a key (e.g. RIGHT) is pressed
    setInterval(checkKeyDown, 25);
}

// Display the game on the screen
// In p5.js, the draw function is by default executed 60 times per second
function draw() {
    drawBackground(); // Draws the black background and information text
    shapes[0].display(); // Shows the current tetromino
    shapes[1].display(); // Shows what the next tetromino will be
    
    // Shows "PAUSE" if the game is paused (key: SPACEBAR)
    if (pause) {
        fill(255);
        text("PAUSE", gridX - 6*reso, scoreY);
    }
}

// Draws the black background and information text
function drawBackground() {
    background(0); // Black background
    
    // Write the score, the amount of lines completed, and the current level
    fill(255);
    text(score, scoreX, scoreY);
    text(linesCompleted, scoreX, scoreY + 1.5*reso);
    text(level, scoreX, scoreY + 3*reso);
    
    // For each position in the grid, draws a circle of the grid[i][j] color [red, green, blue, alpha]
    // at a location depending on the position's index
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var positionX = gridX + reso*i; // x position depending on the first dimention of the grid array
            var positionY = gridY + reso*j; // y position depending on the second dimention of the grid array
            var positionD = reso - gap; // Diameter of the circle
            fill(color(grid[i][j][0], grid[i][j][1], grid[i][j][2], grid[i][j][3])); // Takes the rgb values at the position grid[i][j]
            ellipse(positionX, positionY, positionD, positionD); // Draws the ellipse
        }
    }
}

// Check if the game must be updated, performed each "updateAllSpeed" (25 ms) from a setInterval declared in "setup"
function checkUpdateAll() {
    time += updateAllSpeed / 1000; // Increment "time" by the actual time since the last time "checkUpdateAll" was called
    updateTime += 1; // Increment "updateTime", the number of times "checkUpdateAll" was called since last game update (frame of animation)
    
    // Level difficulty increases by reducing the time between two game update (i.e. increasing the speed)
    // "updateTimeRequired" corresponds to the number of times "checkUpdateAll" must be called before actually updating the game
    var updateTimeRequired = 1000 / updateAllSpeed / pow(1.2, level - 1);
    
    // If "checkUpdateAll" was called at least "updateTimeRequired" times, update the game and reset updateTime
    if (updateTime >= updateTimeRequired) {
        updateAll(); // This updates the game. The time between two "updateAll" calls reduces as "updateTimeRequired" reduces
                     // i.e. as "level" increases. It corresponds to an increasing speed when going to a higher level.
        updateTime = 0; // The number of times "checkUpdateAll" was called since last game update = 0, since the game was just updated
    }
}

// This function updates the state of the game, one frame of animation forward
function updateAll() { 
    // Only update if the game is not in PAUSE, and the game has not ended (game lost)
    if (!pause && !end) {
        // If there is a collision down, write the shape in grid[] and make a new shape
        if (shapes[0].collisionDown()) {
            shapes[0].endShape(); // Add the shape to the grid. The color of the grid at each position the tetromino is becomes the color of the tetromino
            downPressed = false; // Next piece will always begin by falling slowly
            checkLines(); // Check if the newly added shape closes a line
            nextShapes(); // What was the next shape (shapes[1]) becomes the current shape (shapes[0]), a new "next shape" is generated
            checkEnd(); // End the game if the new shape already has a collision
        } else {
            // If there is no collision down, the shape goes down by 1 position in the grid
            shapes[0].y += 1;
        }
    }
}

// Perform actions when keys are pressed
function keyPressed() {
    if (keyCode === 32) { // SPACE BAR
        pause = !pause; // Pauses or unpauses the game
        downPressed = false; // To avoid bug of continuous down
    }
    if (keyCode === 13) { // ENTER
        newGame(); // Resets everything to begin a new game
        end = false; // The new game begin, the game in not in "end" mode anymore
    } 
    
    // Initiates tetromino movement if the game is not in pause
    // Intentionally, the tetromino can still move in "end" mode
    if (!pause) {
        if (keyCode === LEFT_ARROW) {
            rightPressed = false; // Informs that RIGHT is not pressed anymore. Added to avoid a bug generate by keeping left/right pressed
            leftPressed = true; // Informs that the LEFT key is pressed
            leftDownTime = 0; // Resets the time LEFT key is pressed
            shapes[0].collisionLeft(); // Checks of moving the tetromino to the left results in a collision
        } 
        if (keyCode === RIGHT_ARROW) {
            leftPressed = false; // Informs that LEFT is not pressed anymore. Added to avoid a bug generate by keeping left/right pressed
            rightPressed = true; // Informs that the RIGHT key is pressed
            rightDownTime = 0; // Resets the time RIGHT key is pressed
            shapes[0].collisionRight(); // Checks of moving the tetromino to the right results in a collision
        }
        if (keyCode === UP_ARROW) {
            shapes[0].update(); // Rotates the tetromino
        }
        if (keyCode === DOWN_ARROW) {
            if (keyIsDown(16)) { // keyCode 16 is SHIFT. SHIFT + DOWN results in a hard drop
                hardDrop = true; // Informs that a hard drop must be performed
                while(hardDrop && !end && !pause) {
                    updateAll(); // Updates the state of the game until the tetromino##############################
                }
            } else {
                downDownTime = 0;
                downPressed = true;
                updateAll();
            }
        }
    }
}

function checkKeyDown() {
    if (!pause) {
        if (keyIsDown(LEFT_ARROW) && leftPressed === true) {
            leftDownTime += 1;
            if (leftDownTime >= minDownTime) {
                shapes[0].collisionLeft();
            }
        } 
        if (keyIsDown(RIGHT_ARROW) && rightPressed === true) {
            rightDownTime += 1;
            if (rightDownTime >= minDownTime) {
                shapes[0].collisionRight();
            }
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(87)) { // 87 is "W"
            downDownTime += 1;
            if (downDownTime >= minDownTime && downPressed) {
                updateAll();
            }
        }
    }
}

function keyReleased() {
    if (keyCode === DOWN_ARROW) {
        downPressed = false;  // To avoid bug of continuous down
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
