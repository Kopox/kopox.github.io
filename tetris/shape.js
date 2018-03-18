class Shape {
    // Builds a shape
    constructor(x, y) {
        this.x = x; // x position
        this.y = y; // y position
        this.color = [floor(random(150, 255)), floor(random(150, 255)), floor(random(150, 255)), 255]; // color
        
        this.tetromino = [];
        this.tetromino[0] = random(tetrominoList);
        this.tetromino[1] = 0;
        
        this.shape = [];
        for (var i = 0; i < 4; i++) {
            this.shape[i] = []
        }
        
        this.update();
    }
    
    // Displays the shape
    display() {
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                fill(this.color[0], this.color[1], this.color[2], this.color[3]);
                if (this.shape[i][j] == 1) {
                    ellipse(gridX + (this.x + j)*reso, gridY + (this.y + i)*reso, reso - gap, reso - gap);
                }
            }
        }
    }
    
    // Collision
    collision() {
        var collision = false;
        
        // Check if at the new position overlays with a position taken in the grid
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                if (this.shape[j][i] > 0) {
                    if (this.x + i < 0 || this.x + i >= gridCol) {
                        collision = true;
                    } else if (grid[this.x + i][this.y + j] != gridColor && this.y + j >= 0) {
                        collision = true;
                    }  
                }
            }
        }

        return collision;
    }
    
    // Collision left
    collisionLeft() {
        this.x -= 1;
        
        if (this.collision()) {
            this.x += 1;
            leftPressed = false; // To avoid bug keeping left/right pressed
        }
    }
    
    // Collision right
    collisionRight() {
        this.x += 1
        
        if (this.collision()) {
            this.x -= 1;
            rightPressed = false; // To avoid bug keeping left/right pressed
        }
    }
    
    // Collision down
    collisionDown() {
        this.y += 1;
        
        // Boolean for collision
        var collisionDown = this.collision();;
        
        this.y -= 1;
        return collisionDown;
    }
    
    // End shape
    endShape() {
        for (var i = 0; i < this.shape.length; i++) {
            for (var j = 0; j < this.shape[i].length; j++) {
                if (this.shape[j][i] > 0) {
                    grid[this.x + i][this.y + j] = this.color;
                }
            }
        }
    }
    
    // Updates the shape upon rotation
    update() {
        // Store the value of rotation before update in case of collision
        var prevTetromino1 = this.tetromino[1];
        var prevShape = this.shape;
        
        // Appply rotation
        switch(this.tetromino[0]) { // ["I", "O", "T", "S", "Z", "J", "L"];
            case "I":
                switch(this.tetromino[1]) {
                    case 0:
                    case 2:
                        this.tetromino[1] = 1;
                        this.shape = [
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
            case "O":
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
        
        if (this.collision() && prevTetromino1 != 0) {
            this.tetromino[1] = prevTetromino1;
            this.shape = prevShape;
        }
    }
}