import { Tweener } from "./tweens.js";


export default class World{
    constructor(){
        this._activeEntities = [];
        this._removedEntities = [];
        this._addedEntitites = [];
        this._tweener = new Tweener();
    }

    begin(){

    }

    end(){
        
    }

    addTween(t, start){
        if(start == undefined) start = false;
        this._tweener.addTween(t);
        if(start) t.start();
    }

    removeTween(t){
        this._tweener.removeTween(t);
    }

    addEntity(e){
        if(this._addedEntitites.indexOf(e) >= 0){
            return;
        }
        e.alive = true;
        e.visible = true;
        e.collidable = true;
        this._addedEntitites.push(e);
    }

    removeEntity(e){
        if (this._removedEntities.indexOf(e) >= 0) {
            return;
        }
        e.alive = false;
        e.visible = false;
        e.collidable = false;
        this._removedEntities.push(e);
    }

    getClass(type){
        let result = [];
        for(let e of this._activeEntities){
            if (!e.alive) continue;
            if(e instanceof type){
                result.push(e);
            }
        }
        return result;
    }

    classFirst(type) {
        for (let e of this._activeEntities) {
            if (!e.alive) continue;
            if (e instanceof type) {
                return e;
            }
        }
        return null;
    }

    getType(type){
        let result = [];
        for (let e of this._activeEntities) {
            if (!e.alive) continue;
            if (e.type == type) {
                result.push(e);
            }
        }
        return result;
    }

    typeFirst(type) {
        for (let e of this._activeEntities) {
            if (!e.alive) continue;
            if (e.type == type) {
                return e;
            }
        }
        return null;
    }

    getLayer(layer){
        let result = [];
        for (let e of this._activeEntities) {
            if (!e.alive) continue;
            if (e.layer == layer) {
                result.push(e);
            }
        }
        return result;
    }

    layerFirst(layer) {
        for (let e of this._activeEntities) {
            if (!e.alive) continue;
            if (e.layer == layer) {
                return e;
            }
        }
        return null;
    }

    update(){
        this._tweener.update();

        for(let e of this._activeEntities){
            if(!e.alive) continue;
            e.update();
        }
        let temp = this._addedEntitites.slice(0);
        this._addedEntitites.length = 0;
        for(let e of temp){
            if(this._activeEntities.indexOf(e) >= 0){
                continue;
            }
            e.world = this;
            e.added();
            this._activeEntities.push(e);
        }
        temp = this._removedEntities.slice(0);
        this._removedEntities.length = 0;
        for (let e of temp) {
            if (this._activeEntities.indexOf(e) >= 0) {
                e.removed();
                e.world = null;
                this._activeEntities.splice(this._activeEntities.indexOf(e), 1);
            }
        }
    }

    draw(){
        this._activeEntities.sort((e1, e2) => e1.layer - e2.layer)
        for (let e of this._activeEntities) {
            if (!e.visible) continue;
            e.draw();
        }
    }
}