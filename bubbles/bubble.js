class Bubble {
    // Build a bubble
    constructor(x, y, d) {
        this.x = x; // x position
        this.y = y; // y position
        this.xv = 0;
        this.yv = 0;
        this.xa = 0;
        this.ya = 0;
        this.d = d; // diameter
        this.col = color(random(0, 255), random(0, 200), random(0, 255), 100); // color
        this.pic = random(pictures);
        this.pop = false;
    }

    // Draws the bubble on the screen
    display() {
        if (pictureMode) {
            image(this.pic, this.x-this.d/2*pictureWidth, this.y-this.d/2, this.d*pictureWidth, this.d);  
        }
        stroke(255, 255, 255, 255);
        strokeWeight(0.6)
        fill(this.col);
        ellipse(this.x, this.y, this.d, this.d);           
    }
    
    // Update the position of the bubble
    move() {
        if (accMode) {
            this.xa = random(-bAcc, bAcc);
            this.ya = random(-bAcc, bAcc);
            this.xv += this.xa;
            this.yv += this.ya;
            this.x += this.xv/this.d;
            this.y += this.yv/this.d;
        } else {
            this.xv = random(-bSpeed, +bSpeed);
            this.yv = random(-bSpeed, +bSpeed);
            this.x += this.xv;
            this.y += this.yv;
        }
        if (this.x-this.d/2 <= 0 || this.y-this.d/2 <= 0 ||
           this.x+this.d/2 >= width || this.y+this.d/2 >= height) {
            this.pop = true;
        }
    }
    
    // Checks if the bubble is clicked
    clicked(cx, cy) {
        var z = dist(cx, cy, this.x, this.y);
        return (z < (this.d/2+2));
    }
    
    // Changes the color of the bubble
    changeColor() {
        if (pictureMode) {
            //this.pic = random(pictures); // Activates to allow changing pictures
            this.col = color(random(0, 255), random(0, 200), random(0, 255), 100);
        } else {
            this.col = color(random(0, 255), random(0, 200), random(0, 255), 100);
        }
    }
    
    // Returns true if this bubble intesects the argument bubble
    intersects(other) {
        return dist(this.x, this.y, other.x, other.y) < (this.d + other.d)/2;
    }
}
