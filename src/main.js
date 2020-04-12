import JSP from "./jsp/JSP.js";
import TestWorld from "./game/TestWorld.js";
import { SplashWorld } from "./jsp/world.js";
import { Spritemap } from "./jsp/graphics.js";

function main() {
	JSP.init(320, 240, 2, false);
	JSP.loadGFX("logo", "assets/JSPunk.png");
	JSP.loadFNT("bmpfont", "assets/font/font.fnt");
	JSP.loadFNT("ttffont", "assets/font/font.ttf")
	JSP.start(function(){
		let graphic = new Spritemap(JSP.getGFX("logo"), 19, 23);
		graphic.addAnimation("play", [0, 1, 2, 3, 4, 5], 12, true);
		graphic.playAnimation("play");
		graphic.cx = 9;
		graphic.cy = 11;
		graphic.scaleX = graphic.scaleY = 2;
		JSP.world = new SplashWorld(graphic, 100, new TestWorld());
	});
}
END_OF_MAIN(main);
