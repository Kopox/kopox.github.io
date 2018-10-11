// This file contains the QuadTree class, as well as the Point and Rectangle classes
// that the QuadTree class requires.
// POINT --------------------------------------------------
// A point with x and y locations, that is linked to the position of a bubble
class Point {
    constructor(x, y, bubble) {
        this.x = x;
        this.y = y;
        this.bubble = bubble;
    }
}

// RECTANGLE --------------------------------------------------
// A Rectangle delimiting the area of a quad tree
// or the area used for asking points from a quad tree
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.xMin = x - w;
        this.xMax = x + w;
        this.yMin = y - h;
        this.yMax = y + h;
    }
    
    // Checks if a point is inside the rectangle
    contains(point) {
        return (point.x >= this.xMin && point.x <= this.xMax &&
               point.y >= this.yMin && point.y <= this.yMax);
    }
    
    // Check if two rectangles intersect
    intersects(range) {
        return !(this.xMax < range.xMin || this.xMin > range.xMax ||
                this.yMax < range.yMin || this.yMin > range.yMax);
    }
}

// QUAD TREE --------------------------------------------------
// The quad tree stores points in a tree structure for minimizing the cost of collision detection
class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // Rectangle giving the borders of the quad tree
        this.capacity = capacity; // Maximum amount of points that can be stored in the quad tree
        this.points = []; // Array storing the points in the quad tree
        this.divided = false; // True when the quad tree subdivides
        //this.rgb = [floor(random(100, 255)), floor(random(100, 255)), floor(random(100, 255))]; // Used for debugging
    }
    
    // Insert a point in the quad tree
    insert(point) {
        // Return if the point is not in the area of this layer of quad tree
        if (!this.boundary.contains(point)) {
            return false;
        }
        
        // Add the point at this layer or a deeper layer depending on capacity
        if (this.points.length < this.capacity) {
            // Add the point to this layer if there is still room for it
            this.points.push(point);
            return true;
        } else {
            // Otherwise, subdivide to make room for the new point
            // Subdivision divides the quad tree area into 4 new children quad trees
            if (!this.divided) {
                this.subdivide();
            }
            
            // Add the point to the relevant subdivision
            // NW = North West, NE = North East, SE = South East, SW = South West
            if (this.NW.insert(point)) {
                return true;
            } else if (this.NE.insert(point)) {
                return true;
            } else if (this.SE.insert(point)) {
                return true;
            } else if (this.SW.insert(point)) {
                return true;
            }
        }
    }
    
    // Subdivides the quad tree if it is at full capacity, creating 4 new children quad trees
    subdivide() {
        this.divided = true; // Informs of the subdivision to only subdivide once
        
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;
        
        // Creates the 4 children quad trees with the relevant positions and area
        // North West quad tree
        let NWBoundary = new Rectangle(x - w, y - h, w, h);
        this.NW = new QuadTree(NWBoundary, this.capacity);
        
        // North East quad tree
        let NEBoundary = new Rectangle(x + w, y - h, w, h);
        this.NE = new QuadTree(NEBoundary, this.capacity);
        
        // South East quad tree
        let SEBoundary = new Rectangle(x + w, y + h, w, h);
        this.SE = new QuadTree(SEBoundary, this.capacity);
        
        // South West quad tree
        let SWBoundary = new Rectangle(x - w, y + h, w, h);
        this.SW = new QuadTree(SWBoundary, this.capacity);
    }
    
    // Displays the quad tree on screen, used for debugging
    /*
    show() {
        strokeWeight(2)
        stroke(150, 20);
        //fill(...this.rgb, 50);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        
        //stroke(...this.rgb, 255);
        stroke(255);
        for (let p of this.points) {
            point(p.x, p.y);
        }
        
        if (this.divided) {
            this.NW.show();
            this.NE.show();
            this.SE.show();
            this.SW.show();
        }
    }
    */
    
    // Returns all the points in a given range (Rectangle) and put them in the "found" array
    query(range, found) {
        // The array "found" will check all quad trees intersecting with the range,
        // looking for points intersecting with the range
        if (!found) found = []; // Creates the array at the beginning of the recursion
        
        if (!this.boundary.intersects(range)) {
            return found; // No intersection between the quad tree and the range, no need to check for points
        } else {
            // If the range intersects this quad tree, check for the intersection of its points with the range
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p); // Add the points intersecting with the range to "found"
                }
            }
            
            // This quad tree intersects with the range, now do the same for its children quad trees
            if (this.divided) {
                this.NW.query(range, found);
                this.NE.query(range, found);
                this.SE.query(range, found);
                this.SW.query(range, found);
            }
        }
        
        return found;
    }
}