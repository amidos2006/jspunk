import { Camera, RenderTarget, Color } from "./rendering.js";
import JSP from "./JSP.js";

function applyCameraTransformation(renderTarget, camera){
    renderTarget.context.translate(-Math.floor(camera.x), -Math.floor(camera.y));
    renderTarget.context.translate(Math.floor(camera.anchorX * renderTarget.width),
        Math.floor(camera.anchorY * renderTarget.height));
    renderTarget.context.rotate(Math.RAD(camera.angle));
    renderTarget.context.scale(camera.zoom, camera.zoom);
    renderTarget.context.translate(-Math.floor(camera.anchorX * renderTarget.width),
        -Math.floor(camera.anchorY * renderTarget.height));
}

export class Graphic{
    constructor(source,wx,wy,ww,wh){
        if(wx == undefined) wx=0;
        if(wy == undefined) wy=0;
        if(ww == undefined) ww=source.width;
        if(wh == undefined) wh=source.height;
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
        this._tintedImage = new RenderTarget(source.width, source.height);
        this.tint = Color.WHITE;
    }

    get tint(){
        return this._tint;
    }

    set tint(value){
        if(this._tint && this._tint.r == value.r && this._tint.g == value.g && this._tint.b == value.b && this._tint.a == value.a){
            return;
        }
        this._tint = value;

        this._tintedImage.context.clearRect(0, 0, this._tintedImage.width, this._tintedImage.height);

        this._tintedImage.context.fillStyle = 'rgba(' + this._tint.r + ',' + this._tint.g + ',' + this._tint.b + ',' + this._tint.a + ')';
        this._tintedImage.context.fillRect(0, 0, this._tintedImage.width, this._tintedImage.height);
        
        this._tintedImage.context.globalCompositeOperation = "multiply";
        this._tintedImage.context.drawImage(this.source.canvas, 0, 0);
        
        this._tintedImage.context.globalCompositeOperation = "destination-atop";
        this._tintedImage.context.drawImage(this.source.canvas, 0, 0);
        
        this._tintedImage.context.globalCompositeOperation = "source-over";
    }

    draw(renderTarget, x, y, camera){
        if(this.alpha == 0 || this.scaleX == 0 || this.scaleY == 0){
            return;
        }
        
        //need to check if in camera or not before drawing
        renderTarget.context.save();
        applyCameraTransformation(renderTarget, camera);
        renderTarget.drawTexture(this._tintedImage, Math.floor(x), Math.floor(y), this.angle, 
            this.scaleX, this.scaleY, this.alpha, Math.floor(this.cx), Math.floor(this.cy), 
            Math.floor(this.wx), Math.floor(this.wy), Math.floor(this.width), Math.floor(this.height));
        renderTarget.context.restore();
    }
}

export class Text{
    constructor(font, text, size, tint, outlineWidth, outlineTint){
        if(text == undefined) text = "";
        if(size == undefined) size = 16;
        if(tint == undefined) tint = Color.WHITE;
        if(outlineWidth == undefined) outlineWidth = 0;
        if(outlineTint == undefined) outlineTint = Color.BLACK;
        this.cx = 0;
        this.cy = 0;
        this.angle = 0;
        this.alpha = 1;
        this.font = font;
        this._size = size;
        this.tint = tint;
        this._text = text;
        this.outlineWidth = outlineWidth;
        this.outlineTint = outlineTint;
        this._modifyMetrics();
    }

    _modifyMetrics() {
        JSP.renderTarget.context.font = this.size + "px " + this.font.name;
        let metrics = JSP.renderTarget.context.measureText(this.text);
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

    draw(renderTarget, x, y, camera){
        renderTarget.context.save();
        applyCameraTransformation(renderTarget, camera);
        renderTarget.drawText(this.font, this.text, x, y, this.size, 
            this.tint, this.angle, this.cx, this.cy - this.height, this.alpha, 
            this.outlineWidth, this.outlineTint);
        renderTarget.context.restore();
    }
}

export class BitmapText extends Graphic{
    constructor(bitmap_font, text){
        if(text == undefined) text = "";
        super(new RenderTarget(1, 1));
        this.font_bitmap = bitmap_font.bitmap;
        this.font_data = bitmap_font.data;
        this.text = text;
    }

