import JSP from "./jsp/JSP.js";
import TestWorld from "./game/TestWorld.js";
import { SplashWorld, LoadingWorld } from "./jsp/utils.js";
import { Spritemap } from "./jsp/graphics.js";

function loadAssets(){
	JSP.loader.loadFile("ready", "assets/assets_here.json");
}

function main() {
	JSP.init("game", 320, 240, 60, 2, "debug");
	JSP.world = new LoadingWorld(loadAssets, function () {
		// Splash Screen
		let graphic = new Spritemap(JSP.loader.getFile("logo"), 19, 23);
		graphic.addAnimation("play", [0, 1, 2, 3, 4, 5], 12, true);
		graphic.playAnimation("play");
		graphic.cx = 9;
		graphic.cy = 11;
		graphic.scaleX = graphic.scaleY = 2;
		JSP.world = new SplashWorld(graphic, 50, function () {
			JSP.world = new TestWorld();
		});
	});
}

JSP.start(main);
