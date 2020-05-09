<p align="center">
	<img height="200px" src="logo.gif"/>
</p>

<h1 align="center">
	JSPunk
</h1>

<p align="center">
  <b>Current Framework Version: 0.4.0</b>
</p>

Javascript port for Flashpunk version. In the current version, it is build with pieces from [allegrojs](http://allegrojs.net/) but that uses [native canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) but hopefull in the future I can replace it with [WebGL](https://webgl2fundamentals.org/) with shaders and [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

## Features
- RenderTargets with blendModes
- Entity, World management
- Graphis classes: Graphic, IndexedGraphic, Spritemap, Backdrop, Text, BitmapText, GraphicList, Tilemap, and AnimTileMap classes
- Tinting using blend mode
- Alarms and VarTweens with Ease Functions
- Collision classes: Hitbox and Grid class
- Sorting by layer value (need optimization maybe insertion sort so always insert in the correct location)
- Collision Types and Classes (need optimization maybe another array to keep track of these different types and classes to speed up the collision)
- Camera with anchor, rotationg, and zooming
- Smoothing and HighDef resolution for the renderTargets
- Handling Inputs: Keyboard and Mouse

## Missing Features
- Pixel Mask
- JSPunk Splash Screens similar to FlashPunk
- Graphics need to take in account the Camera with rotation and scaling
- MaskList
- Sfx class
- ParticleEmitter as Graphic class
- Mouse have window position and world position
- Gamepad support
- RenderTarget native drawing objects
- ~~(Maybe) automatically bind callback functions to its parent class~~
- ~~(Maybe) all child classes have access to their parent class~~
