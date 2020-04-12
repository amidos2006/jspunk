export class Tweener{
    constructor(){
        this._activeTweens = [];
        this._addedTweens = [];
        this._removedTweens = [];
    }

    addTween(t){
        this._addedTweens.push(t);
        t._alive = true;
    }

    removeTween(t){
        this._removedTweens.push(t);
        t._alive = false;
    }

    update(){
        for(let t of this._activeTweens){
            if(t._alive){
                t._update();
            }
        }
        for (let t of this._addedTweens) {
            if (this._activeTweens.indexOf(t) >= 0) {
                continue;
            }
            t._parent = this;
            this._activeTweens.push(t);
        }
        this._addedTweens.length = 0;
        for (let t of this._removedTweens) {
            if (this._activeTweens.indexOf(t) >= 0) {
                t._parent = null;
                this._activeTweens.splice(this._activeTweens.indexOf(t), 1);
            }
        }
        this._removedTweens.length = 0;
    }
}

export class Tween {
    static get PRESISTENT(){
        return 0;
    }

    static get LOOPING(){
        return 1;
    }

    static get ONESHOT(){
        return 2;
    }

    static get PINGPONG(){
        return 3;
    }

    constructor(frames, type, complete){
        if(type == undefined) type = Tween.ONESHOT;
        if(complete == undefined) complete = null;
        this._current = 0;
        this._total = frames;
        this._type = type;
        this._complete = complete;
        this._direction = 1;
        this._parent = null;
        this._active = false;
        this.alive = true;
        this.speed = 1;
    }

    _update(){
        if(!(this.alive && this._active)){
            return false;
        }

        this._current += this._direction * this.speed;
        if (this._direction > 0){
            if (this._current >= this._total){
                this._finish();
            }
        }
        else if (this._direction < 0){
            if (this._current <= 0) {
                this._finish();
            }
        }
        return true;
    }

    _finish(){
        switch(this._type){
            case Tween.ONESHOT:
                this._active = false;
                this._parent.removeTween(this);
                break;
            case Tween.LOOPING:
                this._current -= this._total;
                break;
            case Tween.PINGPONG:
                this._direction *= -1;
                break;
            case Tween.PRESISTENT:
                this._active = false;
                this._current = 0;
                break;
        }
        if (this._complete) {
            this._complete();
        }
    }

    start(forceRestart){
        this._active = true;
        if (forceRestart != undefined && !forceRestart){
            this._current = 0;
            this._direction = 1;
        }
    }

    pause(){
        this._active = false;
    }

    cancel(){
        this._active = false;
        this._parent.removeTween(this);
    }

    get percentage(){
        return this._current / this._total;
    }
}

export class Alarm extends Tween {
    constructor(frames, type, complete){
        super(frames, type, complete);
    }
}

export class VarTween extends Tween {
    constructor(object, varName, fromValue, toValue, frames, type, complete, ease){
        if(ease == undefined) ease = Ease.Linear;
        super(frames, type, complete);
        this.object = object;
        this.varName = varName;
        this.fromValue = fromValue;
        this.toValue = toValue;
        this.ease = ease;
    }

    _update(){
        if(super._update()){
            let perc = this.ease(this.percentage);
            this.object[this.varName] = (this.toValue - this.fromValue) * perc + this.fromValue;
        }
    }
}

export class Ease{
    static Linear(t){
        return t;
    }

    /** Quadratic in. */
    static quadIn(t) {
        return t * t;
    }

    /** Quadratic out. */
    static quadOut(t) {
        return -t * (t - 2);
    }

    /** Quadratic in and out. */
    static quadInOut(t) {
        return t <= .5 ? t * t * 2 : 1 - (--t) * t * 2;
    }

    /** Cubic in. */
    static cubeIn(t) {
        return t * t * t;
    }

    /** Cubic out. */
    static cubeOut(t) {
        return 1 + (--t) * t * t;
    }

    /** Cubic in and out. */
    static cubeInOut(t) {
        return t <= .5 ? t * t * t * 4 : 1 + (--t) * t * t * 4;
    }

