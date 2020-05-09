import JSP from "./JSP.js";
import {Hitbox} from "./hitbox.js";

export class Color {
    constructor(r, g, b, a) {
        if (g == undefined && b == undefined) g = b = r;
        if (a == undefined) a = 255;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    getInteger() {
        return (this.a << 24) | ((this.r & 0xff) << 16) | ((this.g & 0xff) << 8) | ((this.b & 0xff));
    }
}

export class Camera {
    constructor(x, y, anchorX, anchorY, angle, zoom) {
        if (anchorX == undefined) anchorX = 0;
        if (anchorY == undefined) anchorY = 0;
        if (angle == undefined) angle = 0;
        if (zoom == undefined) zoom = 1;
        this.x = x;
        this.y = y;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.angle = angle;
        this.zoom = zoom;

        this._cameraBox = new Hitbox(0, 0, 1, 1);
        this._tempBox = new Hitbox(0, 0, 1, 1);
    }

    checkRender(graphic, x, y, renderTarget) {
        this._tempBox.x = -graphic.cx * graphic.scaleX;
        this._tempBox.y = -graphic.cy * graphic.scaleY;
        this._tempBox.width = graphic.width * graphic.scaleX;
        this._tempBox.height = graphic.height * graphic.scaleY;
        this._tempBox._move(x, y);
        this._cameraBox.x = -this.anchorX * renderTarget.width / this.zoom;
        this._cameraBox.y = -this.anchorY * renderTarget.height / this.zoom;
        this._cameraBox.width = renderTarget.width / this.zoom;
        this._cameraBox.height = renderTarget.height / this.zoom;
        this._cameraBox._move(this.x, this.y);
        return this._cameraBox.checkCollide(this._cameraBox);
    }
}

export class RenderTarget{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.blendMode = "source-over";
        
        if(JSP.debug) JSP.debug.log("Creating RenderTarget at " + width + " x " + height + "!");
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        if(!JSP._smoothing){
            this.canvas.style.imageRendering = "-moz-crisp-edges";
            this.canvas.style.imageRendering = "-webkit-crisp-edges";
            this.canvas.style.imageRendering = "pixelated";
            this.canvas.style.imageRendering = "crisp-edges";
        }
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = JSP._smoothing;
        if(JSP._highDensity){
            this.canvas.width = window.devicePixelRatio * SCREEN_W;
            this.canvas.height = window.devicePixelRatio * SCREEN_H;
            this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    

    clearTarget(col){
        this.context.clearRect(0, 0, this.width, this.height);
        if(col != undefined){
            this.context.fillStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + col.a + ')';
            this.context.fillRect(0, 0, this.width, this.height);
        }
    }
    
    drawTexture(texture, dx, dy, angle, scalex, scaley, alpha, originx, originy, sx, sy, width, height) {
        if(angle == undefined) angle = 0;
        if(scalex == undefined) scalex = 1;
        if(scaley == undefined) scaley = 1;
        if(alpha == undefined) alpha = 1;
        if(originx == undefined) originx = 0;
        if(originy == undefined) originy = 0;
        if(sx == undefined) sx = 0;
        if(sy == undefined) sy = 0;
        if(width==undefined) width = texture.w;
        if(height==undefined) height = texture.h;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.globalAlpha = alpha;
        this.context.translate(Math.floor(dx), Math.floor(dy));
        this.context.rotate(Math.RAD(angle));
        this.context.scale(scalex, scaley);
        this.context.translate(-Math.floor(originx), -Math.floor(originy));
        this.context.drawImage(texture.canvas, Math.floor(sx), Math.floor(sy), 
            Math.floor(width), Math.floor(height), 0, 0, Math.floor(width), Math.floor(height));
        this.context.restore();
    }

    drawText(font, text, x, y, size, color, angle, originx, originy, alpha, outlineWidth, outlineColor){
        if(x == undefined) x = 0;
        if(y == undefined) y = 0;
        if(size == undefined) size = 16;
        if(color == undefined) color = new Color(255, 255, 255);
        if(angle == undefined) angle = 0;
        if(originx == undefined) originy = 0;
        if(originy == undefined) originy = 0;
        if(alpha == undefined) alpha = 1;
        if(outlineWidth == undefined) outlineWidth = 0;
        if(outlineColor == undefined) outlineColor = new Color(0, 0, 0);

        this.context.save();
        this.context.globalAlpha = alpha;
        this.context.translate(Math.floor(x), Math.floor(y));
        this.context.rotate(Math.RAD(angle));
        this.context.translate(-Math.floor(originx), -Math.floor(originy));

        this.context.font = size.toFixed() + 'px ' + font.name;
        this.context.textAlign = "left";
        this.context.fillStyle = 'rgba(' + color.r + ',' +color.g + ',' + color.b + ',' + color.a + ')';
        this.context.fillText(text, 0, 0);
        if (outlineWidth > 0) {
            this.context.lineWidth = outlineWidth;
            this.context.strokeStyle = 'rgba(' + outlineColor.r + ',' + outlineColor.g + ',' + outlineColor.b + ',' + outlineColor.a + ')';
            this.context.strokeText(text, 0, 0);
        }
        
        this.context.restore();
    }

    drawRect() {

    }

    drawFillRect(){

    }

    drawCircle(){

    }

    drawFillCircle(){

    }

    drawLine(){

    }
}