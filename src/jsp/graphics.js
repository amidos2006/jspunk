export class Graphic{
    constructor(source,wx,wy,ww,wh){
        if(wx == undefined) wx=0;
        if(wy == undefined) wy=0;
        if(ww == undefined) ww=source.w;
        if(wh == undefined) wh=source.h;
        this.source = source;
        this.wx = wx;
        this.wy = wy;
        this.width = ww;
        this.height = wh;
        this.cx = this.width/2;
        this.cy = this.height/2;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        this.alpha = 1;
    }

    draw(renderTarget,x,y){
        renderTarget.context.globalAlpha = this.alpha; 
        pivot_window_sprite(renderTarget, this.source, Math.floor(x), Math.floor(y), 
            Math.floor(this.cx), Math.floor(this.cy), 
            this.angle, this.scaleX, this.scaleY, 
            Math.floor(this.wx), Math.floor(this.wy), Math.floor(this.width), Math.floor(this.height));
        renderTarget.context.globalAlpha = 1;
    }
}

export class IndexedGraphic extends Graphic{
    constructor(source,index,width,height){
        super(source,0,0,width,height);
        if(index == undefined) index = 0;
        this.index = index;
    }

    _transformIndexToWindow(){
        let gx = Math.ceil(this.source.w / this.width);
        this.wx = (this.index % gx) * this.width;
        this.wy = Math.floor(this.index / gx) * this.height;
    }

    draw(renderTarget,x,y){
        this._transformIndexToWindow();
        super.draw(renderTarget,x,y);
    }
}

export class Spritemap extends IndexedGraphic{
    constructor(source,width,height){
        super(source,0,width,height);
        this.current = "";
        this.animations = {};
    }

    addAnimation(name,indeces,fps,loop,callback){
        if(indeces == undefined) indeces = [0];
        if(fps == undefined) fps = 0;
        if(loop == undefined) loop = false;
        if(callback == undefined) callback = null;
        if(!(name in this.animations)){
            this.animations[name] = {
                index: 0,
                done: false,
                indeces: indeces,
                fps: fps,
                loop: loop,
                callback: callback
            }
        }
    }

    playAnimation(name,forceRestart){
        if(forceRestart == undefined) forceRestart = false;
        if(name != this.current || forceRestart){
            this.current = name;
            this.animations[name].index = 0;
            this.animations[name].done = false;
        }
    }

    draw(renderTarget,x,y){
        if(this.current in this.animations){
            let anim = this.animations[this.current];
            this.index = anim.indeces[Math.floor(anim.index)];
            anim.index += anim.fps/60;
            if(anim.index >= anim.indeces.length){
                if(anim.loop){
                    anim.index -= anim.indeces.length;
                    if(anim.callback != null) anim.callback();
                }
                else{
                    anim.index = anim.indeces.length - 1;
                    if(!anim.done){
                        anim.done = true;
                        if(anim.callback != null) anim.callback();
                    }
                }
            }
        }
        super.draw(renderTarget,x,y);
    }
}

export class TileMap extends IndexedGraphic{
    constructor(source,width,height,gridWidth,gridHeight){
        if(gridWidth == undefined) gridHeight = 1;
        if(gridHeight == undefined) gridHeight = 1;
        super(source,0,width,height);
        this.grid = [];
        for(let y=0; y<gridHeight; y++){
            this.grid.push([]);
            for(let x=0; x<gridWidth; x++){
                this.grid[y].push(-1);
            }
        }
    }

    setTile(x,y,value){
        if(x < 0 || y < 0 || x >= this.grid[0].length || x >= this.grid.length) return;
        this.grid[y][x] = value;
    }

    clearTile(x,y){
        if (x < 0 || y < 0 || x >= this.grid[0].length || x >= this.grid.length) return;
        this.grid[y][x] = -1;
    }

    draw(renderTarget,x,y){
        let twidth = this.width * this.scaleX;
        let theight = this.height * this.scaleY;
        let shown_x = Math.max(0, Math.floor(-x / twidth));
        let shown_y = Math.max(0, Math.floor(-y / theight));
        let shown_width = Math.min(this.grid[0].length, Math.ceil(SCREEN_W / twidth) + 2);
        let shown_height = Math.min(this.grid.length, Math.ceil(SCREEN_H / theight) + 2);
        for (let gy = -1; gy < shown_height; gy++) {
            for (let gx = -1; gx < shown_width; gx++) {
                let tx = Math.max(0, shown_x + gx);
                let ty = Math.max(0, shown_y + gy);
                this.index = this.grid[ty][tx];
                if(this.index >= 0){
                    super.draw(renderTarget, x + tx * twidth, y + ty * theight);
                }
            }
        }
    }
}

export class AnimTileMap extends TileMap{
    constructor(source, width, height, gridWidth, gridHeight) {
        super(source, width, height, gridWidth, gridHeight);
        this.animations = {};
        this._temp_grid = [];
        for(let y=0; y<gridHeight; y++){
            this._temp_grid.push([]);
            for(let x=0; x<gridWidth; x++){
                this._temp_grid[y].push(-1);
            }
        }
    }

    addAnimation(value, indeces, fps) {
        if (indeces == undefined) indeces = [0];
        if (fps == undefined) fps = 0;
        if (!(value in this.animations)) {
            this.animations[value] = {
                index: 0,
                done: false,
                indeces: indeces,
                fps: fps
            }
        }
    }

    draw(renderTarget,x,y){
        for(let value in this.animations){
            let anim = this.animations[value];
            anim.index += anim.fps / 60;
            if (anim.index >= anim.indeces.length) anim.index -= anim.indeces.length;
        }

        let twidth = this.width * this.scaleX;
        let theight = this.height * this.scaleY;
        let shown_x = Math.max(0, Math.floor(-x / twidth));
        let shown_y = Math.max(0, Math.floor(-y / theight));
        let shown_width = Math.min(this.grid[0].length, Math.ceil(SCREEN_W / twidth) + 2);
        let shown_height = Math.min(this.grid.length, Math.ceil(SCREEN_H / theight) + 2);

        for (let gy = -1; gy < shown_height; gy++) {
            for (let gx = -1; gx < shown_width; gx++) {
                let tx = Math.max(0, shown_x + gx);
                let ty = Math.max(0, shown_y + gy);
                this._temp_grid[ty][tx] = this.grid[ty][tx];
                if (this.grid[ty][tx] >= 0 && this.grid[ty][tx] in this.animations) {
                    let anim = this.animations[this.grid[ty][tx]];
                    this.grid[ty][tx] = anim.indeces[Math.floor(anim.index)];
                }
            }
        }
        super.draw(renderTarget, x, y);
        for (let gy = -1; gy < shown_height; gy++) {
            for (let gx = -1; gx < shown_width; gx++) {
                let tx = Math.max(0, shown_x + gx);
                let ty = Math.max(0, shown_y + gy);
                this.grid[ty][tx] = this._temp_grid[ty][tx];
            }
        }
    }
}