    /** Sine in. */
    static sineIn(t) {
        return -Math.cos(Ease.PI2 * t) + 1;
    }

    /** Sine out. */
    static sineOut(t) {
        return Math.sin(Ease.PI2 * t);
    }

    /** Sine in and out. */
    static sineInOut(t) {
        return -Math.cos(Ease.PI * t) / 2 + .5;
    }

    /** Bounce in. */
    static bounceIn(t) {
        t = 1 - t;
        if (t < Ease.B1) return 1 - 7.5625 * t * t;
        if (t < Ease.B2) return 1 - (7.5625 * (t - Ease.B3) * (t - Ease.B3) + .75);
        if (t < Ease.B4) return 1 - (7.5625 * (t - Ease.B5) * (t - Ease.B5) + .9375);
        return 1 - (7.5625 * (t - Ease.B6) * (t - Ease.B6) + .984375);
    }

    /** Bounce out. */
    static bounceOut(t) {
        if (t < Ease.B1) return 7.5625 * t * t;
        if (t < Ease.B2) return 7.5625 * (t - Ease.B3) * (t - Ease.B3) + .75;
        if (t < Ease.B4) return 7.5625 * (t - Ease.B5) * (t - Ease.B5) + .9375;
        return 7.5625 * (t - Ease.B6) * (t - Ease.B6) + .984375;
    }

    /** Bounce in and out. */
    static bounceInOut(t) {
        if (t < .5) {
            t = 1 - t * 2;
            if (t < Ease.B1) return (1 - 7.5625 * t * t) / 2;
            if (t < Ease.B2) return (1 - (7.5625 * (t - Ease.B3) * (t - Ease.B3) + .75)) / 2;
            if (t < Ease.B4) return (1 - (7.5625 * (t - Ease.B5) * (t - Ease.B5) + .9375)) / 2;
            return (1 - (7.5625 * (t - Ease.B6) * (t - Ease.B6) + .984375)) / 2;
        }
        t = t * 2 - 1;
        if (t < Ease.B1) return (7.5625 * t * t) / 2 + .5;
        if (t < Ease.B2) return (7.5625 * (t - Ease.B3) * (t - Ease.B3) + .75) / 2 + .5;
        if (t < Ease.B4) return (7.5625 * (t - Ease.B5) * (t - Ease.B5) + .9375) / 2 + .5;
        return (7.5625 * (t - Ease.B6) * (t - Ease.B6) + .984375) / 2 + .5;
    }

    /** Exponential in. */
    static expoIn(t) {
        return Math.pow(2, 10 * (t - 1));
    }

    /** Exponential out. */
    static expoOut(t) {
        return -Math.pow(2, -10 * t) + 1;
    }

    /** Exponential in and out. */
    static expoInOut(t) {
        return t < .5 ? Math.pow(2, 10 * (t * 2 - 1)) / 2 : (-Math.pow(2, -10 * (t * 2 - 1)) + 2) / 2;
    }

    /** Back in. */
    static backIn(t) {
        return t * t * (2.70158 * t - 1.70158);
    }

    /** Back out. */
    static backOut(t) {
        return 1 - (--t) * (t) * (-2.70158 * t - 1.70158);
    }

    /** Back in and out. */
    static backInOut(t) {
        t *= 2;
        if (t < 1) return t * t * (2.70158 * t - 1.70158) / 2;
        t--;
        return (1 - (--t) * (t) * (-2.70158 * t - 1.70158)) / 2 + .5;
    }

    /// Easing private constant
	static get PI(){
        return Math.PI;
    }
    /// Easing private constant
    static get PI2() {
        return Math.PI / 2;
    }
    /// Easing private constant
    static get B1() {
        return 1 / 2.75;
    }
    /// Easing private constant
    static get B2() {
        return 2 / 2.75;
    }
    /// Easing private constant
    static get B3() {
        return 1.5 / 2.75;
    }
    /// Easing private constant
    static get B4() {
        return 2.5 / 2.75;
    }
    /// Easing private constant
    static get B5() {
        return 2.25 / 2.75;
    }
    /// Easing private constant
    static get B6() {
        return 2.625 / 2.75;
    }
}