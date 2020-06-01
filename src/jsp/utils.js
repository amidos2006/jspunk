import { VarTween, Tween } from "./tweens.js";
import Entity from "./entity.js";
import JSP from "./JSP.js";
import World from "./world.js";
import { Color, BlendModes } from "./rendering.js";
import { Spritemap } from "./graphics.js";

export const fontBase64 = "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";
export const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAHIAAAAXCAYAAADX5BuUAAAAAXNSR0IArs4c6QAAArZJREFUaIHtmD9OYzEQxscotBxg09FBBQ3vdSCRHu6wSJsjsVK4w6YHadPFNJtq09HBAWgpvAUZa57/jGfeyybalT/JsqyZfCiMf/Y4BjZyzjkYKGOMqV778RrRxfc2nfRtmY/RnI7azAeWy3yM5lA9ZPK/LvMxmkP1YtJ5xy4fozlE50+nybRf17+zMZpDdXX7lsz7+eNLNkZzDtiMqn9GHSJDqlIUSnIAIKYqRaEkByCmKkWhJAcgoipJoSQHYqpSFEpyAD6pokpRyOX4QuJ5jeLO7dLZXr127zVKp8sV3Y1DFBI6RCGhQxQSOkAhoUNECe1VyG10WdVru16jMBBiHorrbLVeXGer9mI6W7UX09lqvbjOVuvFdbYHAJ/FKT0vxGrb8vNCqoe2/LyQ6sWUnxdCnT+dFp8XUl3dvhWfFxKJj9bcXdhrA+Tuwj4bIHcX9tkAubuwxwbI3YV9NkDYraLoBuj1jjQb9fls9fo7XuJC1uNXp10fv9HRKumwpF1Y9dqdl+i3Vm0OAMiIk1IpIU5KpYQ4IZUS4qRUShoeLqf+1vqfyGzzsVq1P+EZso1iVq89evmj9eP9wg9chzMXpzp7PPED1+HMxakub179wHU4c3Gq+8b5getw5uJUrmn8wHU4c/GO16zxA9fhzMUBgjvy8Og5+iOaONVqsh4Up1rMx4PiVFPLNzKlOJWxdlC8k3tX8CrEO4VM0cXp4/0Cixt9+xRdnM4eT7C4kVeKLk6XN69Y3MgrRRen+8ZhcSOvFF2cXNNgcWOvmdJr1mBxDUCCSA11h0fPWPzov7OarFXUrSZrLH7ktZiPVdQt5mMsfuQ1tUZF3dQaLH7kZazVUWctFj/2urNF6sL8TfEdQPr54b+lllDOS0so56UllPPSEsp5aQllvZSEpjonA/06qeq1R68/1tH7gQDA7U8AAAAASUVORK5CYII=";
export const bitmapFontBase64 = "iVBORw0KGgoAAAANSUhEUgAAAD4AAADQCAYAAABfj9K2AAADMElEQVR42u2dYaLCMAiDvf+l9QRzbUkokPDv6Z7rV1kJlM3PxyZu3wd7Oz76/6fH775v8CcA9uu7A0SNw+DRAT+9vzuQVRc+/VyDRxcbtKufAoRdXR58d4Ju6wxYHJcDZ4G8LX7fF6OPWx5815XQrhcFOXZ1WfBTV139+xQ4GmYNXgV89dI5HZ/B0a4UPjH5izF4tdpeVOika/Vx4KgPRocfevopBx4tI2cVLeES1uBB8c8WQvD0VRb81uJ2K3wa/LZgQSmv9HLzOPDsQgNL4Bj8dFFipYH0TcFoXj4OHF14QJWo0rIyg4MXM1Q4g8djWXDW4tamGCgLXkWqspqIDB4dQNbM0jYNZcGj4Yx9HE3QGPwSOCrstXP1a+DoxS2avFzfNJQBRycFrDbv8vXoNuCnDX4sCYs6r8GzioLle1Jkwcv0omTn3fLgqMUtWqJKK13Jg7NOvCpFo4tmenZm8M1khF24MPitMIXeeEh39XHgt6NBOy3fHhzd1MMGoTUGyICji4XRAgarEGLwKFBWEpL2DcuDo07IksQ0V5cFR5WEohv7tNVcFjw7Ccn+PIOjXX7cTokMeFbaWX6fXAYc1Y6FbuuiT4DByQKi3OJocPJi2CZ8yYKjt4fLCSM5cHTpKPqwjbQ0VBZ8t9Qz7hqXBWcNNPq4k+uSdRz4ant11XKzwW9J1vLl4Azwldfagv+7NFYno5RQkQOPTsAqeJtmIBlwRClpB7xdFBgDjrx18gT8mqvLgaNvq2oTzhjgyHtcyoCPMXnw09ueb6W3Bq9WGIi2fxu8S77e5ilcsuDox4q1D2cy4KuLG6tZ1+CWrAavlZa2n0B5cNaiZHAVkwNul3Wx2q4N3s0lx4Y1efDd5GPM/Way4Ki0tV04kwWPhjODq0tW27Rw1l66yoNnlagMPqX01HYXVBbc17jBxcPZWHCbNXuswc/gU+N4+8KDwV+kp8Gnu7rBp4JH09Pxe2hjwW3W6iLppxx49R+LMHiWq0fDnsHVLgGDd5equ5eEwW02S1WDVwxfBlcH98+DGNzgM5OSsRJVFtymptXlXNvgBje4wQ1u8IETIPv4Emty2yz7AW2ZuIj9KNJKAAAALXRFWHRTb2Z0d2FyZQBieS5ibG9vZGR5LmNyeXB0by5pbWFnZS5QTkcyNEVuY29kZXKoBn/uAAAAAElFTkSuQmCC";
export const bitmapFontXML = `<font>
  <info face="font" size="16" bold="0" italic="0" charset="" unicode="" stretchH="100" smooth="1" aa="1" padding="2,2,2,2" spacing="0,0" outline="0"/>
  <common lineHeight="16" base="12" scaleW="62" scaleH="208" pages="1" packed="0"/>
  <pages>
    <page id="0" file="font.png"/>
  </pages>
  <chars count="80">
    <char id="97" x="2" y="2" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="98" x="2" y="12" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="99" x="2" y="24" width="6" height="8" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15"/>
    <char id="100" x="2" y="34" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="101" x="10" y="24" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="102" x="12" y="2" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="103" x="2" y="46" width="8" height="12" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="104" x="2" y="60" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="105" x="2" y="72" width="2" height="10" xoffset="0" yoffset="2" xadvance="4" page="0" chnl="15"/>
    <char id="106" x="2" y="84" width="4" height="14" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15"/>
    <char id="107" x="6" y="72" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="108" x="12" y="34" width="2" height="10" xoffset="0" yoffset="2" xadvance="4" page="0" chnl="15"/>
    <char id="109" x="12" y="14" width="10" height="8" xoffset="0" yoffset="4" xadvance="12" page="0" chnl="15"/>
    <char id="110" x="20" y="2" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="111" x="12" y="46" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="112" x="12" y="56" width="8" height="12" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="113" x="20" y="24" width="8" height="12" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="114" x="24" y="12" width="6" height="8" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15"/>
    <char id="115" x="30" y="2" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="116" x="2" y="100" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="117" x="8" y="84" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="118" x="16" y="70" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="119" x="22" y="38" width="10" height="8" xoffset="0" yoffset="4" xadvance="12" page="0" chnl="15"/>
    <char id="120" x="30" y="22" width="6" height="8" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15"/>
    <char id="121" x="22" y="48" width="8" height="12" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="122" x="32" y="12" width="8" height="8" xoffset="0" yoffset="4" xadvance="10" page="0" chnl="15"/>
    <char id="65" x="2" y="112" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="66" x="10" y="94" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="67" x="18" y="80" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="68" x="2" y="124" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="69" x="2" y="136" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="70" x="2" y="148" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="71" x="2" y="160" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="72" x="10" y="136" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="73" x="10" y="148" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="74" x="12" y="106" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="75" x="20" y="92" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="76" x="12" y="118" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="77" x="26" y="62" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="78" x="32" y="48" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="79" x="34" y="32" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="80" x="26" y="74" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="81" x="42" y="2" width="8" height="12" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="82" x="42" y="16" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="83" x="2" y="172" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="84" x="2" y="184" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="85" x="2" y="196" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="86" x="10" y="184" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="87" x="12" y="160" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="88" x="18" y="148" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="89" x="12" y="172" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="90" x="20" y="118" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="33" x="16" y="34" width="2" height="10" xoffset="0" yoffset="2" xadvance="4" page="0" chnl="15"/>
    <char id="8470" x="22" y="104" width="6" height="12" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15"/>
    <char id="59" x="38" y="22" width="2" height="8" xoffset="0" yoffset="4" xadvance="4" page="0" chnl="15"/>
    <char id="37" x="20" y="130" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="58" x="22" y="62" width="2" height="6" xoffset="0" yoffset="4" xadvance="4" page="0" chnl="15"/>
    <char id="63" x="28" y="118" width="8" height="10" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="42" x="30" y="86" width="6" height="6" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="40" x="36" y="74" width="4" height="10" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15"/>
    <char id="41" x="38" y="60" width="4" height="10" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15"/>
    <char id="95" x="42" y="28" width="8" height="2" xoffset="0" yoffset="10" xadvance="10" page="0" chnl="15"/>
    <char id="43" x="42" y="44" width="6" height="6" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15"/>
    <char id="45" x="34" y="44" width="6" height="2" xoffset="0" yoffset="6" xadvance="8" page="0" chnl="15"/>
    <char id="61" x="42" y="52" width="6" height="6" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15"/>
    <char id="46" x="30" y="32" width="2" height="2" xoffset="0" yoffset="10" xadvance="4" page="0" chnl="15"/>
    <char id="44" x="12" y="130" width="4" height="4" xoffset="0" yoffset="10" xadvance="6" page="0" chnl="15"/>
    <char id="47" x="44" y="32" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="124" x="30" y="94" width="2" height="10" xoffset="0" yoffset="2" xadvance="4" page="0" chnl="15"/>
    <char id="34" x="20" y="142" width="6" height="4" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="39" x="26" y="86" width="2" height="4" xoffset="0" yoffset="2" xadvance="4" page="0" chnl="15"/>
    <char id="64" x="30" y="106" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="35" x="34" y="94" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="36" x="42" y="72" width="8" height="12" xoffset="0" yoffset="2" xadvance="10" page="0" chnl="15"/>
    <char id="94" x="38" y="86" width="6" height="4" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="38" x="44" y="60" width="10" height="10" xoffset="0" yoffset="2" xadvance="12" page="0" chnl="15"/>
    <char id="123" x="50" y="44" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="125" x="52" y="2" width="6" height="10" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
    <char id="91" x="52" y="14" width="4" height="10" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15"/>
    <char id="93" x="56" y="26" width="4" height="10" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15"/>
    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="2" xadvance="8" page="0" chnl="15"/>
  </chars>
</font>`;

