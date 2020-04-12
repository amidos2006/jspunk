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
        this.cx = 0;
        this.cy = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        this.alpha = 1;
        this._tintedImage = create_bitmap(source.w, source.h);
        this.tint = 0xffffff;
    }

    get tint(){
        return this._tint;
    }

    set tint(value){
        this._tint = value;

        this._tintedImage.context.clearRect(0, 0, this._tintedImage.w, this._tintedImage.h);

        _fillstyle(this._tintedImage, this._tint);
        this._tintedImage.context.fillRect(0, 0, this._tintedImage.w, this._tintedImage.h);
        
        this._tintedImage.context.globalCompositeOperation = "multiply";
        this._tintedImage.context.drawImage(this.source.canvas, 0, 0);
        
        this._tintedImage.context.globalCompositeOperation = "destination-atop";
        this._tintedImage.context.drawImage(this.source.canvas, 0, 0);
        
        this._tintedImage.context.globalCompositeOperation = "source-over";
    }

    draw(renderTarget,x,y){
        //need to check if in camera or not before drawing
        renderTarget.context.globalAlpha = this.alpha; 
        pivot_window_sprite(renderTarget, this._tintedImage, Math.floor(x), Math.floor(y), 
            Math.floor(this.cx), Math.floor(this.cy), 
            this.angle, this.scaleX, this.scaleY, 
            Math.floor(this.wx), Math.floor(this.wy), Math.floor(this.width), Math.floor(this.height));
        renderTarget.context.globalAlpha = 1;
    }
}

export class Text{
    constructor(font, text, size, tint, outlineTint, outlineWidth){
        if(text == undefined) text = "";
        if(size == undefined) size = 16;
        if(tint == undefined) tint = makecol(255, 255, 255);
        this.cx = 0;
        this.cy = 0;
        this.angle = 0;
        this.alpha = 1;
        this.font = font;
        this._size = size;
        this.tint = tint;
        this._text = text;
        this.outline = outlineTint;
        this.outlineWidth = outlineWidth;
        this._modifyMetrics();
    }

    _modifyMetrics() {
        canvas.context.font = this.size + "px " + this.font.name;
        let metrics = canvas.context.measureText(this.text);
        this.width = Math.floor(metrics.width);
        this.height = Math.floor(Math.abs(metrics.actualBoundingBoxAscent -
            metrics.actualBoundingBoxDescent));
    }

    get text(){
        return this._text;
    }

    set text(value){
        this._text = value;
        this._modifyMetrics();
    }

    get size(){
        return this._size;
    }

    set size(value){
        this._size = value;
        this._modifyMetrics();
    }

    draw(renderTarget, x, y){
        renderTarget.context.save();
        renderTarget.context.globalAlpha = this.alpha; 
        renderTarget.context.translate(x, y);
        renderTarget.context.rotate(RAD(this.angle));
        renderTarget.context.translate(-this.cx, this.height - this.cy);
        textout(renderTarget, this.font, this.text, 0, 0, this.size, 
                    this.tint, this.outline, this.outlineWidth);
        renderTarget.context.restore();
    }
}

export class BitmapText extends Graphic{
    constructor(bitmap_font, text){
        if(text == undefined) text = "";
        super(create_bitmap(1, 1));
        this.font_bitmap = bitmap_font.bitmap;
        this.font_data = bitmap_font.data;
        this.text = text;
    }

    get text(){
        return this._text;
    }

    set text(value){
        this._text = value;
        let sx = 0, sy= 0;
        let width = 0, height = 0;
        let minYOff = Number.MAX_VALUE;
        for (let c of this._text) {
            let rect = this.font_data[c.charCodeAt(0)];
            width += rect.xadv;
            height = Math.max(height, rect.h);
            minYOff = Math.min(minYOff, rect.yoff);
        }
        let renderTarget = this.source;
        renderTarget.w = width, renderTarget.h = height;
        renderTarget.canvas.width = width, renderTarget.canvas.height = height;
        renderTarget.context.clearRect(0, 0, width, height);
        let tintedImage = this._tintedImage;
        tintedImage.w = width, tintedImage.h = height;
        tintedImage.canvas.width = width, tintedImage.canvas.height = height;
        this._tintedImage = this.font_bitmap;
        let scaleX = this.scaleX, scaleY = this.scaleY;
        this.scaleX = this.scaleY = 1;
        let cx = this.cx, cy = this.cy;
        for (let c of this._text) {
            let rect = this.font_data[c.charCodeAt(0)];
            this.wx = rect.x, this.wy = rect.y;
            this.width = rect.w, this.height = rect.h;
            this.cx = -rect.xoff, this.cy = -rect.yoff;
            super.draw(renderTarget, sx, sy - minYOff);
            sx += rect.xadv;
        }
        this.source = renderTarget;
        this._tintedImage = tintedImage;
        this.wx = 0, this.wy = 0, this.cx = 0, this.cy = 0;
        this.width = width, this.height = height;
        this.tint = this._tint;
        this.cx = cx, this.cy = cy;
        this.scaleX = scaleX, this.scaleY = scaleY;
    }
}

export class Backdrop extends Graphic{
    constructor(source, repeatX, repeatY){
        if(repeatX == undefined) repeatX = true;
        if(repeatY == undefined) repeatY = true;
        super(source);
        this.repeatX = repeatX;
        this.repeatY = repeatY;
    }

    draw(renderTarget,x,y){
        let xnumber = Math.ceil(SCREEN_W / this.width);
        let ynumber = Math.ceil(SCREEN_H / this.height);
        let shiftX = Math.floor(x % this.width);
        let shiftY = Math.floor(y % this.height);
        for(let dy=-1; dy<ynumber+2; dy++){
            for(let dx=-1; dx<xnumber+2; dx++){
                super.draw(renderTarget, shiftX + dx*this.width, shiftY + dy*this.height);
            }
        }
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

    getGridWidth(){
        return this.grid[0].length;
    }

    getGridHeight(){
        return this.grid.length;
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
        let shown_width = Math.min(this.grid[0].length - shown_x, Math.ceil(SCREEN_W / twidth) + 2);
        let shown_height = Math.min(this.grid.length - shown_y, Math.ceil(SCREEN_H / theight) + 2);
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
        let shown_width = Math.min(this.grid[0].length - shown_x, Math.ceil(SCREEN_W / twidth) + 2);
        let shown_height = Math.min(this.grid.length - shown_y, Math.ceil(SCREEN_H / theight) + 2);

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