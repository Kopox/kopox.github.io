/*
    BUBBLES
    Bubbles the pictures of some people randomly move on the screen, eating each other and popping on the edges of the world.
    This is my second coding project, intially made after following the playlist "Foundations of Programming in Javascript" from Daniel Shiffman.
    This version was made from scratch several months later, intergrating notions I did not know initially.
    Link to the playlist: https://youtu.be/yPWkPOfnGsw
*/
let bubbles = []; // Array strogin the bubble objects
let maxBubbles = 100; // Bubbles stop spawning automatically if the maximum is reached, vary depending on the window size
let pics = []; // Array storing the pictures
let lastPic = 11; // Hard-coded index of the last picture to load
let picsLoaded = 0; // Amount of pictures loaded

// SETUP FUNCTION ------------------------------------------------------------
// Executed 1 time at the beginning
function setup() {
    createCanvas(windowWidth, windowHeight);
    scaleMaximums(); // Adapt the max amount of bubbles to the size of the window
    
    // Load the pictures
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
    
    bubbles.forEach(b => b.update()); // Update the position of the bubbles (random walk)
    bubbles.forEach(b => b.edge()); // Kill the the bubbles if they go out of the window
    
    // Check intersection between every couple of bubbles
    for (let i = 0; i < bubbles.length; i++) {
        if (!bubbles[i].dead) { // Do not check bubbles that are dead (killed by the edge)
            for (let j = i + 1; j < bubbles.length; j++) {
                if (bubbles[i].intersect(bubbles[j])) {
                    // Upon intersection, the largest bubble eats the smallest bubble
                    bubbles[i].r > bubbles[j].r ? bubbles[i].eat(bubbles[j]) : bubbles[j].eat(bubbles[i]);
                }
            }
        }
    }

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
// Add a bubble if the location generated is free
function addBubble() {
    let x = random(width); // Select a random location
    let y = random(height);
    let pic = randomPic(); // Select a random picture if all pictures are loaded
    
    b = new Bubble(x, y, pic); // Creation of the new bubble
    
    
    // Checks if the new bubbles already intersects with another bubble
    let free = true; // Assume that the new bubble does not intersect another bubble
    for (i = 0; i < bubbles.length; i++) {
        if (b.intersect(bubbles[i])) free = false;
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