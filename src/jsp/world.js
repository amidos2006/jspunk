export default class World{
    constructor(){
        this._activeEntities = [];
        this._removedEntities = [];
        this._addedEntitites = [];
    }

    begin(){

    }

    end(){
        
    }

    addEntity(e){
        if(this._addedEntitites.indexOf(e) >= 0){
            return;
        }
        this._addedEntitites.push(e);
    }

    removeEntity(e){
        if (this._removedEntities.indexOf(e) >= 0) {
            return;
        }
        e.alive = false;
        e.visible = false;
        this._removedEntities.push(e);
    }

    update(){
        for(let e of this._activeEntities){
            if(!e.alive) continue;
            e.update();
        }
        for(let e of this._addedEntitites){
            if(this._activeEntities.indexOf(e) >= 0){
                continue;
            }
            this._activeEntities.push(e);
        }
        this._addedEntitites.length = 0;
        for (let e of this._removedEntities) {
            if (this._activeEntities.indexOf(e) >= 0) {
                this._activeEntities.splice(this._activeEntities.indexOf(e), 1);
            }
        }
        this._removedEntities.length = 0;
    }

    draw(){
        this._activeEntities.sort((e1, e2) => e1.layer - e2.layer)
        for (let e of this._activeEntities) {
            if (!e.visible) continue;
            e.draw();
        }
    }
}