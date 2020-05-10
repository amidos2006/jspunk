import JSP from "./JSP.js";

export default class Loader{
    constructor(){
        this._cache = {};
        this._loadingInProgress = false;
        this._loadedAssets = 0;
        this._downloadables = [];
        this._callback = null;
    }

    loadFile(name, filename){
        if (name in this._cache){
            JSP.debug.log("This name \"" + name + "\" has been used!");
            return;
        }
        if (this._loadingInProgress){
            JSP.debug.log("Can't load anything while loading is working!");
            return;
        }
        if(filename.endsWith("json")){
            this._cache[name] = this._loadJson(filename);
        }
        if(filename.endsWith("txt")){
            this._cache[name] = this._loadTxt(filename);
        }
        if(filename.endsWith("xml")){
            this._cache[name] = this._loadXml(filename);
        }
        if(filename.endsWith("png") || filename.endsWith("gif") || filename.endsWith("bmp") || 
            filename.endsWith("jpg") || filename.endsWith("jpeg") || filename.endsWith("svg") ||
            filename.endsWith("tif") || filename.endsWith("ico")){
            this._cache[name] = this._loadBitmap(filename);
        }
        if(filename.endsWith("mp3") || filename.endsWith("wav") || filename.endsWith("ogg")){
            this._cache[name] = this._loadSample(filename);
        }
        if(filename.endsWith("fnt")){
            this._cache[name] = this._loadBitmapFont(filename);
        }
        if (filename.endsWith("ttf") || filename.endsWith("eot") || filename.endsWith("woff")){
            this._cache[name] = this._loadFont(filename);
        }
    }

    getFile(name){
        if (name in this._cache && this._cache[name].ready){
            return this._cache[name];
        }
        return null;
    }

    startLoading(callback) {
        this._callback = callback;
        this._loadedAssets = 0;
        this._loadingInProgress = true;
        setTimeout(this._checkProgress.bind(this), 100);
    }

    getLoadingProgress(){
        if(this._downloadables.length == 0){
            return 1;
        }
        return this._loadedAssets / this._downloadables.length;
    }

    clearCache(){
        this._cache = {};
        this._downloadables = [];
        this._loadedAssets = 0;
        this._callback = null;
        this._loadingInProgress = false;
    }

    _checkProgress(){
        this._loadedAssets = 0;
        for(let d of this._downloadables){
            if(d.ready){
                this._loadedAssets += 1;
            }
        }
        if(this._loadedAssets < this._downloadables.length){
            setTimeout(this._checkProgress.bind(this), 100);
        }
        else{
            this._loadingInProgress = false;
            if(this._callback){
                this._callback();
            }
            this._downloadables.length = 0;
        }
    }

    /// Loads JSON file
    /// Loads JSON from file asynchronously
    /// @param filename the json file name
    /// @return the loaded json file
    _loadJson(filename) {
        JSP.debug.log("Loading json " + filename + "...");
        var jsonFile = { data: null, ready: false, type: "json" };
        this._downloadables.push(jsonFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                JSP.debug.log("JSON " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                jsonFile.data = JSON.parse(xobj.responseText);
                jsonFile.ready = true;
            }
        };
        xobj.send(null);
        return jsonFile;
    }

