<p align="center">
	<img height="200px" src="logo.gif"/>
</p>

<h1 align="center">
	JSPunk
</h1>

<p align="center">
  <b>Current Framework Version: 0.1.0</b>
</p>

Javascript port for Flashpunk version. In the current version, it is build on [allegrojs](http://allegrojs.net/) but hopefully in future, I will replace it to be all [native canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) then [WebGL](https://webgl2fundamentals.org/) with shaders and [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

## Features
- Canvas Scaling
- Entity Class
- World Class
- Graphic class
- Indexed Graphic class
- Spritemap Graphic class
- Tilemap Graphic class
- Backdrop Graphic class
- Animated Tilemap Graphic class
- Hitbox Collision class
- Grid Collision class
- Sorting by layer value (need optimization maybe insertion sort so always insert in the correct location)
- Collision Types and Classes (need optimization maybe another array to keep track of these different types and classes to speed up the collision)
- Preloading and Debugging features from [allegrojs](http://allegrojs.net/)

## Missing Features
- Splash Screens
- Alarms
- Tweens
- Ease Functions
- Pixel Mask
- Tinting (Multiply filter with destination a top filter)
- Camera with rotation and scaling and tests
- GraphicList
- MaskList
- Sfx class
- Text class with Bitmap Text class maybe monospace for simplicity
- ParticleEmitter as Graphic class
- Smoothing as an input parameter that can be enabled and disabled at anytime
- Mouse have window position and world position
- Pixel Draw library
- Backdrop parallax
