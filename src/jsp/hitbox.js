export class Hitbox{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.sx = 0;
        this.sy = 0;
        this.width = w;
        this.height = h;
    }

    _move(x, y){
        this.sx = x;
        this.sy = y;
    }

    checkPoint(x, y){
        return x >= this.x + this.sx && 
            y >= this.y + this.sy && 
            x < this.x + this.width + this.sx && 
            y < this.y + this.height + this.sy;
    }

    _collideHitbox(other){
        return (this.x + this.sx < other.x + other.width + other.sx &&
            this.x + this.width + this.sx > other.x + other.sx &&
            this.y + this.sy < other.y + other.height + other.sy &&
            this.y + this.height + this.sy > other.y + other.sy);
    }

    _collideMask(other){
        //to be done
    }

    _collideGrid(other){
        //to be done
    }

    checkCollide(other){
        if (other instanceof Hitbox){
            return this._collideHitbox(other);
        }
    }
}