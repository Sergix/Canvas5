/*
    Canvas5 dev1.4.1 - A JavaScript 2D game engine with a focus on simplicity.
    Copyright (C) 2017 Sergix

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
* Game Engine dev1.4.1 Original Full Script
*/

/*
    Canvas5 object
    desc: Used for version, mouse position, and helper functions
*/

var Canvas5 = {

    version: "dev1.4.1",

    mouseX: 0,
    mouseY: 0,

    activeKeys: [],
    activeButtons: [],

    deg: Math.PI / 180,

    currentScene: null,

    render: function () {

        Canvas5.currentScene.update();
        requestAnimationFrame(Canvas5.render);

    },

    renderAsPlatformer: function () {

        Canvas5.currentScene.updateAsPlatformer();
        requestAnimationFrame(Canvas5.renderAsPlatformer);

    },

    onloadMessage: function (evt) {

        // On script load, log info to console
        console.info("Canvas5 JavaScript Engine; version " + Canvas5.version + "; (c) 2016 Sergix");
        console.warn("Using development build! May contain unknown errors!");

        window.addEventListener('mousemove', Canvas5.updateMouse, false);
        window.addEventListener('mousedown', Canvas5.mouseDown,   false);
        window.addEventListener('mouseup',   Canvas5.mouseUp,     false);
        window.addEventListener('keydown',   Canvas5.keyDown,     false);
        window.addEventListener('keyup',     Canvas5.keyUp,       false);

    },

    isKeyPressed: function (key) {

        // If it exists in activeKeys
        if (Canvas5.activeKeys.indexOf(key) > -1)

            // Return true
            return 1;
        else

            // Otherwise, return false
            return 0;

    },

    isButtonPressed: function (button) {

        // If it exists in activeButtons
        if (Canvas5.activeButtons.indexOf(button) > -1)

            // Return true
            return 1;

        else

            // Otherwise, return false
            return 0;

    },

    updateMouse: function (evt) {

        Canvas5.mouseX = evt.pageX;
        Canvas5.mouseY = evt.pageY;

    },

    mouseDown: function (evt) {

        if (Canvas5.activeButtons.indexOf(evt.button) <= -1)

            // Push the current button code to the activeButton array
            Canvas5.activeButtons.push(evt.button);

    },

    mouseUp: function (evt) {

        // Get the index of the button code in activeButtons
        var index = Canvas5.activeButtons.indexOf(evt.button);

        // If it exists in activeButtons
        if (index > -1)

            // Then remove it from the array
            Canvas5.activeButtons.splice(index, 1);

    },

    keyDown: function (evt) {
        
        if (Canvas5.activeKeys.indexOf(evt.keyCode) <= -1)

            // Push the key code to the activeKeys array
            Canvas5.activeKeys.push(evt.keyCode);

    },

    keyUp: function (evt) {

        
        // Get the index of the key in activeKeys
        var index = Canvas5.activeKeys.indexOf(evt.keyCode);

        // If it exists in activeKeys
        if (index > -1)

            // Then remove it from the array
            Canvas5.activeKeys.splice(index, 1);

    },

    distance: function (x0, y0, x1, y1) {

        // Get the distance between two points
        // Set local vars
        var dx = x1 - x0, dy = y1 - y0;

        // Return the square root of dx squared plus dy squared, which gets the distance
        return Math.sqrt((dx * dx) + (dy * dy));

    },

    getKeyCode: function (code) {

        var key;

        // Check string for key value and return it
        switch (code) {

            case  "~" || "`":return 192;
            case  "1"|| "!":return 49;
            case  "2"|| "@":return  50;
            case  "3"|| "#":return  51;
            case  "4"|| "$":return  52;
            case  "5"|| "%":return  53;
            case  "6"|| "^":return  54;
            case  "7"|| "&":return  55;
            case  "8"|| "*":return  56;
            case  "9"|| "(":return  57;
            case  "0"|| ")":return  48;
            case  "tab":return  9;
            case  "caps lock":return  20;
            case  "left shift":return  16;
            case  "right shift":return  16;
            case  "left ctrl":return  17;
            case  "win":return  91;
            case  "left alt":return  18;
            case  "space":return  32;
            case  "q"|| "Q":return  81;
            case  "w"|| "W":return  87;
            case  "e"|| "E":return  69;
            case  "r"|| "R":return  82;
            case  "t"|| "T":return  84;
            case  "y"|| "Y":return  89;
            case  "u"|| "U":return  85;
            case  "i"|| "I":return  73;
            case  "o"|| "O":return  79;
            case  "p"|| "P":return  80;
            case  "a"|| "A":return  65;
            case  "s"|| "S":return  83;
            case  "d"|| "D":return  68;
            case  "f"|| "F":return  70;
            case  "g"|| "G":return  71;
            case  "h"|| "H":return  72;
            case  "j"|| "J":return  74;
            case  "k"|| "K":return  75;
            case  "l"|| "L":return  76;
            case  "z"|| "Z":return  90;
            case  "x"|| "X":return  88;
            case  "c"|| "C":return  67;
            case  "v"|| "V":return  86;
            case  "b"|| "B":return  66;
            case  "n"|| "N":return  78;
            case  "m"|| "M":return  77;
            case  "<"|| ",":return  188;
            case  ">"|| ".":return  190;
            case  "?"|| "/":return  191;
            case  ":"|| ";":return  186;
            case  "esc":return  27;
            case  "f1":return  91;
            case  "f2":return  91;
            case  "f3":return  91;
            case  "f4":return  91;
            case  "f5":return  177;
            case  "f6":return  179;
            case  "f7":return  179;
            case  "f8":return  176;
            case  "f9":return  174;
            case  "f10":return  175;
            case  "f11":return  173;
            case  "f12":return  173;
            case  "prt sc"|| "ins":return  46;
            case  "delete":return  46;
            case  "-"|| "_":return  189;
            case  "+"|| "=":return  187;
            case  "backspace":return  8;
            case  "{"|| "[":return  219;
            case  "}"|| "]":return  221;
            case  "|":return  220;
            case  '"'|| "'":return  222;
            case  "enter":return  13;
            case  "right alt":return  18;
            case  "list":return  93;
            case  "right ctrl":return  17;
            case  "left":return  37;
            case  "up":return  38;
            case  "down":return  40;
            case  "right":return  39;

            default:return code;

        }

    }

};

// Call to load the Canvas5 object
window.onload = Canvas5.onloadMessage;

