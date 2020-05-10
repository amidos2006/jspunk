import JSP from "./jsp/JSP.js";
import TestWorld from "./game/TestWorld.js";
import { SplashWorld, LoadingWorld } from "./jsp/utils.js";

function loadAssets(){
	JSP.loader.loadFile("ready", "assets/assets_here.json");
}

function main() {
	JSP.world = new LoadingWorld(loadAssets, function () {
		JSP.world = new SplashWorld(function () {
			JSP.world = new TestWorld();
		});
	});
}

JSP.init("game", 320, 240, 60, 2, "debug");
JSP.start(main);
