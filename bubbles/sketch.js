let bubbles = []; // Array strogin the bubble objects
let maxBubbles = 100; // Bubbles stop spawning automatically if the maximum is reached
let pics = []; // Array storing the pictures
let lastPic = 11;
let picsLoaded = 0;
let emptyArr = [];

// PRELOAD FUNCTION ------------------------------------------------------------
function preload() {

}

// SETUP FUNCTION ------------------------------------------------------------
function setup() {
    createCanvas(windowWidth, windowHeight);
    calcMaxBubbles();
    
    // Load the pictures
    for (let i = 0; i <= lastPic; i++) {
        pics[i] = loadImage("pictures/picture" + i + ".png", () => picsLoaded++);
    }
}

// DRAW FUNCTION ------------------------------------------------------------
function draw() {
    background(0);
    
    // Update the position of the bubbles
    bubbles.forEach(b => b.update());
    bubbles.forEach(b => b.show());
    
    // Check if the bubbles go out of the window or intersect
    bubbles.forEach(b => b.edge());
    for (let i = 0; i < bubbles.length; i++) {
        if (!bubbles[i].eaten) {
            for (let j = i + 1; j < bubbles.length; j++) {
                if (bubbles[i].intersect(bubbles[j])) {
                    bubbles[i].r > bubbles[j].r ? bubbles[i].eat(bubbles[j]) : bubbles[j].eat(bubbles[i]);
                }
            }
        }
    }

    // Delete eaten bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        if (bubbles[i].eaten) bubbles.splice(i, 1);
    }
    
    // Add a new bubble if the amount is inferior to the maximum
    if (bubbles.length < maxBubbles) addBubble();
}

// OTHER FUNCTIONS ------------------------------------------------------------
// Add a bubble if the location generated is free
function addBubble() {
    let x = random(width);
    let y = random(height);
    let b = new Bubble(x, y, random(pics));
    let free = true; // b does not intersect another bubble

    for (i = 0; i < bubbles.length; i++) {
        if (b.intersect(bubbles[i])) free = false;
    }

    if (free && !b.edge()) bubbles.push(b);
}

// Add more bubbles by dragging the mouse
function mouseDragged() {
    bubbles.push(new Bubble(mouseX, mouseY, random(pics)));
}

// Resize the canvas and update the max bubbles upon window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calcMaxBubbles();
}

// Determines the target amount of bubbles
function calcMaxBubbles() {
    maxBubbles = width * height / 2000 + 2
}