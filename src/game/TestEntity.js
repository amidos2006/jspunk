import Entity from "../jsp/entity.js"
import JSP from "../jsp/JSP.js"
import { Spritemap, TileMap } from "../jsp/graphics.js";

export default class TestEntity extends Entity{
    constructor(){
        super(SCREEN_W/2, SCREEN_H/2);
        this.graphic = new Spritemap(JSP.getGFX("logo"), 19, 23);
        this.graphic.addAnimation("play", [0, 1, 2, 3, 4, 5], 12, true);
        this.graphic.playAnimation("play");
        this.graphic.scaleX = this.graphic.scaleY = 2;
    }

    update(){
        super.update();
        
        this.graphic.angle += 2;
    }
}