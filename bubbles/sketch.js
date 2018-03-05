var bubbles = []; // Array of all the bubbles elements

var bSpeed = 2; // Determines how far bubbles move each frame

var accMode = false;
var bAcc = 2; // Determines the acceleration

var isBubbleClicked = false; // Store if a bubble was clicked

var minSize = 5;
var maxSize = 25;

var pictureMode = false;
var pictureWidth = 1; // 1.77 for pictures from phone

var autoSpawn = true;

let pictures = [];

function preload() {
    if (pictureMode) {
        for (let i = 0; i < 8; i++) {
            pictures[i] = loadImage(`pictures/picture${i}.png`);
        }
    }
}

function setup() {
    // Initialize the screen
    createCanvas(windowWidth, windowHeight, 0, 0);
    background(0);
    
    // Create a population of bubbles
/*    for (var i = 0; i < (width * height / 140000 + 2); i++) {
        bubbles[i] = new Bubble(random(width), random(height), random(minSize, maxSize));
    }*/
}

function draw() {
    background(0, 0, 0, 20);
    if (random() < 1) {
        //drawThings();
    }
    
    // Let all the bubbles move and appear on screen
    for (var b of bubbles) {
        b.move();
        b.display();
    }
    
    // Checks collision with between bubbles and delete oldest
    for (var i = bubbles.length-1; i >= 0; i--) {
        if (bubbles[i].pop) {
            bubbles.splice(i, 1);
            break;
        }
        for (var j = i-1; j >= 0; j--) {
            if (bubbles[i].intersects(bubbles[j])) {
                if (bubbles[i].d > bubbles[j].d) {
                    bubbles[i].d = sqrt((bubbles[i].d*bubbles[i].d) + (bubbles[j].d*bubbles[j].d));
                    bubbles.splice(j, 1);
                } else {
                    bubbles[j].d = sqrt((bubbles[i].d*bubbles[i].d) + (bubbles[j].d*bubbles[j].d));
                    bubbles.splice(i, 1);  
                }
                break;
            }
        }
    }
    
    // Add bubbles if there is space for it
    if (autoSpawn && bubbles.length < (width * height / 3000 + 2)) {
        print("width: " + width + ", height: " + height + ", area: " + (width*height) + ", bubbles: " + (width * height / 3000 + 2));
        var newBubble = new Bubble(random(width), random(height), random(minSize, maxSize));
        var doesNewBubbleTouch = false;
        for(var b of bubbles) {
            if(newBubble.intersects(b)) {
                doesNewBubbleTouch = true;
            }
        }
        if (!doesNewBubbleTouch) {
            bubbles[bubbles.length] = newBubble;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

function mousePressed() {
    drawThings();
}

function mouseDragged() {
    drawThings();
}

function keyPressed() {
    if (key === "A") {
        accMode = !accMode;     
    }
    if (key === "P") {
        pictureMode = !pictureMode;
    }
    if (key === "S") {
        autoSpawn = !autoSpawn;
    }
    if (keyCode === 32) {
        background(0);
        bubbles.splice(0, bubbles.length);
    }
}

function drawThings() {
    isBubbleClicked = false;
    
    // Check clicked function of every bubble
    for (var i = bubbles.length-1; i >= 0 ; i--) {
        if (bubbles[i].clicked(mouseX, mouseY)) {
            isBubbleClicked = true; // Remember that at least 1 bubble was under the click
            if (random() < 0.1) {
                bubbles.splice(i, 1); // Random chance to pop the bubble
            } else {
                bubbles[i].changeColor(); // If clicked and not popped, change the color of the bubble
            }
        }
    }
    
    // If no bubble was under the click, create a new bubble at this position
    if (!isBubbleClicked) {
        bubbles[bubbles.length] = new Bubble(mouseX, mouseY, random(minSize, maxSize));
    }
}
