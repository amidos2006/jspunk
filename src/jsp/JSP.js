import Loader from "./loader.js";
import { Camera, RenderTarget, Color } from "./rendering.js";
import { logoBase64, fontBase64, bitmapFontBase64, bitmapFontXML } from "./utils.js";
import { Input } from "./input.js";
import Debug from "./debug.js";
import { SoundManager } from "./sound.js";
import { StorageManager } from "./storage.js";

export default class JSP{
    static get world(){
        return this._currentWorld;
    }

    static set world(w){
        this._nextWorld = w;
    }

    static get delta(){
        return Date.now() - this._prevTick;
    }

    static set pause(value){
        if(value){
            this.soundManager.pause();
        }
        else{
            this.soundManager.resume();
        }
        this._pause = value;
    }

    static get pause(){
        return this._pause;
    }

    static _initLoader(){
        this.loader = new Loader();
    }

    static _initMath(){
        Math.RAD = function(d) { 
            return -d * Math.PI / 180.0; 
        }

        
        Math.DEG = function(r) { 
            return -r * 180.0 / Math.PI; 
        }

        Math.length = function(x, y) {
            return Math.sqrt(x * x - y * y);
        }

        Math.manDist = function(x1, y1, x2, y2){
            return Math.abs(x2 - x1) + Math.abs(y2 - y1);
        }

        Math.distance = function(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }

        Math.distance2 = function(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        }

        Math.lineDist = function(ex1, ey1, ex2, ey2, x, y) {
            var px = ex2 - ex1;
            var py = ey2 - ey1;
            var u = ((x - ex1) * px + (y - ey1) * py) / (px * px + py * py);
            if (u > 1)
                u = 1;
            else if (u < 0)
                u = 0;

            var dx = ex1 + u * px - x;
            var dy = ey1 + u * py - y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        Math.randint = function(value){
            if(value == 0) return 0;
            return Math.floor(65536 * Math.random()) % value;
        }

        Math.randchoice = function(array){
            return array[Math.randint(array.length)];
        }

        Math.shuffle = function(array) {
            for (let i = 0; i < array.length; i++) {
                let i2 = Math.randint(array.length);
                let temp = array[i];
                array[i] = array[i2];
                array[i2] = temp;
            }
        }

        Math.lerp = function(from, to, progress){
            return from + (to - from) * progress;
        }
        
        Math.dot = function(x1, y1, x2, y2) {
            return x1 * x2 + y1 * y2;
        }

        Math.scale = function(value, min, max, min2, max2) {
            return min2 + ((value - min) / (max - min)) * (max2 - min2);
        }

        Math.clamp = function(value, min, max) {
            if (max > min) {
                if (value < min) return min;
                else if (value > max) return max;
                else return value;
            } else {
                if (value < max) return max;
                else if (value > min) return min;
                else return value;
            }
        }

        Math.angle = function (x1, y1, x2, y2) {
            var a = DEG(Math.atan2(y2 - y1, x2 - x1));
            return a < 0 ? a + 360 : a;
        }

        Math.angleDiff = function(a, b) {
            var diff = b - a;
            diff /= 360;
            diff = (diff - floor(diff)) * 360
            if (diff > 180) { diff -= 360; }
            return diff;
        }

        Math.createMat = function(){
            return [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }

        Math.matMult= function(left, right){
            let result = [];
            for(let y=0; y<3; y++){
                for(let x=0; x<3; x++){
                    let value = 0;
                    for(let i=0; i<3; i++){
                        value += left[y*3 + i] * right[i*3 + x];
                    }
                    result.push(value);
                }
            }
            return result;
        }

        Math.matTranslate = function (mat, x, y) {
            return Math.matMult(mat, [1, 0, x, 0, 1, y, 0, 0, 1]);
        }

        Math.matRotate = function (mat, angle) {
            let rad = Math.RAD(angle);
            return Math.matMult(mat, [Math.cos(rad), -Math.sin(rad), 0, Math.sin(rad), Math.cos(rad), 0, 0, 0, 1]);
        }

        Math.matScale = function(mat, sx, sy){
            return Math.matMult(mat, [sx, 0, 0, 0, sy, 0, 0, 0, 1]);
        }

        Math.vecMult = function(mat, vec){
            let result = [];
            for (let y = 0; y < 3; y++) {
                let value = 0;
                for (let i = 0; i < 3; i++) {
                    value += mat[y * 3 + i] * vec[i];
                }
                result.push(value);
            }
            return result;
        }

        Math.pointMult = function(mat, x, y){
            return Math.vecMult(mat, [x, y, 1]);
        }
    }

    static _initGraphics(canvasID, width, height, scale, smoothing, highDensity){
        this._smoothing = smoothing;
        this._highDensity = highDensity;

        this.backcolor = new Color(0, 0, 0);
        this.camera = new Camera(0, 0);
        this.renderTarget = new RenderTarget(width, height, smoothing, highDensity);
        this.renderTarget.canvas.id = canvasID;
        this.dynamicScale = scale <= 0;
        if(!this.dynamicScale){
            this.renderTarget.canvas.scale = scale;
            this.renderTarget.canvas.style.width = width * this.renderTarget.canvas.scale + "px";
            this.renderTarget.canvas.style.height = height * this.renderTarget.canvas.scale + "px";
        }
        else{
            window.onresize = function(){
                this.scale = Math.min(window.innerWidth / width, window.innerHeight / height);
                this.style.width = width * this.scale + "px";
                this.style.height = height * this.scale + "px";
            }.bind(this.renderTarget.canvas);
            window.onresize();
        }
    }

    static _initDefaultAssets(){
        this.loader._cache["logo"] = this.loader._loadBitmap("data:image/png;base64," + logoBase64);
        this.loader._cache["font"] = this.loader._loadFont("font", "data:application/font-woff;base64," + fontBase64);
        this.loader._cache["bmpfont"] = {
            bitmap: this.loader._loadBitmap("data:image/png;base64," + bitmapFontBase64),
            data: {},
            ready: true,
            type: "bmpfnt"
        }
        let xmlFile = new DOMParser().parseFromString(bitmapFontXML, "text/xml")
        for (let c of xmlFile.getElementsByTagName("char")) {
            this.loader._cache["bmpfont"].data[parseInt(c.getAttribute('id'))] = {
                x: parseInt(c.getAttribute('x')),
                y: parseInt(c.getAttribute('y')),
                w: parseInt(c.getAttribute('width')),
                h: parseInt(c.getAttribute('height')),
                xoff: parseInt(c.getAttribute('xoffset')),
                yoff: parseInt(c.getAttribute('yoffset')),
                xadv: parseInt(c.getAttribute('xadvance'))
            };
        };
    }

    static _initDebug(debugID){
        this.debug = new Debug();
        if (debugID.length > 0) {
            this.debug.element.id = debugID;
        }
    }

    static _initInput(canvas){
        this.input = new Input(canvas);
    }

    static _initSound(){
        this.soundManager = new SoundManager();
    }

    static _initStorage(){
        this.storage = new StorageManager();
    }

    static init(canvasID, width, height, fps, scale, debugID, smoothing){
        if(fps==undefined) fps = 60;
        if(scale==undefined) scale = 1;
        if(debugID==undefined) debugID = "";
        if(smoothing==undefined) smoothing = false;

        if (this.loader) {
            JSP.debug.log("JSP is already initialized!");
            return;
        }

        this._nextWorld = null;
        this._currentWorld = null;
        this._fps = fps;
        this._pause = false;

        this._initLoader();
        this._initMath();
        this._initGraphics(canvasID, width, height, scale, smoothing);
        this._initDebug(debugID);
        this._initInput(this.renderTarget.canvas);
        this._initSound();
        this._initStorage();
        this.debug.enable = debugID.length > 0;

        this._gameLoopID = window.setInterval(function(){
            if(!this.pause){
                this._update();
            }
            this.renderTarget.clearTarget(this.backcolor);
            this._draw();
            if(!this.pause){
                this.input._update();
            }
        }.bind(this), 1000 / this._fps);

        document.addEventListener("visibilitychange", function() {
            if (document.hidden){
                this.pause = true;
            } else {
                this.pause = false;
            }
        }.bind(this));

        this._prevTick = Date.now();
        window.focus();
    }

    static start(main){
        let debugEnable = this.debug.enable;
        this.debug.enable = false;
        window.addEventListener("load", function(){
            document.body.append(this.renderTarget.canvas);
            if(debugEnable){
                document.body.append(this.debug.element);
            }
            this._initDefaultAssets();
            this.loader.startLoading(function () {
                this.debug.enable = debugEnable;
                if(main) main();
            }.bind(this))
        }.bind(this));
    }

    static _update(){
        if(this._nextWorld != null){
            if(this._currentWorld != null){
                this._currentWorld.end();
            }
            this._currentWorld = this._nextWorld;
            this._nextWorld = null;
            this._currentWorld.begin();
        }
        if (this._currentWorld != null) {
            this._currentWorld.update();
        }
        this._prevTick = Date.now();
    }

    static _draw(){
        if(this._currentWorld != null){
            this._currentWorld.draw();
        }
    }
}