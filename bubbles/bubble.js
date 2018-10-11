class Bubble {
    constructor(x, y, pic) {
        this.pos = new Point(x, y, this); // Position vector where the bubble is created, center of the bubble
        this.r = floor(random(2, 10)); // ~Random radius, used to determine the diameter and area
        this.d = this.r * 2; // Diameter
        this.area = PI * this.r * this.r;
        
        this.pic = pic; // Picture to be displayed at the bubble's position
        this.col = color(floor(random(100, 255)), floor(random(100, 255)), floor(random(100, 255)), 100) // ~Random color
        this.dead = false; // The bubble lives. It dies when eaten or touching an edge
    }
    
    // Random walk of the bubble
    update() {
        let move = p5.Vector.random2D(); //.mult() in case we need larger steps
        this.pos.x += move.x;
        this.pos.y += move.y;
    }
    
    // Displays the bubble: the picture + a colored transparent circle
    show() {        
        // Only displays the picture if there is one
        // "this.pic" can be undefined if the pictures are not all loaded
        if (this.pic) {
            imageMode(CENTER); // this.pos is the center of the bubble
            image(this.pic, this.pos.x, this.pos.y, this.d - 2, this.d - 2);
        }
        
        // Displays a transparent colored circle on top of the picture
        strokeWeight(1);
        stroke(255, 100);
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, this.d, this.d);
    }
    
    // Informs that the bubble is dead if it touches an edge of the screen
    edge() {
        if (this.pos.x - this.r < 0 || this.pos.x + this.r > width ||
            this.pos.y - this.r < 0 || this.pos.y + this.r > height) {
            this.dead = true; // "dead" bubbles will be deleted at the end of the "draw" function
        }
    }
    
    // Checks if this bubble intersects another bubble
    intersects(other) {
        let rTot = this.r + other.r; // Sum of the radii
        let dx = this.pos.x - other.pos.x;
        let dy = this.pos.y - other.pos.y;
        let dSqr = dx * dx + dy * dy; // Distance squared between the bubbles to avoid squareroot calculation
        let diff = dSqr - rTot * rTot; // Comparison to the (sum of the radii) squared
        if (diff < 0) return true; // Circles intersect if the distance between their center in inferior to the sum of their radii

        return false; // Executes if diff >= 0
    }
    
    // When two bubbles intersect, the largest (this) eats the smallest (other)
    // The largest grows by the smallest's area, and the smallest dies
    eat(other) {
        this.area += other.area; // The largest absorbs the smallest area
        this.r = sqrt(this.area / PI); // Its radius and diameter must be recalculated
        this.d = 2 * this.r;
        this.d = min(this.d, width); // Its diameter cannot be larger than the window
        this.d = min(this.d, height);
        other.dead = true; // Informs that the smallest is dead
    }
}