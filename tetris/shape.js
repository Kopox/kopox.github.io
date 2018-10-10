class Shape {
    // Builds a shape
    constructor(x, y) {
        this.x = x; // x position
        this.y = y; // y position
        this.color = [floor(random(150, 255)), floor(random(150, 255)), floor(random(150, 255)), 255]; // color
        
        this.tetromino = []; // Array storing the state of the tetromino: letter and rotation
        this.tetromino[0] = random(tetrominoList); // Select a random tetromino, the letter of the tetromino is stored here (e.g. "L")
        this.tetromino[1] = 0; // Determines the state of rotation of the tetromino
        
        // Creation of a 4*4 two-dimensional array storing the shape of the tetromino (see this.update)
        // Value 1 for occupied positions and 0 of empty positions
        this.shape = [];
        for (var i = 0; i < 4; i++) {
            this.shape[i] = []
        }
        
        // Initialize the shape of the tetromino
        this.update();
    }
    
    // Displays the shape
    // Goes through the 4*4 "shape" array and draws a circle where shape[i][j] == 1 (position occupied)
    display() {
        fill(this.color[0], this.color[1], this.color[2], this.color[3]); // The circles are drawn with this object's color
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] == 1) {
                    ellipse(gridX + (this.x + j)*reso, gridY + (this.y + i)*reso, reso - gap, reso - gap);
                }
            }
        }
    }
    
    // Returns a boolean indicating if there is a collision (true) or not (false)
    collision() {
        var collision = false; // Initialize as if there are no collisions
        
        // Look at all positions where the tetromino should be
        // Check if this position is available or not
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                if (this.shape[j][i] > 0) {
                    if (this.x + i < 0 || this.x + i >= gridCol) {
                        collision = true; // Collision if the position is already taken
                    } else if (grid[this.x + i][this.y + j] != gridColor && this.y + j >= 0) {
                        collision = true; // Collision of the position is out of the grid
                    }  
                }
            }
        }

        return collision;
    }
    
    // Collision left: move left, check for collision, and move back right if there was a collision
    collisionLeft() {
        this.x -= 1;
        
        if (this.collision()) {
            this.x += 1;
            leftPressed = false; // To avoid bug keeping left/right pressed
        }
    }
    
    // Collision right: move right, check for collision, and move back left if there was a collision
    collisionRight() {
        this.x += 1
        
        if (this.collision()) {
            this.x -= 1;
            rightPressed = false; // To avoid bug keeping left/right pressed
        }
    }
    
    // Collision down: move down, check for collision, always move back up, and return the boolean of collision
    collisionDown() {
        this.y += 1;
        
        // Boolean for collision
        var collisionDown = this.collision();
        
        this.y -= 1; // Always move back up. The tetromino only goes down by calling "updateAll"
        return collisionDown; // True if there was a collision
    }
    
    // When it lands, add the tetromino to the grid by copying its color at each of its positions
    endShape() {
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                if (this.shape[j][i] > 0) { // If the position is occupied (shape of the tetromino)
                    grid[this.x + i][this.y + j] = this.color; // Copy its color to the grid
                }
            }
        }
    }
    
    // Initialize the shape or make it rotate clockwise
    update() {
        // Store the value of rotation before update in case of collision
        // After rotation, collision will be checked. If there is collision, the tetromino goes back to its previous state
        var prevTetromino1 = this.tetromino[1];
        var prevShape = this.shape;
        
        // Appply rotation
        // Tetrominos have up to 4 different shapes when rotating clockwise, equivalent to incrementing this.tetromino[1]
        // Rotating 1, 2, or 4 times goes back to the initial shape, depending on symmetry
        switch(this.tetromino[0]) { // Shape of the tetromino ["I", "O", "T", "S", "Z", "J", "L"];
            case "I":
                switch(this.tetromino[1]) {
                    case 0: // Case 0 means the tetromino was just created, it is initialized to its basic shape
                    case 2:
                        this.tetromino[1] = 1;
                        this.shape = [ // This two-dimensional array shows the shape of the tetromino: where the "1" are
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] = 2;
                        this.shape = [
                            [0, 0, 0, 0],
                            [1, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "O": // "O" is always the same, this is just for initialization
                switch(this.tetromino[1]) {
                    case 0:
                    case 1:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 1, 1, 0],
                            [0, 1, 1, 0],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "T":
                switch(this.tetromino[1]) {
                    case 0:
                    case 4:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 0, 1, 1],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 2:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 1, 1, 1],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 3:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 1, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "S":
                switch(this.tetromino[1]) {
                    case 0:
                    case 2:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 0, 1, 1],
                            [0, 1, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] = 2;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 0, 1, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "Z":
                switch(this.tetromino[1]) {
                    case 0:
                    case 2:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 1, 1, 0],
                            [0, 0, 1, 1],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] = 2;
                        this.shape = [
                            [0, 0, 0, 1],
                            [0, 0, 1, 1],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "J":
                switch(this.tetromino[1]) {
                    case 0:
                    case 4:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 1, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 1, 0, 0],
                            [0, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 2:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 1, 1],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 3:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 1, 1, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 0],
                        ]
                }
                break;
            case "L":
                switch(this.tetromino[1]) {
                    case 0:
                    case 4:
                        this.tetromino[1] = 1;
                        this.shape = [
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 1],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 1:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 0, 0],
                            [0, 1, 1, 1],
                            [0, 1, 0, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 2:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 1, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 0, 0],
                        ]
                        break;
                    case 3:
                        this.tetromino[1] += 1;
                        this.shape = [
                            [0, 0, 0, 1],
                            [0, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                        ]
                }
        }
        
        // After rotation, collision will be checked. If there is collision, the tetromino goes back to its previous state
        if (this.collision() && prevTetromino1 != 0) {
            this.tetromino[1] = prevTetromino1;
            this.shape = prevShape;
        }
    }
}
