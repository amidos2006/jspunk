export default class JSP{
    static get world(){
        return this._currentWorld;
    }

    static set world(w){
        this._nextWorld = w;
    }

    static loadSFX(name, path){
        name = "sfx_" + name;
        if (name in this._cache) {
            return;
        }
        this._cache[name] = load_sample(path);
    }

    static loadGFX(name, path) {
        name = "gfx_" + name;
        if (name in this._cache) {
            return;
        }
        this._cache[name] = load_bmp(path);
    }

    static loadFNT(name, path) {
        name = "fnt_" + name;
        if (name in this._cache) {
            return;
        }
        this._cache[name] = load_font(path);
    }

    static loadJSON(name, path){
        name = "json_" + name;
        if (name in this._cache) {
            return;
        }
        this._cache[name] = load_json(path);
    }

    static getSFX(name){
        name = "sfx_" + name;
        if (!name in this._cache) {
            return null;
        }
        return this._cache[name];
    }

    static getGFX(name) {
        name = "gfx_" + name;
        if (!name in this._cache) {
            return null;
        }
        return this._cache[name];
    }

    static getFNT(name) {
        name = "fnt_" + name;
        if (!name in this._cache) {
            return null;
        }
        return this._cache[name];
    }

    static getJSON(name) {
        name = "json_" + name;
        if (!name in this._cache) {
            return null;
        }
        return this._cache[name];
    }

    static init(width, height, scale, debug){
        if(scale==undefined) scale = 1;
        if(debug==undefined) debug = false;

        this._nextWorld = null;
        this._currentWorld = null;
        this._cache = {};
        this.backcolor = makecol(0, 0, 0);
        this.camera = {x:0, y:0};
        document.getElementById("game_canvas").style.width = width * scale + "px";
        document.getElementById("game_canvas").style.height = height * scale + "px";
        if(debug){
            enable_debug('debug');
        }
        else{
            document.body.style.padding = "0px";
            document.body.style.margin = "0px";
            document.getElementById("debug").style.display = "none";
            let canvas = document.getElementById("game_canvas");
            canvas.style.border = "0px";
            canvas.style.margin = "0px";
            canvas.style.padding = "0px";
            canvas.style.borderRadius = "0px";
            canvas.style.boxShadow = "none";
        }
        allegro_init_all("game_canvas", width, height, false);
    }

    static start(){
        ready(function () {
            loop(function () {
                clear_to_color(canvas, JSP.backcolor);
                JSP._update();
                JSP._draw();
            }, BPS_TO_TIMER(60));
        });
    }

    static _update(){
        if(this._currentWorld != null){
            this._currentWorld.update();
        }
        if(this._nextWorld != null){
            if(this._currentWorld != null){
                this._currentWorld.end();
            }
            this._currentWorld = this._nextWorld;
            this._nextWorld = null;
            this._currentWorld.begin();
        }
    }

    static _draw(){
        if(this._currentWorld != null){
            this._currentWorld.draw();
        }
    }
}