export class LoadingWorld extends World {
    constructor(loadFunction, doneFunction, drawFunction, pressFunction) {
        super();
        this._loadFunction = loadFunction;
        this._doneFunction = doneFunction;
        this._pressFunction = pressFunction;
        this._drawFunction = drawFunction;
    }

    begin(){
        super.begin();
        this._loadFunction();
        JSP.loader.startLoading();
    }

    draw(){
        super.draw();
        if(this._drawFunction != null){
            this._drawFunction();
        }
        else{
            let height = 17;
            let width = 0.6 * JSP.renderTarget.width;
            JSP.renderTarget.drawRect((JSP.renderTarget.width - width)/2, 
                JSP.renderTarget.height/2-height/2, width, height, Color.WHITE, 2);
            JSP.renderTarget.drawFillRect((JSP.renderTarget.width - width) / 2,
                JSP.renderTarget.height / 2 - height / 2, width * JSP.loader.getLoadingProgress(), 
                height, Color.WHITE);
            JSP.renderTarget.blendMode = BlendModes.XOR;
            JSP.renderTarget.drawText(JSP.loader.getFile("font"), "--LOADING--", JSP.renderTarget.width/2 - 24, 
                JSP.renderTarget.height/2 + 2, 8, Color.WHITE);
            JSP.renderTarget.blendMode = BlendModes.DEFAULT;
        }
        if(JSP.loader.getLoadingProgress() >= 1){
            if(this._pressFunction == null || this._pressFunction()){
                if (this._doneFunction) this._doneFunction();
            }
        }
    }
}

export class SplashWorld extends World {
    constructor(doneFunction, frames, graphic) {
        super();

        if(frames == undefined) frames = 50;
        if(graphic == undefined){
            graphic = new Spritemap(JSP.loader.getFile("logo"), 19, 23);
            graphic.addAnimation("play", [0, 1, 2, 3, 4, 5], 12, true);
            graphic.playAnimation("play");
            graphic.cx = 9;
            graphic.cy = 11;
            graphic.scaleX = graphic.scaleY = 2;
        }

        graphic.alpha = 0;
        this.splashEntity = new Entity(JSP.renderTarget.width / 2, JSP.renderTarget.height / 2, graphic);
        this.addEntity(this.splashEntity);
        this.addTween(new VarTween(graphic, "alpha", 0, 1, frames, Tween.PINGPONG, function () {
            if (graphic.alpha == 0) {
                doneFunction();
            }
            if (graphic.alpha == 1) {
                this.delay = frames;
            }
        }), true);
    }
}