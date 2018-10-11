/*
    BUBBLES
    Bubbles the pictures of some people randomly move on the screen, eating each other and popping on the edges of the world.
    This is my second coding project, intially made after following the playlist "Foundations of Programming in Javascript" from Daniel Shiffman.
    This version was made from scratch several months later, intergrating notions I did not know initially.
    I also added a quad tree to minimize the cost of collision detection, based on Daniel Shiffman's coding challenge #98.
    Link to the playlist: https://youtu.be/yPWkPOfnGsw
*/

let bubbles = []; // Array strogin the bubble objects
let maxBubbles = 100; // Bubbles stop spawning automatically if the maximum is reached, vary depending on the window size
let pics = []; // Array storing the pictures
let lastPic = 11; // Hard-coded index of the last picture to load
let picsLoaded = 0; // Amount of pictures loaded
let quadTree; // Quad tree
let mouseRange; // Range aroung the mouse for debugging

// SETUP FUNCTION ------------------------------------------------------------
// Executed 1 time at the beginning
function setup() {
    createCanvas(windowWidth, windowHeight);
    scaleMaximums(); // Adapt the max amount of bubbles to the size of the window

    // Load the pictures. The animation begins before finishing loading, displaying only colored circles.
    for (let i = 0; i <= lastPic; i++) {
        pics[i] = loadImage("pictures/picture" + i + ".png", () => {
            picsLoaded++;
            // When all pictures are loaded, assign random pictures to the bubbles already created
            if (picsLoaded >= lastPic + 1) {
                bubbles.forEach(b => b.pic = random(pics));
            }
        });
    }
}

// DRAW FUNCTION ------------------------------------------------------------
// Executed continuously ~60 times per second
function draw() {
    background(0); // Black background
    
    bubbles.forEach(b => {
        b.update(); // Update the position of the bubbles (random walk)
        b.edge(); // Mark the the bubbles "dead" if they go out of the window
    });
    
    // Check intersections using the quad tree, eaten bubbles are marked "dead"
    checkIntersections();
    
    // Delete dead bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        if (bubbles[i].dead) bubbles.splice(i, 1);
    }
    
    // Displays the bubbles on the screen
    bubbles.forEach(b => b.show());
    
    // Add a new bubble if the amount is inferior to the maximum
    if (bubbles.length < maxBubbles) addBubble();
}

// OTHER FUNCTIONS ------------------------------------------------------------
// Check intersections using the quad tree
function checkIntersections() {
    // Creates a quad tree
    let boundary = new Rectangle(width/2, height/2, width/2, height/2);
    quadTree = new QuadTree(boundary, 4);
    
    // Add the points corresponding to each bubble to the quad tree
    for (b of bubbles) quadTree.insert(b.pos);
    
    // Order the bubbles, the largest bubble first
    bubbles.sort((a, b) => b.area - a.area);
    
    // Begining with the largest bubbles, ask the quad tree for all points
    // distant from the centre of the bubble b by, at maximum, the diameter of the bubble b
    // No new bubble can intersect b while being outside this range, except larger bubbles
    // that thus have already checked the collision (lower index in the array)
    for (let i = 0; i < bubbles.length; i ++) {
        let b = bubbles[i];
        if (b.eaten) break; // No need to check eaten bubbles
        
        let range = new Rectangle(b.pos.x, b.pos.y, b.d, b.d); // Maximum area where another bubble can be and intersect b
        let points = quadTree.query(range); // Ask the quad tree for all points in this range
        
        // Check the intersection between the bubble b and all points given by the quad tree
        for (j = 0; j < points.length; j++) {
            let other = points[j].bubble;
            if (b != other && b.intersects(other)) {
                // Upon intersection, the largest bubble eats the smallest bubble
                b.r > other.r ? b.eat(other) : other.eat(b);
            }
        }
    }
}

// Add a bubble if the location generated is free
function addBubble() {
    let x = random(width); // Select a random location
    let y = random(height);
    let pic = randomPic(); // Select a random picture if all pictures are loaded
    
    b = new Bubble(x, y, pic); // Creation of the new bubble
    
    
    // Checks if the new bubbles already intersects with another bubble
    let free = true; // Assume that the new bubble does not intersect another bubble
    for (i = 0; i < bubbles.length; i++) {
        if (b.intersects(bubbles[i])) free = false;
    }
    
    // Add the new bubble to the array if it doesn't intersect nor touches an edge
    if (free && !b.edge()) bubbles.push(b);
}

// Add more bubbles by dragging the mouse
function mouseDragged() {
    // Select a random picture if all pictures are loaded
    let pic = randomPic();
    bubbles.push(new Bubble(mouseX, mouseY, pic));
}

// Select a random picture if all pictures are loaded
function randomPic() {
    if (picsLoaded >= lastPic + 1) {
        return random(pics);
    } else { // "undefined" if the pictures are not all loaded
        return undefined; // The bubble will only display a colored circle
    }
}

// Resize the canvas and update the max bubbles upon window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    scaleMaximums();
}

// Determines the target amount of bubbles
function scaleMaximums() {
    maxBubbles = width * height / 2000 + 2;
}