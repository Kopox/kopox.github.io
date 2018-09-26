class Bubble {
    constructor(x, y, pic) {
        this.maxTrail = 1; // No trail at the moment
        this.trail = new Array(this.maxTrail);
        this.trail.fill(createVector(x, y));
        
        this.pic = pic;
        
        this.rgb = [floor(random(100, 255)), floor(random(100, 255)), floor(random(100, 255))]
        this.alpha = [];
        this.alpha[0] = 110;
        for (let i = 1; i < this.trail.length; i++) {
            this.alpha[i] = map(i, 1, this.trail.length, 25, 10);
        }
        
        this.eaten = false;
        this.r = floor(random(2, 10));
        this.d = this.r * 2;
        this.area = PI * this.r * this.r;
    }
    
    update() {
        for (let i = this.trail.length - 1; i >= 1; i--) {
            this.trail[i] = this.trail[i+-1].copy();
        }
        
        this.trail[0].add(p5.Vector.random2D()); //.mult() in case we need larger steps
    }
    
    show() {
        strokeWeight(1);
        for (let i = this.trail.length - 1; i >= 1; i--) {
            stroke(255, this.alpha[i]);
            fill(this.rgb[0], this.rgb[1], this.rgb[2], this.alpha[i]);
            ellipse(this.trail[i].x, this.trail[i].y, this.d, this.d)
        }
        
        if (this.pic) {
            imageMode(CENTER);
            image(this.pic, this.trail[0].x, this.trail[0].y, this.d - 2, this.d - 2)
        }
        
        stroke(255, this.alpha[0]);
        fill(this.rgb[0], this.rgb[1], this.rgb[2], this.alpha[0])
        ellipse(this.trail[0].x, this.trail[0].y, this.d, this.d)
    }
    
    edge() {
        if (this.trail[0].x - this.r < 0 || this.trail[0].x + this.r > width ||
            this.trail[0].y - this.r < 0 || this.trail[0].y + this.r > height) {
                this.eaten = true;
                return true;
        }
    }
    
    intersect(other) {
        let rTot = this.r + other.r;
        let dx = abs(this.trail[0].x - other.trail[0].x);
        if (dx > rTot) return false;
        let dy = abs(this.trail[0].y - other.trail[0].y);
        if (dy > rTot) return false;
        
        let dSqr = dx * dx + dy * dy;
        if (dSqr < rTot * rTot) return true;
        return false;
    }
    
    eat(other) {
        this.area += other.area;
        this.r = sqrt(this.area / PI);
        this.d = 2 * this.r;
        other.eaten = true;
    }
}