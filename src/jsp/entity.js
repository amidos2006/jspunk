import JSP from "./JSP.js";
import { Hitbox } from "./hitbox.js";

export default class Entity{
    constructor(x,y,graphic){
        if(x == undefined) x = 0;
        if(y == undefined) y = 0;
        if(graphic == undefined) graphic = null;

        this.alive = true;
        this.visible = true;
        this.collidable = true;
        this.x = x;
        this.y = y;
        this.graphic = graphic;
        this.render_target=null;
        this.layer = 0;
        this.followCamera = true;
        this.world = null;
        this.mask = new Hitbox(-1, -1, 2, 2);
        this.type = null;
    }

    added(){

    }

    removed(){

    }

    update(){
        
    }

    collidePoint(x, y, px, py){
        this.mask._move(x, y);
        let result = this.mask._collidePoint(px, py);
        this.mask._move(0, 0);
        return result;
    }

    collideRect(x, y, rx, ry, rwidth, rheight){
        let other = new Hitbox(rx, ry, rwidth, rheight);
        this.mask._move(x, y);
        let result = this.mask.checkCollide(other);
        this.mask._move(0, 0);
        return result;
    }

    collideWith(e, x, y){
        if(!e.collidable) return null;
        this.mask._move(x, y);
        let result = this.mask.checkCollide(e.mask);
        this.mask._move(0, 0);
        return result? e: null;
    }

    collideType(type, x, y){
        let result = [];
        let entities = this.world.getType(type);
        for (let e of entities) {
            if (!e.collidable) continue;
            this.mask._move(x, y);
            e.mask._move(e.x, e.y);
            if (this.mask.checkCollide(e.mask)) {
                result.push(e);
            }
            this.mask._move(0, 0);
            e.mask._move(0, 0);
        }
        return result;
    }

    collideTypeFirst(type, x, y) {
        let entities = this.world.getType(type);
        for (let e of entities) {
            if (!e.collidable) continue;
            this.mask._move(x, y);
            e.mask._move(e.x, e.y);
            if (this.mask.checkCollide(e.mask)) {
                this.mask._move(0, 0);
                e.mask._move(0, 0);
                return e;
            }
            this.mask._move(0, 0);
            e.mask._move(0, 0);
        }
        return null;
    }

    collideClass(type, x, y) {
        let result = [];
        let entities = this.world.getClass(type);
        for (let e of entities) {
            if (!e.collidable) continue;
            this.mask._move(x, y);
            e.mask._move(e.x, e.y);
            if (this.mask.checkCollide(e.mask)) {
                result.push(e);
            }
            this.mask._move(0, 0);
            e.mask._move(0, 0);
        }
        return result;
    }

    collideClassFirst(type, x, y) {
        let entities = this.world.getClass(type);
        for (let e of entities) {
            if (!e.collidable) continue;
            this.mask._move(x, y);
            e.mask._move(e.x, e.y);
            if (this.mask.checkCollide(e.mask)) {
                this.mask._move(0, 0);
                e.mask._move(0, 0);
                return e;
            }
            this.mask._move(0, 0);
            e.mask._move(0, 0);
        }
        return null;
    }

    draw(){
        if(this.graphic == null) return;
        
        let currentTarget = canvas;
        if(this.render_target != null) currentTarget = this.render_target;
        let camera = this.followCamera?1:0;
        this.graphic.draw(currentTarget, this.x - camera * JSP.camera.x, this.y - camera * JSP.camera.y);
    }
}