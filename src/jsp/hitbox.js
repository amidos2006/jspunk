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

    _getHitboxIntersection(other){
        if(this._collideHitbox(other)){
            let x1 = Math.max(this.x + this.sx, other.x + other.sx);
            let y1 = Math.max(this.y + this.sy, other.y + other.sy);
            let x2 = Math.min(this.x + this.sx + this.width, other.x + other.sx + other.width);
            let y2 = Math.min(this.y + this.sy + this.height, other.x + other.sy + other.height);
            return new Hitbox(x1, y1, x2 - x1, y2 - y1);
        }
        return null;
    }

    _collidePoint(x, y){
        return x >= this.x + this.sx && 
            y >= this.y + this.sy && 
            x < this.x + this.width + this.sx && 
            y < this.y + this.height + this.sy;
    }

    _collideHitbox(other){
        return this.x + this.sx < other.x + other.width + other.sx &&
            this.x + this.width + this.sx > other.x + other.sx &&
            this.y + this.sy < other.y + other.height + other.sy &&
            this.y + this.height + this.sy > other.y + other.sy;
    }

    _collideGrid(other){
        return other._collideHitbox(this);
    }

    checkCollide(other){
        if(other  == null){
            return this.collidePoint(other.x, other.y);
        }
        if (other instanceof Hitbox){
            return this._collideHitbox(other);
        }
        if(other instanceof PixelMask){
            return this._collidePixel(other);
        }
        if(other instanceof Grid){
            return this._collideGrid(other);
        }
        return false;
    }
}

export class Grid extends Hitbox{
    constructor(x, y, tw, th, gw, gh){
        super(x, y, gw*tw, gh*th);
        this.twidth = tw;
        this.theight = th;

        this.grid = [];
        for(let y=0; y<gh; y++){
            this.grid.push([]);
            for(let x=0; x<gw; x++){
                this.grid[y].push(false);
            }
        }
    }

    setTile(gx, gy, value){
        if(value == undefined) value = true;
        if(gx < 0 || gy < 0 || gx >= this.gwidth || gy >= this.gheight) return;
        this.grid[gy][gx] = value;
    }

    clearSolid(gx, gy){
        if (gx < 0 || gy < 0 || gx >= this.gwidth || gy >= this.gheight) return;
        this.grid[gy][gx] = false;
    }

    _collidePoint(x, y) {
        if (super._collidePoint(x, y)) {
            let gx = Math.floor((x - this.x - this.sx) / this.twidth);
            let gy = Math.floor((y - this.y - this.sy) / this.theight);
            return this.grid[gy][gx];
        }
        return false;
    }

    _collideHitbox(other) {
        if(super._collideHitbox(other)){
            let collision = this._collidePoint(other.x + other.sx, other.y + other.sy) ||
                this._collidePoint(other.x + other.sx, other.y + other.sy + other.height - 1) ||
                this._collidePoint(other.x + other.sx + other.width - 1, other.y + other.sy) ||
                this._collidePoint(other.x + other.sx + other.width - 1, other.y + other.sy + other.height - 1);
            return collision;
        }
        return false;
    }

    _collideGrid(other) {
        if (super._collideHitbox(other)) {
            let hitbox = this._getHitboxIntersection(other);
            let minTWidth = Math.min(this.twidth, other.twidth);
            let minTHeight = Math.min(this.theight, other.theight);
            hitbox.x = Math.floor(hitbox.x / minTWidth) * minTWidth;
            hitbox.y = Math.floor(hitbox.y / minTHeight) * minTHeight;
            hitbox.width = Math.ceil(hitbox.width / minTWidth) * minTWidth;
            hitbox.height = Math.ceil(hitbox.height / minTHeight) * minTHeight;
            for (let y = hitbox.y; y <= hitbox.y + hitbox.height; y += minTHeight) {
                let curY1 = Math.floor((y - this.y - this.sy)/this.theight);
                let othY1 = Math.floor((y - other.y - other.sy)/other.theight);
                let curY2 = Math.floor((y - this.y - this.sy + minTHeight - 1) / this.theight);
                let othY2 = Math.floor((y - other.y - other.sy + minTHeight - 1) / other.theight);
                for (let x = hitbox.x; x <= hitbox.x + hitbox.width; y += minTWidth) {
                    let curX1 = Math.floor((x - this.x - this.sx) / this.twidth);
                    let othX1 = Math.floor((x - other.x - other.sx) / other.twidth);
                    let curX2 = Math.floor((x - this.x - this.sx + minTHeight - 1) / this.twidth);
                    let othX2 = Math.floor((x - other.x - other.sx + minTWidth - 1) / other.twidth);
                    if((this.grid[curY1][curX1] && this.grid[othY1][othX1]) &&
                        (this.grid[curY2][curX1] && this.grid[otherY2][othX1]) &&
                        (this.grid[curY1][curX2] && this.grid[othY1][othX2]) &&
                        (this.grid[curY2][curX2] && this.grid[othY2][othX2])){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}