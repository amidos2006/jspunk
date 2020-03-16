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
    }

    update(){
        
    }

    draw(){
        if(this.graphic == null) return;
        
        let currentTarget = canvas;
        if(this.render_target != null) currentTarget = this.render_target;
        this.graphic.draw(currentTarget, this.x, this.y);
    }
}