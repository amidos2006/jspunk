export const MouseKeys = {
    LEFT: 0,
    RIGHT: 2,
    MIDDLE: 1,
}

export const KeyboardKeys = {
    A: 0x41, B: 0x42, C: 0x43, D: 0x44, E: 0x45, F: 0x46, G: 0x47, H: 0x48, I: 0x49, J: 0x4A, 
    K: 0x4B, L: 0x4C, M: 0x4D, N: 0x4E, O: 0x4F, P: 0x50, Q: 0x51, R: 0x52, S: 0x53, T: 0x54,
    U: 0x55, V: 0x56, W: 0x57, X: 0x58, Y: 0x59, Z: 0x5A,

    NUM_0: 0x30, NUM_1: 0x31, NUM_2: 0x32, NUM_3: 0x33, NUM_4: 0x34, NUM_5: 0x35,
    NUM_6: 0x36, NUM_7: 0x37, NUM_8: 0x38, NUM_9: 0x39, 

    NUMPAD_0: 0x60, NUMPAD_1: 0x61, NUMPAD_2: 0x62, NUMPAD_3: 0x63, NUMPAD_4: 0x64, 
    NUMPAD_5: 0x65, NUMPAD_6: 0x66,NUMPAD_7: 0x67, NUMPAD_8: 0x68, NUMPAD_9: 0x69,
    NUMPAD_SLASH: 0x6F, NUMPAD_MINUS: 0x6D, NUMPAD_PLUS: 0x6B, NUMPAD_ENTER: 0x0D, NUMPAD_EQUALS: 0x0C,

    F1: 0x70, F2: 0x71, F3: 0x72,F4: 0x73, F5: 0x74, F6: 0x75, F7: 0x76, F8: 0x77, F9: 0x78,
    F10: 0x79, F11: 0x7a, F12: 0x7b, 

    SPACE: 0x20, LEFT: 0x25, RIGHT: 0x27, UP: 0x26, DOWN: 0x28, ENTER: 0x0D, ESC: 0x1B, 

    INSERT: 0x2D, DEL: 0x2E, HOME: 0x24, END: 0x23, PGUP: 0x21, PGDN: 0x22,

    TILDE: 0xc0, MINUS: 0xbd, EQUALS: 0xbb, BACKSPACE: 0x08, TAB: 0x09,
    OPENBRACE: 0xdb, CLOSEBRACE: 0xdd,  COLON: 0xba, QUOTE: 0xde, BACKSLASH: 0xdc, 
    COMMA: 0xbc, STOP: 0xbe, SLASH: 0xBF,   ASTERISK: 0x6A,  PRTSCR: 0x2C, PAUSE: 0x13,
    LSHIFT: 0x10, RSHIFT: 0x10, LCONTROL: 0x11,RCONTROL: 0x11, ALT: 0x12, ALTGR: 0x12, 
    LWIN: 0x5b, RWIN: 0x5c, MENU: 0x5d, SCRLOCK: 0x9d, NUMLOCK: 0x90, CAPSLOCK: 0x14
}

export class Input {
    constructor(canvas, canvasScale){
        this._mousePressed = {};
        this._mouseReleased = {};
        this._mouseDown = {};
        for(let k in MouseKeys){
            this._mousePressed[MouseKeys[k]] = false;
            this._mouseReleased[MouseKeys[k]] = false;
            this._mouseDown[MouseKeys[k]] = false;
        }
        this._initMouse(canvas, canvasScale);

        this._keyPressed = {};
        this._keyReleased = {};
        this._keyDown = {};
        this._keyString = "";
        for (let k in KeyboardKeys) {
            this._keyPressed[KeyboardKeys[k]] = false;
            this._keyReleased[KeyboardKeys[k]] = false;
            this._keyDown[KeyboardKeys[k]] = false;
        }
        this._initKeyboard();
    }

    _initMouse(canvas, canvasScale) {
        canvas.addEventListener('mouseup', function(e) {
            this._mouseDown[e.which - 1] = false;
            this._mouseReleased[e.which - 1] = true;
            e.preventDefault();
        }.bind(this));
        canvas.addEventListener('mousedown', function(e) {
            this._mouseDown[e.which - 1] = true;
            this._mousePressed[e.which - 1] = true;
            e.preventDefault();
        }.bind(this));
        canvas.addEventListener('mousemove', function(e) {
            this._mouseX = Math.floor(e.offsetX / canvasScale);
            this._mouseY = Math.floor(e.offsetY / canvasScale);
            e.preventDefault();
        }.bind(this));
        canvas.addEventListener('wheel', function(e) {
            this._mouseZ += e.deltaY;
            e.preventDefault();
        }.bind(this));
    }

    _initKeyboard() {
        document.addEventListener('keyup', function(e) {
            this._keyDown[e.keyCode] = false;
            this._keyReleased[e.keyCode] = true;
            e.preventDefault();
        }.bind(this));

        document.addEventListener('keydown', function(e) {
            if(!this._keyDown[e.keyCode]) this._keyPressed[e.keyCode] = true;
            this._keyDown[e.keyCode] = true;
            this._keyString = e.key;
            e.preventDefault();
        }.bind(this));
    }

    mousePressed(key){
        return this._mousePressed[key];
    }

    mouseReleased(key){
        return this._mouseReleased[key];
    }

    mouseDown(key){
        return this._mouseDown[key];
    }

    mouseUp(key){
        return !this._mouseDown[key];
    }

    mouseX(){
        return this._mouseX;
    }

    mouseY(){
        return this._mouseY;
    }

    mouseZ(){
        return this._mouseZ;
    }

    worldX(camera){

    }

    worldY(camera) {

    }

    keyDown(key){
        return this._keyDown[key];
    }

    keyPressed(key){
        return this._keyPressed[key];
    }

    keyReleased(key){
        return this._keyReleased[key];
    }

    keyUp(key){
        return !this._keyDown[key];
    }

    keyString(){
        return this._keyString;
    }

    _update(){
        for(let k in MouseKeys){
            this._mousePressed[MouseKeys[k]] = false;
            this._mouseReleased[MouseKeys[k]] = false;
        }

        for (let k in KeyboardKeys) {
            this._keyPressed[KeyboardKeys[k]] = false;
            this._keyReleased[KeyboardKeys[k]] = false;
        }
    }
}