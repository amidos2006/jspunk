import World from "../jsp/world.js"
import TestEntity from "./TestEntity.js"

export default class TestWorld extends World{
    begin(){
        super.begin();
        
        this.addEntity(new TestEntity());
    }
}