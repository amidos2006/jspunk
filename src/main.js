import JSP from "./jsp/JSP.js";
import TestWorld from "./game/TestWorld.js";
import { SplashWorld, LoadingWorld } from "./jsp/utils.js";
import { MouseKeys } from "./jsp/input.js";

function loadAssets(){
	JSP.loader.loadFile("ready", "assets/assets_here.json");
}

function main() {
	JSP.world = new LoadingWorld(loadAssets, function () {
		JSP.world = new SplashWorld(function () {
			JSP.world = new TestWorld();
		});
	}, null, null);
}

JSP.init("game", 320, 240, 60, 2, "debug");
JSP.start(main);
