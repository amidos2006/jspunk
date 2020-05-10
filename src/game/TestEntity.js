import Entity from "../jsp/entity.js"
import JSP from "../jsp/JSP.js"
import { Text } from "../jsp/graphics.js";

export default class TestEntity extends Entity{
    constructor(){
        super(JSP.renderTarget.width / 2, JSP.renderTarget.height/2);
        this.graphic = new Text(JSP.loader.getFile("font"), JSP.loader.getFile("ready").data["text"], 16);
        this.graphic.cx = this.graphic.width/2;
        this.graphic.cy = this.graphic.height/2;
    }

    update(){
        super.update();
        
        this.graphic.angle += 2;
    }
}