import JSP from "./JSP.js";
import {Hitbox} from "./hitbox.js";

export const BlendModes = {
    DEFAULT: "source-over",

    SOURCE_OVER: "source-over", SOURCE_IN: "source-in", SOURCE_OUT: "source-out", SOURCE_ATOP: "source-atop",
    DESTINATION_OVER: "destination-over", DESTINATION_IN: "destination-in", 
    DESTINATION_OUT: "destination-out", DESTINATION_ATOP: "destination-atop",
    LIGHTER: "lighter", COPY: "copy", XOR: "xor", MULTIPLY: "multiply",
    SCREEN: "screen", OVERLAY: "overlay", DARKEN: "darken", LIGHTEN: "lighten",
    COLOR_DODGE: "color-dodge", COLOR_BURN: "color-burn", HARD_LIGHT: "hard-light", 
    SOFT_LIGHT: "soft-light", DIFFERENCE: "difference", EXCLUSION: "exclusion", 
    HUE: "hue", SATURATION: "saturation", COLOR: "color", LUMINOSITY: "luminosity"
};

export class Color {
    static get WHITE(){
        if(this._white == undefined) this._white = new Color(255, 255, 255);
        return this._white;
    }

    static get BLACK(){
        if (this._black == undefined) this._black = new Color(0, 0, 0);
        return this._black;
    }

    static get RED(){
        if(this._red == undefined) this._red = new Color(255, 0, 0);
        return this._red;
    }

    static get GREEN(){
        if(this._green == undefined) this._green = new Color(0, 255, 0);
        return this._green;
    }

    static get BLUE(){
        if(this._blue == undefined) this._blue = new Color(0, 0, 255);
        return this._blue;
    }

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
        return this._cameraBox.checkCollide(this._tempBox);
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
        if (col != undefined) {
            this.canvas.style.backgroundColor = 'rgb(' + col.r + ',' + col.g + ',' + col.b + ')';
        }
        this.context.clearRect(0, 0, this.width, this.height);
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
        if(color == undefined) color = Color.WHITE;
        if(angle == undefined) angle = 0;
        if(originx == undefined) originy = 0;
        if(originy == undefined) originy = 0;
        if(alpha == undefined) alpha = 1;
        if(outlineWidth == undefined) outlineWidth = 0;
        if(outlineColor == undefined) outlineColor = Color.BLACK;

        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
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

    drawRect(x,y,width,height,color,thickness) {
        if(color == undefined) color = Color.BLACK;
        if(thickness == undefined) thickness = 1;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.lineWidth = Math.floor(thickness);
        this.context.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.strokeRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
        this.context.restore();
    }

    drawFillRect(x,y,width,height,color){
        if(color == undefined) color = Color.WHITE;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.fillStyle = 'rgba(' + color.r + ',' +color.g + ',' + color.b + ',' + color.a + ')';
        this.context.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
        this.context.restore();
    }

    drawArc(x, y, radius, angle1, angle2, color, thickness){
        if(color == undefined) color = Color.BLACK;
        if(thickness == undefined) thickness = 1;
        this.context.lineWidth = Math.floor(thickness);
        this.context.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.beginPath();
        this.context.arc(Math.floor(x), Math.floor(y), Math.floor(radius), Math.RAD(angle1), Math.RAD(angle2));
        this.context.stroke();
        this.context.restore();
    }

    drawFillArc(x, y, radius, angle1, angle2, color){
        if (color == undefined) color = Color.WHITE;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.beginPath();
        this.context.arc(Math.floor(x), Math.floor(y), Math.floor(radius), Math.RAD(angle1), Math.RAD(angle2));
        this.context.fill();
        this.context.restore();
    }

    drawCircle(x,y,radius,color,thickness){
        this.drawArc(x, y, radius, 0, 360, color, thickness);
    }

    drawFillCircle(x,y,radius,color){
        this.drawFillArc(x, y, radius, 0, 360, color);
    }

    drawLine(x1,y1,x2,y2,color,thickness){
        if(color == undefined) color = Color.BLACK;
        if(thickness == undefined) thickness = 1;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.lineWidth = Math.floor(thickness);
        this.context.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.beginPath();
        this.context.moveTo(Math.floor(x1), Math.floor(y1));
        this.context.lineTo(Math.floor(x2), Math.floor(y2));
        this.context.stroke();
        this.context.restore();
    } 

    drawHLine(x1,x2,y,color,thickness){
        this.drawLine(x1, y, x2, y, color, thickness);
    }

    drawVLine(x,y1,y2,color,thickness){
        this.drawLine(x, y1, x, y2, color, thickness);
    }

    drawPolygon(points, color, thickness) {
        if (color == undefined) color = Color.BLACK;
        if (thickness == undefined) thickness = 1;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.lineWidth = Math.floor(thickness);
        this.context.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.beginPath();
        for (let i = 0; i < points; i++) {
            if (i > 0) this.context.lineTo(Math.floor(points[i].x), Math.floor(points[i].y));
            else this.context.moveTo(Math.floor(points[i].x), Math.floor(points[i].y));
        }
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
    }
    
    drawFillPolygon(points, color){
        if (color == undefined) color = Color.WHITE;
        this.context.save();
        this.context.globalCompositeOperation = this.blendMode;
        this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        this.context.beginPath();
        for (let i = 0; i < points; i++) {
            if (i > 0) this.context.lineTo(Math.floor(points[i].x), Math.floor(points[i].y));
            else this.context.moveTo(Math.floor(points[i].x), Math.floor(points[i].y));
        }
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }

    drawTriangle(x1,y1,x2,y2,x3,y3,color,thickness){
        this.drawPolygon([{x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}], color, thickness);
    }

    drawFillTriangle(x1, y1, x2, y2, x3, y3, color) {
        this.drawFillPolygon([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], color);
    }
}