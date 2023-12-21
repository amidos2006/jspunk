import JSP from "./JSP.js";

export default class Sfx{
    constructor(soundFile, callback){
        this._volume = 1;
        this._freq = 1;
        this._soundElement = new Audio(soundFile.file);
        this._soundElement.addEventListener("ended", function(){
            JSP.soundManager._removeSound(this);
            if(callback) callback();
        }.bind(this));
    }

    set freq(value){
        this._freq = value;
        this._soundElement.playbackRate = this._freq;
    }

    get freq(){
        return this._freq;
    }

    set volume(value){
        this._volume = value;
        this._soundElement.volume = this._volume;
    }

    get volume(){
        return this._volume;
    }

    get isPlaying(){
        return !this._soundElement.paused;
    }

    get position(){
        return this._soundElement.currentTime;
    }

    get duration(){
        return this._soundElement.duration;
    }

    get loop(){
        return this._soundElement.loop;
    }

    _adjustAudio(loop){
        this._soundElement.volume =  JSP.soundManager.volume * this._volume;
        this._soundElement.loop = loop;
        this._soundElement.playbackRate = this._freq;
    }

    play(){
        this._adjustAudio(false);
        this._soundElement.currentTime = 0;
        this._soundElement.play();
        JSP.soundManager._addSound(this);
    }

    loop(){
        this._adjustAudio(true);
        this._soundElement.currentTime = 0;
        this._soundElement.play();

        JSP.soundManager._addSound(this);
    }

    stop(){
        this._soundElement.pause();
        this._soundElement.currentTime = 0;
        
        JSP.soundManager._removeSound(this);
    }

    pause(){
        this._soundElement.pause();
    }

    resume(){
        this._soundElement.play();
    }
}

export class SoundManager{
    constructor(){
        this._volume = 1;
        this._playingSounds = [];
    }

    set volume(value){
        this._volume = value;
        for(let s of this._playingSounds){
            s._adjustAudio(s.loop);
        }
    }

    get volume(){
        return this._volume;
    }

    pause(){
        for(let s of this._playingSounds){
            s.pause();
        }
    }

    resume(){
        for(let s of this._playingSounds){
            s.resume();
        }
    }

    _addSound(s){
        if(this._playingSounds.indexOf(s) < 0){
            this._playingSounds.push(s);
        }
    }

    _removeSound(s){
        let index = this._playingSounds.indexOf(s);
        if(index >= 0){
            this._playingSounds.splice(index, 1);
        }
    }
}