/*
    Scene object constructor
    desc: Used to render the screen and all its added objects.
*/

Canvas5.Scene = function (domElement) {

    this.canvas = domElement || document.getElementById("CanvasGame");
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.sprites = [];
    this.actionList = [];
    this.menuList = [];
    this.changeColorList = [0, 0, 0, 0];
    this.colorList = [];
    this.imageData = null;
    this.background = null;
    this.showInfo = false;
    this.boundaries = null;

}

    // Pixel Manipulation
    Canvas5.Scene.prototype.modifyColors =  function (rgba, _area) {

        var area = _area || null;

        // Make sure rgba argument is of type RGBASet
        if (!rgba.r) {

            console.error("Color set must be of type RGBASet! {modifyColors(), " + rgba + "}");
            return 0;

        } // If false, stay silent

        // If user didn't define area
        if (area === null)
            
            // Then set it to canvas size
            area = [0, 0, this.width, this.height];

        // If false, stay silent

        this.colorList = [];

        // Copy the values from the rgba param into the changeColorList array
        this.changeColorList[0] = rgba.r;
        this.changeColorList[1] = rgba.g;
        this.changeColorList[2] = rgba.b;
        this.changeColorList[3] = rgba.a;

        // Get the data of what was last drawn on the canvas in the specified area
        this.imageData = this.context.getImageData(area[0], area[1], area[2], area[3]);

        // If area is larger than 200x200, warn user
        if (this.imageData.width > 200 && this.imageData.height > 200)
            console.warn("Pixel manipulation on large parts of the canvas can cause major framerate issues! {modifyColors(), null}");

        // Define local vars
        var index, r, g, b, a, i, j;

        // Loop through pixel rows
        for (i = 0; i < area[3]; i++) {

            // Loop though pixel columns
            for (j = 0; j < area[2]; j++) {

                // Get the current pixel
                index = (j + (i * this.imageData.width)) * 4;

                // Set color value vars
                r = this.imageData.data[index];
                g = this.imageData.data[index + 1];
                b = this.imageData.data[index + 2];
                a = this.imageData.data[index + 3];

                // Modify color value vars using changeColorList
                r += this.changeColorList[0];
                g += this.changeColorList[1];
                b += this.changeColorList[2];
                a += this.changeColorList[3];

                // Check pixel values incase its outside boundary values (0-255)
                if (r > 255)
                    r = 255;
                if (r < 0)
                    r = 0;
                if (g > 255)
                    g = 255;
                if (g < 0)
                    g = 0;
                if (b > 255)
                    b = 255;
                if (b < 0)
                    b = 0;
                if (a > 255)
                    a = 255;
                if (a < 0)
                    a = 0;

                this.colorList.push([r, g, b, a]);

                // Put new RGBA values into imageData array
                this.imageData.data[index] = r;
                this.imageData.data[index + 1] = g;
                this.imageData.data[index + 2] = b;
                this.imageData.data[index + 3] = a;
            }
        }

        // Put the new pixels back on the canvas in the specified area
        this.context.putImageData(this.imageData, area[0], area[1]);

    };

    // Get the current color values form last call to modifyColors
    Canvas5.Scene.prototype.getColors = function () {

        // Return the colorList array to the user
        return this.colorList;

    };

    // Define a new action (function) to be called at rendering time
    Canvas5.Scene.prototype.newAction = function (fn1, fn2) {

        // Define local vars
        var action = new Object();

        // Add condition to action object
        action.condition = fn1;
        
        // If user defined second function
        if (fn2)

            // Then add action to action object
            action.action = fn2;

        // If false, stay silent

        // Push the function to actionList
        this.actionList.push(action);

    };

    // Add a sprite to be rendered
    Canvas5.Scene.prototype.add = function (sprite) {

        // Push the sprite to the sprites array
        this.sprites.push(sprite);

    };

    // Add a new menu to the scene to be rendered
    Canvas5.Scene.prototype.addMenu = function (menu) {

        // Push the menu to the menuList array
        this.menuList.push(menu);

    };

    // Remove a sprite from the sprites array
    Canvas5.Scene.prototype.remove = function (sprite) {

        // Get the index of the sprite to be removed in the sprites array
        var index = this.sprites.indexOf(sprite);

        // Check if the specified sprite is in sprites
        if (index > -1)

            // If true, remove the sprite from the array
            this.sprites.splice(index, 1);

        // Be silent if false

    };

    // Update the scene's collision
    Canvas5.Scene.prototype.update = function () {

        // Define local vars
        var i, j, e;

        // Loop through sprites and update each
        for (i = 0; i < this.sprites.length; i++)
            this.sprites[i].update(this.context);

        // Loop through sprites for checking against other sprites
        for (i = 0; i < this.sprites.length; i++) {

            // Check if we are going to perfrom collision detection on the current sprite
            if (!this.sprites[i].collide)

                // If not, skip to next sprite
                continue;

            // Check sprite boundaries
            if (this.sprites[i].boundaries !== null) {
                if (this.sprites[i].x < this.sprites[i].boundaries[0]) this.sprites[i].x = this.sprites[i].boundaries[0];
                if (this.sprites[i].x + this.sprites[i].width > this.sprites[i].boundaries[3]) this.sprites[i].x = this.sprites[i].boundaries[3] - this.sprites[i].width;
                if (this.sprites[i].y < this.sprites[i].boundaries[1]) this.sprites[i].y = this.sprites[i].boundaries[1];
                if (this.sprites[i].y + this.sprites[i].height > this.sprites[i].boundaries[4]) {

                    this.sprites[i].y = this.sprites[i].boundaries[4] - this.sprites[i].height;
                    this.sprites[i].onGround = true;

                }
            }

            if (this.boundaries !== null) {
                if (this.sprites[i].x < this.boundaries[0]) this.sprites[i].x = this.boundaries[0];
                if (this.sprites[i].x + this.sprites[i].width > this.boundaries[3]) this.sprites[i].x = this.boundaries[3] - this.sprites[i].width;
                if (this.sprites[i].y < this.boundaries[1]) this.sprites[i].y = this.boundaries[1];
                if (this.sprites[i].y + this.sprites[i].height > this.boundaries[4]) {

                    this.sprites[i].y = this.boundaries[4] - this.sprites[i].height;
                    this.sprites[i].onGround = true;

                }
            }

            // Loop though sprites
            for (j = 0; j < this.sprites.length; j++) {

                // Check if the loops are on the same indice
                if (this.sprites[i] === this.sprites[j] || i === j)

                    // If so, skip to next sprite
                    continue;

                // Set a local var to current sprite (for shorthand purposes)
                e = this.sprites[j];

                // Check if we are going to perfrom collision detection on the current sprite
                if (!e.collide || e.text)

                    continue;

                // Check to see if the sprites are colliding (AABB collision)
                if (this.sprites[i].x < e.x + e.width && this.sprites[i].x + this.sprites[i].width > e.x && this.sprites[i].y < e.y + e.height && this.sprites[i].y + this.sprites[i].height > e.y) {

                    e.x = e.oldx;
                    e.y = e.oldy;

                    if (e.y + e.height <= this.sprites[i].y && !e.onGround ) {

                        e.onGround = true;
                        e.oldy = this.sprites[i].y - e.height;
                        e.ay = 0;
                        e.vy = 0;

                    }

                } else {

                    e.oldx = e.x;
                    e.oldy = e.y;

                }

            } // end for

        } // end for

        this.render();

    };

    // Update the scene's collision
    Canvas5.Scene.prototype.updateAsPlatformer = function (gravity) {

        // Define local vars
        var i, gravity = gravity || 1.9;

        for (i = 0; i < this.sprites.length; i++) {

            if (!this.sprites[i].onGround)

                this.sprites[i].ay = gravity;

        }

        this.update();

    };

    // Render the current scene and all its current and visible objects
    Canvas5.Scene.prototype.render = function () {

        var set, result;

        // Render the background
        set = this.background.draw(new Canvas5.Vector(0, 0));
        if (set)
            this.context.fillRect(0, 0, this.width, this.height);

        // If showInfo is true, display information about the scene (n of sprites being rendered)
        if (this.showInfo) {

            this.context.font = "13pt sans-serif";
            this.context.color = "black";
            this.context.fillText("60 FPS; " + (this.sprites.length + 1) + " objects", 10, 20);

        }

        // Loop through sprites and draw each
        for (i = 0; i < this.sprites.length; i++)
            this.sprites[i].draw(this.context);

        // Loop though actions
        for (i = 0; i < this.actionList.length; i++) {

            result = this.actionList[i].condition();

            // If user defined action portion
            if (this.actionList[i].action && result)

                // If true, perform the actual action portion
                this.actionList[i].action();

            // If false, stay silent

        }

        // Loop through and update menus
        for (i = 0; i < this.menuList.length; i++)
            this.menuList[i].update(this.context);

    };


