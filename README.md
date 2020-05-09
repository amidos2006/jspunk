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
- Canvas Scaling
- Entity Class
- World Class
- Graphic class
- Indexed Graphic class
- Spritemap Graphic class
- Tilemap Graphic class
- Backdrop Graphic class
- Tinting
- Animated Tilemap Graphic class
- Text class and Bitmap Text class
- Alarms
- Tweens
- Ease Functions
- Hitbox Collision class
- Grid Collision class
- Sorting by layer value (need optimization maybe insertion sort so always insert in the correct location)
- Collision Types and Classes (need optimization maybe another array to keep track of these different types and classes to speed up the collision)
- Make camera as input in all draw functions of graphic classes
- Backdrop parallax
- GraphicList
- Smoothing as an input parameter that can be enabled and disabled at anytime
- Input class

## Missing Features
- Pixel Mask
- JSPunk Splash Screens similar to FlashPunk
- Camera with rotation and scaling and tests
- MaskList
- Sfx class
- ParticleEmitter as Graphic class
- Mouse have window position and world position
- ~~(Maybe) automatically bind callback functions to its parent class~~
- ~~(Maybe) all child classes have access to their parent class~~