    get text(){
        return this._text;
    }

    set text(value){
        if(this._text == value){
            return;
        }
        this._text = value.toString();
        let sx = 0, sy= 0;
        let width = 0, height = 0;
        let minYOff = Number.MAX_VALUE;
        for (let c of this._text) {
            let rect = this.font_data[c.charCodeAt(0)];
            width += rect.xadv;
            height = Math.max(height, rect.h + rect.yoff);
            minYOff = Math.min(minYOff, rect.yoff);
        }
        width = Math.max(width, 1), height = Math.max(height, 1);
        let renderTarget = this.source;
        renderTarget.width = width, renderTarget.height = height;
        renderTarget.canvas.width = width, renderTarget.canvas.height = height;
        renderTarget.context.clearRect(0, 0, width, height);
        let tintedImage = this._tintedImage;
        tintedImage.width = width, tintedImage.height = height;
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
            if (this.width > 0 && this.height > 0) {
                super.draw(renderTarget, sx, sy - minYOff, Camera.zeroCamera);
            }
            sx += rect.xadv;
        }
        this.source = renderTarget;
        this._tintedImage = tintedImage;
        this.wx = 0, this.wy = 0, this.cx = 0, this.cy = 0;
        this.width = width, this.height = height;
        let temp = this._tint;
        this._tint = null;
        this.tint = temp;
        this.cx = cx, this.cy = cy;
        this.scaleX = scaleX, this.scaleY = scaleY;
    }
}

export class Backdrop extends Graphic{
    constructor(source, repeatX, repeatY, parallaxX, parallaxY){
        if(repeatX == undefined) repeatX = true;
        if(repeatY == undefined) repeatY = true;
        if(parallaxX == undefined) parallaxX = 1;
        if(parallaxY == undefined) parallaxY = 1;
        super(source);
        this.repeatX = repeatX;
        this.repeatY = repeatY;
        this.parallaxX = parallaxX;
        this.parallaxY = parallaxY;
    }