/*
    Vector object constructor
    desc: Contains data about a certain defined point on the canvas
*/

Canvas5.Vector = function (x, y) {

    this.x = x;
    this.y = y;

}


/*
    Polygon object constructor
    desc: Used to draw a polygon on a scene
*/

Canvas5.Polygon = function (vectors) {

    this.vectors = vectors;
    this.color = RGBSet(0, 0, 0);
    this.lineWidth = 1;
    this.lineCap = "butt";
    this.fill = false;
    this.shadow = null;
    this.visible = true;

}

    // Updates shadows and other properties
    Canvas5.Polygon.prototype.update = function (context) {

        // If vectors attribute is not an array
        if (typeof this.vectors !== "object") {

            // Throw an error
            console.error("Argument to Polygon contstruct must be of type Array! {Polygon.update(), " + this.vectors + "}");

            // Exit the function
            return 0;

        } // If false, stay silent

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    // Draw the line
    Canvas5.Polygon.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // Define local vars
        var i, context = context || Canvas5.currentScene.context;

        // Set drawing parameters
        this.color.draw(context);
        context.strokeStyle = this.color.getAsString();
        context.lineWidth = this.width;
        context.lineCap = this.lineJoin;

        // Draw the line using context paths
        context.beginPath();

        // Loop through vectors
        for (i = 0; i < this.vectors.length - 1; i++) {

            // Draw a new line
            context.moveTo(vectors[i].x, vectors[i].y);
            context.lineTo(vectors[i + 1].x, vectors[i + 1].y);

        }

        // If we are to fill the polygon
        if (this.fill)
            // Then fill
            context.fill();
        else
            // Otherwise, stroke
            context.stroke();

        // End the path
        context.closePath();

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew this
            this.shadow.disable(context);

        // If false, stay silent

    };

/*
    Line object constructor
    desc: Used to draw a simple line between two vectors on a scene
*/

Canvas5.Line = function (v1, v2) {

    this.vectors = [v1, v2];
    this.color = RGBSet(0, 0, 0);
    this.width = 1;
    this.shadow = null;
    this.visible = true;

}

    // Updates shadows and other properties
    Canvas5.Line.prototype.update = function (context) {

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    // Draw the line
    Canvas5.Line.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // Set drawing parameters
        context.strokeStyle = this.color.getAsString();
        context.lineWidth = this.width;

        // Draw the line using context paths
        context.beginPath();
        context.moveTo(vectors[0].x, vectors[0].y);
        context.lineTo(vectors[1].x, vectors[1].y);
        context.stroke();
        context.closePath();

        // If user defined a shadow
        if (this.shadow)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

        // If false, stay silent

    };

/*
    BezierCurve object constructor
    desc: Draws a bezier (2-contol point) curve
*/

Canvas5.BezierCurve = function (vectors) {

    this.vectors = vectors;
    this.shadow = null;
    this.visible = true;

}

    // Update the curve
    Canvas5.BezierCurve.prototype.update = function (context) {

        context = context || Canvas5.currentScene.context;

        // If length is not valid
        if (this.vectors.length !== 4) {

            // Log error
            console.error("Vectors array is not correct length to draw curve! {Curve.update(), " + this.vectors + "}");

            // Then exit function
            return 0;

        } // If false, stay silent

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    // Draw the curve
    Canvas5.BezierCurve.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // Define local vars
        var i;

        // Start path
        context.beginPath();
        context.moveTo(this.vectors[0].x, this.vectors[0].y);

        // Draw a bezier curve
        context.bezierCurveTo(this.vectors[1].x, this.vectors[1].y, this.vectors[2].x, this.vectors[2].y, this.vectors[3].x, this.vectors[3].y);

        // Stroke and end the path
        context.stroke();
        context.closePath();

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

        // If false, stay silent

    };

/*
    QuadraticCurve object constructor
    desc: Draws a quadratic (1-contol point) curve
*/

