import JSP from "./JSP.js";
import { Hitbox } from "./hitbox.js";

export default class Entity{
    constructor(x,y,graphic){
        if(x == undefined) x = 0;
        if(y == undefined) y = 0;
        if(graphic == undefined) graphic = null;

        this.alive = true;
        this.visible = true;
        this.x = x;
        this.y = y;
        this.graphic = graphic;
        this.render_target=null;
        this.layer = 0;
        this.followCamera = true;
        this.world = null;
        this.hitbox = new Hitbox(-1, -1, 2, 2);
        this.name = null;
    }

    added(){

    }

    removed(){

    }

    update(){
        
    }

    checkPoint(x, y){
        this.hitbox._move(this.x, this.y);
        let result = this.hitbox.checkPoint(x, y);
        this.hitbox._move(0, 0);
        return result;
    }

    checkCollision(name, x, y) {
        let result = [];
        let entities = this.world.getName(name);
        for (let e of entities) {
            this.hitbox._move(this.x + x, this.y + y);
            e.hitbox._move(e.x, e.y);
            if (this.hitbox.checkCollide(e.hitbox)) {
                result.push(e);
            }
            this.hitbox._move(0, 0);
            e.hitbox._move(0, 0);
        }
        return result;
    }

    checkClassCollision(type, x, y) {
        let result = [];
        let entities = this.world.getClass(type);
        for (let e of entities) {
            this.hitbox._move(this.x + x, this.y + y);
            e.hitbox._move(e.x, e.y);
            if (this.hitbox.checkCollide(e.hitbox)) {
                result.push(e);
            }
            this.hitbox._move(0, 0);
            e.hitbox._move(0, 0);
        }
        return result;
    }

    draw(){
        if(this.graphic == null) return;
        
        let currentTarget = canvas;
        if(this.render_target != null) currentTarget = this.render_target;
        let camera = this.followCamera?1:0;
        this.graphic.draw(currentTarget, this.x - camera * JSP.camera.x, this.y - camera * JSP.camera.y);
    }
}