    /// Loads txt file
    /// Loads txt from file asynchronously
    /// @param filename the txt file name
    /// @return the loaded txt file
    _loadTxt(filename) {
        JSP.debug.log("Loading txt " + filename + "...");
        var txtFile = { data: null, ready: false, type: "txt" };
        this._downloadables.push(txtFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/txt");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                JSP.debug.log("TXT " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                txtFile.data = xobj.responseText;
                txtFile.ready = true;
            }
        };
        xobj.send(null);
        return txtFile;
    }

    /// Loads XML file
    /// Loads XML from file asynchronously
    /// @param filename the xml file name
    /// @return the loaded xml file
    _loadXml(filename) {
        JSP.debug.log("Loading xml " + filename + "...");
        var xmlFile = { data: null, ready: false, type: "xml" };
        this._downloadables.push(xmlFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/xml");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                JSP.debug.log("XML " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                xmlFile.data = xobj.responseXML;
                xmlFile.ready = true;
            }
        };
        xobj.send(null);
        return xmlFile;
    }

    /// Loads bitmap from file
    /// Loads image from file asynchronously. This means that the execution won't stall for the image, and it's data won't be accessible right off the start. You can check for bitmap object's 'ready' member to see if it has loaded, but you probably should avoid stalling execution for that, as JS doesn't really like that.
    /// @param filename URL of image
    /// @return bitmap object, or -1 on error
    _loadBitmap(filename) {
        JSP.debug.log("Loading bitmap " + filename + "...");
        var img = new Image();
        img.src = filename;
        var cv = document.createElement('canvas');
        if (JSP._smoothing){
            cv.style.imageRendering = "-moz-crisp-edges";
            cv.style.imageRendering = "-webkit-crisp-edges";
            cv.style.imageRendering = "pixelated";
            cv.style.imageRendering = "crisp-edges";
        }
        var ctx = cv.getContext("2d");
        ctx.imageSmoothingEnabled = JSP._smoothing;
        var bmp = { canvas: cv, context: ctx, w: -1, h: -1, ready: false, type: "bmp" };
        this._downloadables.push(bmp);
        img.onload = function () {
            JSP.debug.log("Bitmap " + filename + " loaded, size: " + img.width + " x " + img.height + "!");
            bmp.canvas.width = img.width;
            bmp.canvas.height = img.height;
            bmp.context.drawImage(img, 0, 0);
            bmp.w = img.width;
            bmp.h = img.height;
            bmp.ready = true;
        };
        return bmp;
    }

    _loadBitmapFont(filename) {
        JSP.debug.log("Loading font " + filename + "...");
        var fontFile = { bitmap: null, data: null, ready: false, type: "bmpfnt" };
        this._downloadables.push(fontFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/xml");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                JSP.debug.log("FONT " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                let xmlFile = xobj.responseXML;
                fontFile.bitmap = this._loadBitmap(filename.substring(0, filename.lastIndexOf("/")) +
                    "/" + xmlFile.getElementsByTagName("page")[0].getAttribute("file"));
                fontFile.data = {};
                for (let c of xmlFile.getElementsByTagName("char")) {
                    fontFile.data[parseInt(c.getAttribute('id'))] = {
                        x: parseInt(c.getAttribute('x')),
                        y: parseInt(c.getAttribute('y')),
                        w: parseInt(c.getAttribute('width')),
                        h: parseInt(c.getAttribute('height')),
                        xoff: parseInt(c.getAttribute('xoffset')),
                        yoff: parseInt(c.getAttribute('yoffset')),
                        xadv: parseInt(c.getAttribute('xadvance'))
                    };
                }
                fontFile.ready = true;
            }
        }.bind(this);
        xobj.send(null);
        return fontFile;
    }

    /// Loads a sample from file
    /// Loads a sample from file and returns it. Doesn't stall for loading, use ready() to make sure your samples are loaded! Note that big files, such as music jingles, will most probably get streamed instead of being fully loaded into memory, meta data should be accessible tho.
    /// @param filename name of the audio file
    /// @return sample object
    _loadSample(filename){
        var audio = document.createElement('audio');
        audio.src = filename;
        var sample = {element:audio,file:filename,ready:false,type:"snd"};
        this._downloadables.push(sample);
        JSP.debug.log("Loading sample " + filename + "...");
        audio.onloadeddata = function()
        {
            if (!sample.ready)
            {
                sample.ready=true;
                JSP.debug.log("Sample " + filename + " loaded!");
            }
        }
        return sample;
    }

    /// Loads font from file.
    /// This actually creates a style element, puts code inside and appends it to class. I heard it works all the time most of the time. Note that this function won't make ready() wait, as it's not possible to consistently tell if a font has been loaded in js, thus load your fonts first thing, and everything should be fine.
    /// @param filename Font file URL
    /// @return font object
    _loadFont(name, filename) {
        var s = document.createElement('style');
        var fontname = name;
        s.id = fontname;
        s.type = "text/css";
        document.head.appendChild(s);
        s.textContent = "@font-face { font-family: " + fontname + "; src:url('" + filename + "');}";
        return { element: s, file: filename, name: fontname, type: "fnt", ready: true };
    }
}