    draw(renderTarget, x, y, camera){
        let xnumber = Math.ceil(JSP.renderTarget.width / this.width);
        let ynumber = Math.ceil(JSP.renderTarget.height / this.height);
        let shiftX = Math.floor((x - camera.x * this.parallaxX) % this.width);
        let shiftY = Math.floor((y - camera.y * this.parallaxY) % this.height);
        for(let dy=-1; dy<ynumber+2; dy++){
            for(let dx=-1; dx<xnumber+2; dx++){
                super.draw(renderTarget, shiftX + dx*this.width, shiftY + dy*this.height, Camera.zeroCamera);
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
        let gx = Math.ceil(this.source.width / this.width);
        this.wx = (this.index % gx) * this.width;
        this.wy = Math.floor(this.index / gx) * this.height;
    }

    draw(renderTarget, x, y, camera){
        this._transformIndexToWindow();
        super.draw(renderTarget,x,y,camera);
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
        if (name != this.current || this.animations[name].done || forceRestart){
            this.current = name;
            this.animations[name].index = 0;
            this.animations[name].done = false;
        }
    }

    draw(renderTarget, x, y, camera){
        if(this.current in this.animations){
            let anim = this.animations[this.current];
            this.index = anim.indeces[Math.floor(anim.index)];
            anim.index += anim.fps/JSP._fps;
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
        super.draw(renderTarget,x,y,camera);
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
        if(x < 0 || y < 0 || x >= this.grid[0].length || y >= this.grid.length) return;
        this.grid[y][x] = value;
    }

    clearTile(x,y){
        if (x < 0 || y < 0 || x >= this.grid[0].length || y >= this.grid.length) return;
        this.grid[y][x] = -1;
    }

    draw(renderTarget, x, y, camera){
        let twidth = this.width * this.scaleX;
        let theight = this.height * this.scaleY;
        let shown_x = Math.max(0, Math.floor(-(x - camera.x) / twidth));
        let shown_y = Math.max(0, Math.floor(-(y - camera.y) / theight));
        let shown_width = Math.min(this.grid[0].length - shown_x, Math.ceil(JSP.renderTarget.width / twidth));
        let shown_height = Math.min(this.grid.length - shown_y, Math.ceil(JSP.renderTarget.height / theight));
        for (let gy = -1; gy < shown_height + 1; gy++) {
            for (let gx = -1; gx < shown_width + 1; gx++) {
                let tx = shown_x + gx;
                let ty = shown_y + gy;
                if(tx < 0 || ty < 0 || ty >= this.grid.length || tx >= this.grid[ty].length){
                    continue;
                }
                this.index = this.grid[ty][tx];
                if(this.index >= 0){
                    super.draw(renderTarget, x + tx * twidth, y + ty * theight, camera);
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
                indeces: indeces,
                fps: fps
            }
        }
    }

    draw(renderTarget, x, y, camera){
        for(let value in this.animations){
            let anim = this.animations[value];
            anim.index += anim.fps / JSP._fps;
            if (anim.index >= anim.indeces.length) anim.index -= anim.indeces.length;
        }

        let twidth = this.width * this.scaleX;
        let theight = this.height * this.scaleY;
        let shown_x = Math.max(0, Math.floor(-(x - camera.x) / twidth));
        let shown_y = Math.max(0, Math.floor(-(y - camera.y) / theight));
        let shown_width = Math.min(this.grid[0].length - shown_x, Math.ceil(JSP.renderTarget.width / twidth));
        let shown_height = Math.min(this.grid.length - shown_y, Math.ceil(JSP.renderTarget.height / theight));

        for (let gy = -1; gy < shown_height + 1; gy++) {
            for (let gx = -1; gx < shown_width + 1; gx++) {
                let tx = shown_x + gx;
                let ty = shown_y + gy;
                if (tx < 0 || ty < 0 || ty >= this.grid.length || tx >= this.grid[ty].length) {
                    continue;
                }
                this._temp_grid[ty][tx] = this.grid[ty][tx];
                if (this.grid[ty][tx] >= 0 && this.grid[ty][tx] in this.animations) {
                    let anim = this.animations[this.grid[ty][tx]];
                    this.grid[ty][tx] = anim.indeces[Math.floor(anim.index)];
                }
            }
        }
        super.draw(renderTarget, x, y, camera);
        for (let gy = -1; gy < shown_height + 1; gy++) {
            for (let gx = -1; gx < shown_width + 1; gx++) {
                let tx = shown_x + gx;
                let ty = shown_y + gy;
                if (tx < 0 || ty < 0 || ty >= this.grid.length || tx >= this.grid[ty].length) {
                    continue;
                }
                this.grid[ty][tx] = this._temp_grid[ty][tx];
            }
        }
    }
}

export class GraphicList{
    constructor(){
        this.graphics = [];
        this.shift = [];
    }

    add(g, sx, sy){
        if(sx === undefined) sx = 0;
        if(sy === undefined) sy = 0;

        // if(this.graphics.indexOf(g) < 0){
        this.graphics.push(g);
        this.shift.push({x: sx, y: sy});
        // }
       
    }

    remove(g){
        let index = this.graphics.indexOf(g);
        while(index >= 0){
            this.removeAt(index);
            index = this.graphics.indexOf(g);
        }
    }

    removeAt(index){
        if(index >= 0 && index < this.graphics.length){
            this.graphics.splice(index, 1);
            this.shift.splice(index, 1);
        }
    }

    count(){
        return this.graphics.length;
    }

    draw(renderTarget, x, y, camera) {
        for(let i=0; i<this.graphics.length; i++){
            let g = this.graphics[i];
            let s = this.shift[i];
            g.draw(renderTarget, x + s.x, y + s.y, camera);
        }
    }
}