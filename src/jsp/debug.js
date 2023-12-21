export default class Debug{
    constructor(){
        this.enable = false;

        this.element = document.createElement('div');
        this.element.style.textAlign = "left";
        this.element.style.width = "620px";
        this.element.style.height = "320px";
        this.element.style.font = "12px monospace"
        this.element.style.overflow = "auto";
        this.element.style.backgroundColor = "#f8fcff";
        this.element.style.padding = "10px";
    }

    log(msg){
        if (this.enable){
            this.element.innerHTML = this.element.innerHTML + msg + "<br/>";
        }
    }
}