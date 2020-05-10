export default class Sfx{
    constructor(soundFile, callback){
        this._volume = 1;
        this._freq = 1;
        this._soundElement = new Audio(soundFile.file);
        this._soundElement.addEventListener("ended", function(){
            if(callback) callback();
        });
    }

    set freq(value){
        this._freq = value;
    }

    get freq(){
        return this._freq;
    }

    set volume(value){
        this._volume = value;
    }

    get volume(){
        return this._volume;
    }

    get isPlaying(){
        return !this._soundElement.isPaused;
    }

    get position(){
        return this._soundElement.currentTime;
    }

    get duration(){
        return this._soundElement.duration;
    }

    _adjustAudio(loop){
        this._soundElement.volume = this._volume;
        this._soundElement.loop = loop;
        this._soundElement.playbackRate = this._freq;
    }

    play(){
        this._adjustAudio(false);
        this._soundElement.currentTime = 0;
        this._soundElement.play();
    }

    loop(){
        this._adjustAudio(true);
        this._soundElement.currentTime = 0;
        this._soundElement.play();
    }

    stop(){
        this._soundElement.pause();
        this._soundElement.currentTime = 0;
    }

    pause(){
        this._soundElement.pause();
    }

    resume(){
        this._soundElement.play();
    }
}