Canvas5.QuadraticCurve = function (vectors) {

    this.vectors = vectors;
    this.shadow = null;
    this.visible = true;

}

    // Update the curve
    Canvas5.QuadraticCurve.prototype.update = function (context) {

        // If length is not valid
        if (this.vectors.length !== 3) {

            // Log error
            console.error("Vectors array is not correct length to draw curve! {Curve.update(), " + this.vectors + "}");

            // Then exit function
            return 0;

        } // If false, stay silent

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    // Draw the curve
    Canvas5.QuadraticCurve.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // Define local vars
        var i;
        
        // Start path
        context.beginPath();
        context.moveTo(this.vectors[0].x, this.vectors[0].y);

        // Draw a bezier curve
        context.QuadraticCurveTo(this.vectors[1].x, this.vectors[1].y, this.vectors[2].x, this.vectors[2].y);

        // Stroke and end the path
        context.stroke();
        context.closePath();

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

        // If false, stay silent

    };

/*
    Sprite object constructor
    desc: Defines an object that can be used to draw an image on the screen with other various modifiable properties
*/

Canvas5.Sprite = function(spriteSheet) {

    this.spriteSheet = spriteSheet || new Canvas5.SpriteSheet(null, 0, 0);
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.jumpHeight = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.width = this.spriteSheet.spriteWidth;
    this.height = this.spriteSheet.spriteHeight;
    this.boundaries = null;
    this.collide = true;
    this.name = null;
    this.moveLeft = true;
    this.moveRight = true;
    this.moveDown = true;
    this.moveUp = true;
    this.clicked = false;
    this.shadow = null;
    this.visible = true;
    this.rotate = 0;
    this.scale = [0, 0];
    this.onGround = false;
    this.keybinds = [];
    this.oldx = this.x;
    this.oldy = this.y;
    this.canMove = true;

}

    // Check if the sprite is near the other specified sprite by "units" pixels
    Canvas5.Sprite.prototype.near = function (sprite, units) {

        // If true
        if (Canvas5.distance(this.x, this.y, sprite.x, sprite.y) <= units)

            // Return true
            return 1;
        else

            // Otherwise, return false
            return 0;

    };

    // Set the name of the sprite to be visibly rendered
    Canvas5.Sprite.prototype.setName = function (text) {

        this.name = text;

    };

    // Set the (x,y) position of the sprite
    Canvas5.Sprite.prototype.setPosition = function (x, y) {

        this.x = x;
        this.y = y;

    };

    // Set the (x,y) velocity of the sprite
    Canvas5.Sprite.prototype.setVelocity = function (vx, vy) {

        this.vx = vx;
        this.vy = vy;

    };

    // Set the (x,y) acceleration of the object
    Canvas5.Sprite.prototype.setAccel = function (ax, ay) {

        this.ax = ax;
        this.ay = ay;

    };

    // Make the sprite jump using the provided velocity and gravity
    Canvas5.Sprite.prototype.jump = function (velocity, gravity, onGround) {

        // Incase onGround was undefined then set it to true
        onGround = onGround || false;

        // If the player can only jump if he is on the ground
        if (!this.onGround && onGround) 
        
            // Then return nothing
            return;

        // If false, stay silent

        // Set the velocity and acceleration of the sprite
        this.vy = -velocity;
        this.ay = gravity;

        this.onGround = false;

    };

    // Used to update the sprite's collision, position, and animation frame
    Canvas5.Sprite.prototype.update = function (context) {

        // If the scale is 0
        if (this.scale === [0, 0])

            // Then set it to the width and height of the sprite
            this.scale = [this.width, this.height];

        // If false, stay silent

        // Check to see if the width and height have been set yet
        // (used on first call to update)
        if (this.width === 0 && this.height === 0) {

            // If true, set the width and height to the image's properties
            this.width = this.spriteSheet.images[0].image.width;
            this.height = this.spriteSheet.images[0].image.height;

        } // If false, stay silent

        // Update the position and velocity
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;


        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    Canvas5.Sprite.prototype.transform = function (rotate, scale) {

        this.rotate = rotate;
        this.scale = scale;

    };

    // Draw the sprite on the provided context
    Canvas5.Sprite.prototype.draw = function (context) {

        // If the object is not visible
        if (!this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // If we are to transform the sprite
        if (this.rotate !== 0 || this.scale[0] !== 0 || this.scale[1] !== 0) {

            // Set properties for transformations
            context.save();
            context.rotate(this.rotate);
            context.scale(this.scale[0], this.scale[1]);

            // Draw the image on the canvas at (x,y) at the current frame
            this.spriteSheet.draw(context, new Canvas5.Vector(this.x, this.y));

            // Draw the new coord system
            context.restore();

        } else

            // Otherwise, draw the image on the canvas at (x,y) at the current frame
            this.spriteSheet.draw(context, new Canvas5.Vector(this.x, this.y));
        
        // If the name property is not set
        if (this.name !== null) {

            // Draw the sprite's name
            this.name.x = this.x;
            this.name.y = this.y - 25;
            this.name.draw(context);

        }

        // If false, stay silent

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

        // If false, stay silent

    };

    // Add a new keybind that will run (fn) upon press
    Canvas5.Sprite.prototype.addKeybind = function (key, fn) {

        // Push the keybind object to the keybinds array property
        this.keybinds.push({ key: key, fn: fn });

    };

    // Add basic keyboard controls to the sprite
    Canvas5.Sprite.prototype.addBasicControls = function (movementSpeed) {

        // Set the speed property of the sprite
        this.speed = movementSpeed;

        // Add event listeners to the provided DOM object
        window.addEventListener('keydown', bind(this, this.onKeyDown), false);
        window.addEventListener('keyup', bind(this, this.onKeyUp), false);

    };

    Canvas5.Sprite.prototype.addPlatformerControls = function (movementSpeed, jumpHeight) {

        // Set the speed property of the sprite
        this.speed = movementSpeed;
        this.jumpHeight = jumpHeight;

        // Add event listeners to the provided DOM object
        window.addEventListener('keydown',  bind(this, this.onKeyDownPlatformer), false);
        window.addEventListener('keyup',  bind(this, this.onKeyUpPlatformer), false);

    };

    // Add an event listener for the mouse to the sprite
    Canvas5.Sprite.prototype.addMouseListener = function () {

        // Add event listeners to the provided DOM object
        window.addEventListener('mousedown',  bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup',  bind(this, this.onMouseUp), false);
    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onMouseDown = function (evt) {

        // Switch for button code
        switch (evt.button) {

            // Set various values based on mouse input
            case 0: // left

                // If the mouse is pressed on top of the sprite
                if (Canvas5.mouseX >= this.x && Canvas5.mouseX <= this.x + this.width && Canvas5.mouseY >= this.y && Canvas5.mouseY <= this.y + this.width)

                    // Set the clicked property to true
                    this.clicked = true;

                // Then break
                break;

        }

    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onMouseUp = function (evt) {

        // Set the clicked property to false
        this.clicked = false;

    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onKeyDownPlatformer = function (evt) {

        if (!this.canMove)
            return;

        // Switch for the current key code
        switch (evt.keyCode) {

            // Set the velocity to "speed" based on what key is pressed
            case 37: this.vx = -this.speed; break;
            case 65: this.vx = -this.speed; break;
            case 40: this.vy = this.speed; break;
            case 83: this.vy = this.speed; break;
            case 39: this.vx = this.speed; break;
            case 68: this.vx = this.speed; break;
            case 32: this.jump(this.jumpHeight, 1.9, true); break;
            default: break;

        }

    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onKeyUpPlatformer = function (evt) {

        // Switch for current key code
        switch (evt.keyCode) {

            // Set the velocity to 0 based on what key is pressed
            case 38: this.vy = 0; break;
            case 87: this.vy = 0; break;
            case 37: this.vx = 0; break;
            case 65: this.vx = 0; break;
            case 40: this.vy = 0; break;
            case 83: this.vy = 0; break;
            case 39: this.vx = 0; break;
            case 68: this.vx = 0; break;
            default: break;

        }

        // Define local vars
        var i;

        // Loop through the keybinds array property
        for (i = 0; i < this.keybinds.length; i++)

            // If the key is pressed of the current array indice
            if (this.isKeyPressed(this.keybinds[i].key))

                // Then run the function associated with the key
                this.keybinds[i].fn();

            // If false, stay silent

    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onKeyDown = function (evt) {

        if (!this.canMove)
            return;

        // Switch for the current key code
        switch (evt.keyCode) {

            // Set the velocity to "speed" based on what key is pressed
            case 38: this.vy = -this.speed; break;
            case 87: this.vy = -this.speed; break;
            case 37: this.vx = -this.speed; break;
            case 65: this.vx = -this.speed; break;
            case 40: this.vy = this.speed; break;
            case 83: this.vy = this.speed; break;
            case 39: this.vx = this.speed; break;
            case 68: this.vx = this.speed; break;
            default: break;

        }

           
        // Define local vars
        var i;

        // Loop through the keybinds array property
        for (i = 0; i < this.keybinds.length; i++)

            // If the key is pressed of the current array indice
            if (Canvas5.isKeyPressed(this.keybinds[i].key))

                // Then run the function associated with the key
                this.keybinds[i].fn();

            // If false, stay silent

    };

    // Called if event listener is active
    Canvas5.Sprite.prototype.onKeyUp = function (evt) {

        // Switch for current key code
        switch (evt.keyCode) {

            // Set the velocity to 0 based on what key is pressed
            case 38:   this.vy = 0; break; // up
            case 87:   this.vy = 0; break; // W
            case 37:   this.vx = 0; break; // Left
            case 65:   this.vx = 0; break; // A
            case 40:   this.vy = 0; break; // down
            case 83:   this.vy = 0; break; // S
            case 39:   this.vx = 0; break; // right
            case 68:   this.vx = 0; break; // D
            default: break;

        }

    };

/*
    GameMenu object constructor
    desc: Creates a visible menu that can contain buttons and other text that can be clicked
*/

Canvas5.GameMenu = function () {

    this.x = 0;
    this.y = 0;
    this.elements = [];
    this.alwaysActive = false;
    this.collide = false;
    this.background = null;
    this.width = 200;
    this.height = 200;
    this.editMode = false;
    this.dragging = false;

}

    // Add a new element to the menu
    Canvas5.GameMenu.prototype.add = function (element) {

        // Push the provided element to the elements array
        this.elements.push(element);

    };

    // Add a mouse event listener to the menu
    Canvas5.GameMenu.prototype.addMouseListener = function () {

        // Add a listener to the provided DOM object
        window.addEventListener('mousemove', bind(this, this.onMouseMove), false);
        window.addEventListener('mousedown', bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup', bind(this, this.onMouseUp), false);

    };

    // Called if event listener is active
    Canvas5.GameMenu.prototype.onMouseMove = function (evt) {

        // If we are dragging the mouse
        if (this.dragging !== false) {

            // Then set the position of the object being dragged to the current mouse position
            this.dragging.x = Canvas5.mouseX;
            this.dragging.y = Canvas5.mouseY;

        } // If false, stay silent

    };

    // Called if event listener is active
    Canvas5.GameMenu.prototype.onMouseDown = function (evt) {

        // Switch for mouse button code
        switch (evt.button) {

            // If left mouse button is down
            case 0: /*left*/

                // Loop through the elements array
                for (var i = 0; i < this.elements.length; i++) {

                    // If the element a text object
                    if (this.elements[i].font !== undefined) {

                        // Then check if the mouse is colliding with the object (AABB collision)
                        // NOTE: Since text object has no defined width or height, check by seeing if the mouse is within a 100x100 region around its (x,y)
                        if (Canvas5.mouseX >= this.elements[i].x && Canvas5.mouseX <= this.elements[i].x + 100 && Canvas5.mouseY >= this.elements[i].y && Canvas5.mouseY <= this.elements[i].y + 100)

                            // If true, set the dragging property to the current element index
                            this.dragging = this.elements[i];

                        // If false, stay silent

                        // Then break (we only want to drag one object at a time)
                        break;
                    }

                    // If the current object is not a text element, and the mouse is colliding with it (AABB collsion)
                    if (Canvas5.mouseX >= this.elements[i].x && Canvas5.mouseX <= this.elements[i].x + this.elements[i].width && Canvas5.mouseY >= this.elements[i].y && Canvas5.mouseY <= this.elements[i].y + this.elements[i].width)

                        // Then set the dragging property to the current element index
                        this.dragging = this.elements[i];

                    // If false, stay silent

                } // end for

                // Do not continue in switch
                break;

        } // end switch

    };

    // Called if event listener is active
    Canvas5.GameMenu.prototype.onMouseUp = function (evt) {

        // Set the dragging property to false
        this.dragging = false;

    };

    // Updates the menu
    Canvas5.GameMenu.prototype.update = function (context, active) {

        // If edit mode is enabled
        if (this.editMode)

            // Add a mouse listener to the menu using "editMode" DOM object
            this.addMouseListener();

        // If false, stay silent

        // If we are dragging an object
        if (this.dragging !== false) {

            // Then update the current selected element's position
            this.dragging.x = Canvas5.mouseX;
            this.dragging.y = Canvas5.mouseY;

        } // If false, stay silent

        // If we are to draw the menu automatically
        if (this.alwaysActive || active)

            // Call draw
            this.draw(context);

        // If false, stay silent

    };

    // Updates the menu, used if the alwaysActive property is false
    Canvas5.GameMenu.prototype.active = function (scene) {

        // If we have a current scene set up, use that
        scene = scene || Canvas5.currentScene;

        // Call update using the scene's context
        this.update(scene.context, true);

    };

    // Draw the menu
    Canvas5.GameMenu.prototype.draw = function (context) {

        var set = this.background.draw(new Canvas5.Vector(this.x, this.y));
        
        if (set)
            context.fillRect(this.x, this.y, this.width, this.height);

        // Loop through the menu's elements
        for (var i = 0; i < this.elements.length; i++) {

            // Update the current element
            this.elements[i].update(context);
            this.elements[i].draw(context)

            // If we are dragging an element
            if (this.dragging !== false) {

                // Render text showing (x,y) of the element being dragged
                context.fillStyle = "white";
                context.font = "14pt sans-serif";
                context.fillText(this.elements[i].x + ", " + this.elements[i].y, this.elements[i].x, this.elements[i].y - 30);

            } // If false, stay silent

        } // end for

    }; // end function

/*
    Button object constructor
    desc: A simple button that can be clicked and can be set to any color and can use any text
*/

Canvas5.Button = function (text, rect) {

    this.x = 0;
    this.y = 0;
    this.text = text;
    this.rect = rect;
    this.clicked = false;
    this.width = this.rect.width;
    this.height = this.rect.height;
    this.visible = true;

}

    // Add a mouse event listener to the button
    Canvas5.Button.prototype.addMouseListener = function () {

        // Bind listener functions to mouse events using the provided DOM object
        window.addEventListener('mousedown', bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup', bind(this, this.onMouseUp), false);

    };

    // Called if event listener is active
    Canvas5.Button.prototype.onMouseDown = function (evt) {

        // Switch through mouse buttons
        switch (evt.button) {

            // If left mouse button is down
            case 0: /*left*/

                // If the mouse is colliding against the button (AABB collision)
                if (Canvas5.mouseX >= this.x && Canvas5.mouseX <= this.x + this.rect.width && Canvas5.mouseY >= this.y && Canvas5.mouseY <= this.y + this.rect.width)

                    // Then set the clicked property to true
                    this.clicked = true;

                // If false, stay silent

                // Then break
                break;
        }

    };

    // Called if event listener is active
    Canvas5.Button.prototype.onMouseUp = function (evt) {

        // Set the clicked property to false
        this.clicked = false;

    };

    // Set the position of the button
    Canvas5.Button.prototype.setPosition = function (x, y) {

        // Set the (x,y) of the button
        this.x = x;
        this.y = y;

    };

    // Update the button using the provided context
    Canvas5.Button.prototype.update = function (context) {

        // Draw the button's shape
        this.rect.draw(context);

        // If the mouse is colliding with the button (AABB collision)
        if (Canvas5.mouseX >= this.x && Canvas5.mouseX <= this.x + this.rect.width && Canvas5.mouseY >= this.y && Canvas5.mouseY <= this.y + this.rect.height)

            // Then draw the button using a slightly lighter color
            this.rect.draw(context, new Canvas5.RGBASet(this.rect.color.r + 50, this.rect.color.g + 50, this.rect.color.b + 50, this.rect.color.a));

        // If false, stay silent

        // Set the button's shape object's position to the button's (x,y)
        this.rect.setPosition(this.x, this.y);

        // Set the button text's position to be centered in the button
        this.text.x = (this.rect.width / 2) + this.rect.x;
        this.text.y = this.rect.y + 40;

        // Loop through the length of the text
        for (var i = 0; i < this.text.text.length / 2; i++)

            // Center the text
            this.text.x -= 14;

    };

    // Used to draw the button's text
    Canvas5.Button.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        // Draw the text
        this.text.draw(context);

    };


/*
    Rect object constructor
    desc: A rectangle that can be drawn at any width and height
*/

Canvas5.Rect = function (vector, width, height) {

    this.vector = vector;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.color = new Canvas5.RGBASet(100, 100, 100, 1);
    this.border = this.color;
    this.borderWidth = 2;
    this.shadow = null;
    this.visible = true;
    this.collide = false;

}


    // Set the rect's position to (x,y)
    Canvas5.Rect.prototype.setPosition = function (x, y) {

        // Set the (x,y) properties
        this.vector.x = x;
        this.vector.y = y;

    };

    // Upadte the rect using the provided context
    Canvas5.Rect.prototype.update = function (context) {

        // Update the (x,y) using the set velocity
        this.vector.x += this.vx;
        this.vector.y += this.vy;

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent

    };

    // Draw the rect using the provided context and color
    Canvas5.Rect.prototype.draw = function (context, color) {

        context = context || Canvas5.currentScene.context;

        // If the user provided a color
        if (color !== undefined) {

            // Then set the fillStyle and strokeStyle to it
            this.color.draw(context);
            context.strokeStyle = this.border.getAsString();

        } else {

            // Otherwise, set the fillStyle and strokeStyle to the set color property
            this.color.draw(context);
            context.strokeStyle = this.border.getAsString();

        }

        // Draw the rect
        context.fillRect(this.vector.x, this.vector.y, this.width, this.height);
        context.strokeRect(this.vector.x, this.vector.y, this.width, this.height);

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

    };

/*
    Circle object constructor
    desc: A simple circle that can be drawn using any radius
*/

Canvas5.Circle = function (vector, size) {

    this.vector = vector;
    this.vx = 0;
    this.vy = 0;
    this.radius = size;
    this.color = new Canvas5.RGBSet(255, 255, 255);
    this.border = this.color;
    this.borderWidth = 2;
    this.shadow = null;
    this.visible = true;

}


    // Set the position of the circle
    Canvas5.Circle.prototype.setPosition = function (vector) {

        // Set the (x,y) property to (x,y)
        this.vector.x = vector.x;
        this.vector.y = vector.y;

    };

    // Update the circle
    Canvas5.Circle.prototype.update = function (context) {

        // Update the (x,y) property using the set velocity
        this.vector.x += this.vx;
        this.vector.y += this.vy;

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

    };

    // Draw the circle
    Canvas5.Circle.prototype.draw = function (context) {

        // If the object is not visible
        if (this.visible)

            // Then exit function
            return;

         // If false, stay silent

        context = context || Canvas5.currentScene.context;

        // Set the color, border, border width
        this.color.draw(context);
        context.strokeStyle = this.border.getAsString();
        context.lineWidth = this.borderWidth;

        // Draw the circle
        context.beginPath();
        context.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.stroke();

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

    };

/*
    Client object constructor
    desc: Establishes a connection to a WebSocket and can be used to send and pull data from it
*/

Canvas5.Client = function(url) {

    this.url = url;
    this.server = new WebSocket(url);
    this.currentData = null;

    // Warn the user of possible errors
    console.warn("Canvas5 WebSocket implementation is currently very limited and buggy!");

    // Set the event handlers
    this.server.onopen    = this.event;
    this.server.onclose   = this.event;
    this.server.onmessage = this.event;
    this.server.onerror   = this.event;

}

    // Called on messages or events from the socket
    Canvas5.Client.prototype.event = function (event) {

        // Set the currentData property to whatever was sent
        this.currentData = event;

    };

    // Send a new message to the socket
    Canvas5.Client.prototype.sendMessage = function (data) {

        // Send the data
        this.server.send(data);

    };

    // Get the last message recieved from the socket
    Canvas5.Client.prototype.getMessage = function () {

        // Return the data to the user
        return this.currentData.data;

    };

/*
    LocalStorageSet object constructor
    desc: Sets key:value pairs in the localStorage of the browser
*/

Canvas5.LocalStorageSet = function () {

    this.keyList = [];

}

    // Create a new key:value pair
    Canvas5.LocalStorageSet.prototype.newItem = function (key, value) {

        // Set the data in the global localStorage database
        localStorage.setItem(key, value);

        // Push the item to the keyList array
        this.keyList.push(key);

    };

    // Get an item set in localStorage
    Canvas5.LocalStorageSet.prototype.getItem = function (key) {

        // Return the data to the user
        return localStorage.getItem(key);

    };

    // Get all the items that have been set in localStorage (through this instance)
    Canvas5.LocalStorageSet.prototype.getAllItems = function () {

        // Define local vars
        var temp = [], i;

        // Loop through the keyList array
        for (i = 0; i < this.keyList.length; i++)

            // Push a value to the temp array
            temp.push(localStorage.getItem(this.keyList[i]));

        // Return the array of values
        return temp;

    };

    // Clear the localStorage
    Canvas5.LocalStorageSet.prototype.clear = function () {

        // Define local vars
        var index, i;

        // Loop through the keyList array
        for (i = 0; i < this.keyList.length; i++) {

            // Remove a key:value pair
            localStorage.removeItem(this.keyList[i]);

            // Remove the key from the keyList array
            this.keyList.splice(i, 1);

        }

    };

/*
    AudioElement object constructor
    desc: Creates a new HTML audio element that can be played using JavaScript
*/

Canvas5.AudioElement = function (src) {

    this.domElement = document.createElement('audio');
    this.src = src;

    // Set the source of the audio to the filepath provided
    this.domElement.setAttribute('src', this.src);


}

    // Play the audio
    Canvas5.AudioElement.prototype.play = function () {

        // Play the audio using the audio HTML element
        this.domElement.play();

    };

    // Pause the audio
    Canvas5.AudioElement.prototype.pause = function () {

        // Pause the audio using the audio HTML element
        this.domElement.pause();

    };

    // Pause the audio and rewind it to the beginning
    Canvas5.AudioElement.prototype.stop = function () {

        // Pause the audio
        this.pause();

        // Set the current audio time to 0
        this.setTime(0);

    };

    // Set the audio play time
    Canvas5.AudioElement.prototype.setTime = function (time) {

        // Change the currentTime DOM property of the audio
        this.domElement.currentTime = time;

    };

    // Set the audio volume
    Canvas5.AudioElement.prototype.setVolume = function (volume) {

        // Change the volume DOM property of the audio
        this.domElement.volume = volume;

    };

/*
    MessageBox object constructor
    desc: A block of text that can be drawn on the screen
*/

Canvas5.MessageBox = function (text, x, y) {

    this.x = x || 0;
    this.y = y || 0;
    this.text = text;
    this.font = "12pt sans-serif";
    this.color = new Canvas5.RGBASet(100, 100, 100, 1);
    this.shadow = null;
    this.alwaysActive = false;

}


    // Set the position of the text using (x,y)
    Canvas5.MessageBox.prototype.setPosition = function (x, y) {

        // Set the (x,y) position of the text
        this.x = x;
        this.y = y;

    };

    // Update the text
    Canvas5.MessageBox.prototype.update = function (context) {

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

    };

    // Activate the text, called by the user
    Canvas5.MessageBox.prototype.active = function (scene) {

        // If we have a current scene set up, use that
        scene = scene || Canvas5.currentScene;

        // Draw the text
        this.draw(scene.context);

    };

    // Draw the text using the provided context
    Canvas5.MessageBox.prototype.draw = function (context) {

        // If the object is not visible
        if (!this.alwaysActive)

            // Then exit function
            return;

         // If false, stay silent

        context = context || Canvas5.currentScene.context;

        // Set the color of the text using the color property
        this.color.draw(context);

        // Set the font of the text using the font property
        context.font = this.font;

        // Draw the text at (x,y)
        context.fillText(this.text, this.x, this.y);

        // If the user defined a shadow
        if (this.shadow !== null)

            // Then disable it since we already drew the text
            this.shadow.disable(context);

    };

/*
    Dialogue object constructor
    desc: Uses a MessageBox array to loop through as dialogue
*/

Canvas5.Dialogue = function (text) {

    this.text = text;
    this.index = 0;

}

    // Go to next line of dialogue
    Canvas5.Dialogue.prototype.next = function () {

        // Increment index
        this.index++;

        // If index is over dialogue length
        if (this.index >= this.text.length)

            // Then set index to 0
            this.index = 0;

        // If false, stay silent

    }

    // Update the current text
    Canvas5.Dialogue.prototype.update = function (context) {

        context = context || Canvas5.currentScene.context;

        // Update and draw the text
        this.text[this.index].active(context);

    };

/*
    GameImage object constructor
    desc: Used to create a new DOM image
*/

Canvas5.GameImage = function (src) {

    this.image = new Image();
    this.src = src;

    // Set the source of the image property
    this.image.src = this.src;

}

    Canvas5.GameImage.prototype.draw = function (vector, context) {

        context = context || Canvas5.currentScene.context;
        context.drawImage(this.image, vector.x, vector.y);

        return 0;

    }

/*
    SpriteSheet object constructor
    desc: A collection of images used for animation
*/

Canvas5.SpriteSheet = function (spriteSheet, spriteWidth, spriteHeight) {

    this.image = spriteSheet;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.frame = 0;
    this.changeFrame = true;

}

    // Draw the SpriteSheet at the current frame
    Canvas5.SpriteSheet.prototype.draw = function (context, vector) {
        
        // If we are going to change the animation frame
        if (this.changeFrame)

            // Increment frame
            this.frame++;

        // If false, stay silent

        // If we have reached the end of the frame list
        if (this.frame >= this.image.image.width /  this.spriteWidth)

            // Then return to the first frame
            this.frame = 0;

        // If false, stay silent

        context.drawImage(this.image.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, vector.x, vector.y, this.spriteWidth, this.spriteHeight);

    };

/*
    RGBSet object constructor
    desc: Creates a new Red-Green-Blue color value
*/

Canvas5.RGBSet = function (r, g, b) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 1;

}

    // Get the RGB values as a CSS string
    Canvas5.RGBSet.prototype.getAsString = function () {

        // Return a CSS RGB string value ("rgba(r, g, b)")
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";

    };

    Canvas5.RGBSet.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.getAsString();

        return 1;

    }

/*
    RGBASet object constructor
    desc: Creates a new Red-Green-Blue-Alpha color value
*/

Canvas5.RGBASet = function (r, g, b, a) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

}

    // Get the RGBA values as a CSS string
    Canvas5.RGBASet.prototype.getAsString = function () {

        // Return a CSS RGB string value ("rgba(r, g, b)")
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";

    };

    Canvas5.RGBASet.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.getAsString();

        return 1;

    }

/*
   HSLSet object constructor
   desc: Creates a new Hue-Saturation-Lightness color value
*/

Canvas5.HSLSet = function (h, s, l) {

    this.h = h;
    this.s = s;
    this.l = l;
    this.a = 255;

}

    // Get the HSL values as a CSS string
    Canvas5.HSLSet.prototype.getAsString = function () {

        // Return a CSS HSL string value ("hsl(h, s, l)")
        return "hsl(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";

    };

    Canvas5.HSLSet.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.getAsString();

        return 1;

    }

/*
    HSLASet object constructor
    desc: Creates a new Hue-Saturation-Lightness-Alpha color value
*/

Canvas5.HSLASet = function (h, s, l, a) {

    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;

}


    // Get the HSLA values as a CSS string
    Canvas5.HSLASet.prototype.getAsString = function () {

        // Return a CSS HSLA string value ("hsla(h, s, l, a)")
        return "hsla(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";

    };

    Canvas5.HSLASet.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.getAsString();

        return 1;

    };

Canvas5.Pattern = function (image, repeatType) {

    this.image = image;
    this.repeatType = repeatType;

}

    Canvas5.Pattern.prototype.draw = function (context) {

        if (this.repeatType !== "repeat" && this.repeatType !== "repeat-x" && this.repeatType !== "repeat-y" && this.repeatType !== "no-repeat")

            this.repeatType = "repeat";

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = context.createPattern(this.image.image, this.repeatType);

        return 1;

    };

Canvas5.ColorStop = function (position, color) {

    this.position = position;
    this.color = color;

}

Canvas5.LinearGradient = function (line, colorStops, context) {

    this.gradient = Canvas5.currentScene !== null ? Canvas5.currentScene.context.createLinearGradient(line.vectors[0].x, line.vectors[0].y, line.vectors[1].x, line.vectors[1].y) : context.createLinearGradient(line.vectors[0].x, line.vectors[0].y, line.vectors[1].x, line.vectors[1].y)
    this.colorStops = colorStops;

    var i;

    for (i = 0; i < this.colorStops.length; i++) {

        this.gradient.addColorStop(this.colorStop.position, this.colorStop.color.getAsString());

    }

}

    Canvas5.LinearGradient.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.gradient;

        return 1;

    }

Canvas5.RadialGradient = function (position, radius, end, endRadius, colorStops, context) {

    this.gradient = Canvas5.currentScene !== null ? Canvas5.currentScene.context.createRadialGradient(position.x, position.y, radius, end.x, end.y, endRadius) : context.createRadialGradient(line.vectors[0].x, line.vectors[0].y, line.vectors[1].x, line.vectors[1].y)
    this.colorStops = colorStops;

    var i;

    for (i = 0; i < this.colorStops.length; i++) {

        this.gradient.addColorStop(this.colorStop.position, this.colorStop.color.getAsString());

    }

}

    Canvas5.LinearGradient.prototype.draw = function (context) {

        context = context.x ? Canvas5.currentScene.context : context;
        context.fillStyle = this.gradient;

        return 1;

    }

/*
    Shadow object constructor
    desc: Creates a shadow that can be used on different objects
*/

Canvas5.Shadow = function (offsetX, offsetY) {

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.color = new Canvas5.RGBASet(0, 0, 0, 0.75);
    this.blur = 5;
    this.prototype = function () {

    };

}

    // Enable the shadow in the context
    Canvas5.Shadow.prototype.enable = function (context) {

        // Set context properties for the shadow
        context.shadowOffsetX = this.offsetX;
        context.shadowOffsetY = this.offsetY;
        context.shadowColor = this.color.getAsString();
        context.shadowBlur = this.blur;

    };

    // Disable the shadow in the context
    Canvas5.Shadow.prototype.disable = function (context) {

        // Set all shadow values to 0 and make the shadow transparent
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.color = "rgba(0, 0, 0, 0)";
        context.shadowBlur = 0;

    };
	
/*
* Bind() function
* (c) paulirish, mrdoob, alteredq
*/

function bind(scope, fn) {

    return function () {

        fn.apply(scope, arguments);

    };

};
