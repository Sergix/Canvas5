/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine dev1.3.2 Original Full Script
* (c) 2016 Sergix
*/


// Define Canvas5 version
const c5version = "dev1.3.2";

// On script load, log info to console
window.onload = function (evt) {

    console.info("Canvas5 JavaScript Engine; version" + c5version + "; (c) 2016 Sergix");
    console.warn("Using development build! May contain unknown errors!");

};

/*
    Scene object constructor
    desc: Used to render the screen and all its added objects.
*/

function Scene(domElement) {

    this.canvas = domElement || document.getElementById("CanvasGame");
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.sprites = [];
    this.actionList = [];
    this.menuList = [];
    this.changeColorList = [0, 0, 0, 0];
    this.colorList = [null, null, null, null];
    this.imageData = null;
    this.playerSprite = null;
    this.background = null;
    this.backgroundColor = "white";
    this.showInfo = false;

    // Pixel Manipulation
    this.modifyColors = function (rgba, _area) {

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

                // Change color list to current RGBA values
                this.colorList[0] = r;
                this.colorList[1] = g;
                this.colorList[2] = b;
                this.colorList[3] = a;

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
    this.getColors = function () {

        // Return the colorList array to the user
        return this.colorList;

    };

    // Define a new action (function) to be called at rendering time
    this.newAction = function (fn1, fn2) {

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
    this.add = function (sprite) {

        // Push the sprite to the sprites array
        this.sprites.push(sprite);

    };

    // Add a new menu to the scene to be rendered
    this.addMenu = function (menu) {

        // Push the menu to the menuList array
        this.menuList.push(menu);

    };

    // Remove a sprite from the sprites array
    this.remove = function (sprite) {

        // Get the index of the sprite to be removed in the sprites array
        var index = this.sprites.indexOf(sprite);

        // Check if the specified sprite is in sprites
        if (index > -1)

            // If true, remove the sprite from the array
            this.sprites.splice(index, 1);

        // Be silent if false

    };

    // Set the specified sprite to be rendered and updated as a player sprite
    this.setPlayerSprite = function (sprite) {

        // Set the playerSprite attribute to the provided sprite object
        this.playerSprite = sprite;

    };

    // Update the scene's collision
    this.update = function () {

        // Define local vars
        var i, j, e;

        // Loop through sprites for checking against player
        for (i = 0; i < this.sprites.length; i++) {

            // Check player boundaries
            if (this.playerSprite.boundaries !== null) {
                if (this.playerSprite.x < 0) this.playerSprite.x = 0;
                if (this.playerSprite.x + this.playerSprite.width > this.playerSprite.boundaries.width) this.playerSprite.x = this.playerSprite.boundaries.width - this.playerSprite.width;
                if (this.playerSprite.y < 0) this.playerSprite.y = 0;
                if (this.playerSprite.y + this.playerSprite.height > this.playerSprite.boundaries.height) this.playerSprite.y = this.playerSprite.boundaries.height - this.playerSprite.height;
            }

            // Set a local var to current sprite (for shorthand purposes)
            e = this.sprites[i];

            // Check if we are going to perfrom collision detection on the current sprite
            if (!e.collide)

                // If not, skip to next sprite
                continue;


            // Check to see if the player is colliding with the current sprite (AABB collision)
            if (this.playerSprite.x < e.x + e.width && this.playerSprite.x + this.playerSprite.width > e.x && this.playerSprite.y < e.y + e.height && this.playerSprite.y + this.playerSprite.height > e.y) {

                // Check to see which side the player is colliding on and perform a different operation for each

                // Left
                if (this.playerSprite.vx > 0) {
                    this.playerSprite.moveLeft = false;
                    if (!this.playerSprite.moveDown || !this.playerSprite.moveUp)
                        continue;

                    // Set new player x
                    this.playerSprite.x = e.x - this.playerSprite.width;
                    continue;
                }

                // Right
                if (this.playerSprite.vx < 0) {
                    this.playerSprite.moveRight = false;

                    // Set new player x
                    this.playerSprite.x = e.x + e.width;
                    continue;
                }

                // Top
                if (this.playerSprite.vy > 0) {
                    this.playerSprite.moveDown = false;

                    // Set new player y
                    this.playerSprite.y = e.y - this.playerSprite.height;
                    continue;
                }

                // Bottom
                if (this.playerSprite.vy < 0) {
                    this.playerSprite.moveUp = false;

                    // Set new player y
                    this.playerSprite.y = e.y + e.height;
                    continue;
                }

                

            } else {

                // Set all values to true
                this.playerSprite.moveLeft = true;
                this.playerSprite.moveRight = true;
                this.playerSprite.moveDown = true;
                this.playerSprite.moveUp = true;

            }

        } // end for

        // Loop through sprites for checking against other sprites
        for (i = 0; i < this.sprites.length; i++) {

            // Check if we are going to perfrom collision detection on the current sprite
            if (!this.sprites[i].collide)

                // If not, skip to next sprite
                continue;

            // Check sprite boundaries
            if (this.sprites[i].boundaries !== null) {
                if (this.sprites[i].x < 0) this.sprites[i].x = 0;
                if (this.sprites[i].x + this.sprites[i].width > this.sprites[i].boundaries.width) this.sprites[i].x = this.sprites[i].boundaries.width - this.sprites[i].width;
                if (this.sprites[i].y < 0) this.sprites[i].y = 0;
                if (this.sprites[i].y + this.sprites[i].height > this.sprites[i].boundaries.height) this.sprites[i].y = this.sprites[i].boundaries.height - this.sprites[i].height;
            }

            // Loop though sprites
            for (j = 0; j < this.sprites.length; j++) {

                // Check if we are going to perfrom collision detection on the current sprite
                if (!e.collide)
                    break;

                // Check if the loops are on the same indice
                if (i === j)

                    // If so, skip to next sprite
                    continue;

                // Set a local var to current sprite (for shorthand purposes)
                e = this.sprites[i];

                // Check to see if the sprites are colliding (AABB collision)
                if (this.sprites[i].x < e.x + e.width && this.sprites[i].x + this.sprites[i].width > e.x && this.sprites[i].y < e.y + e.height && this.sprites[i].y + this.sprites[i].height > e.y) {

                    // Check to see which side the sprite is colliding on and perform a different operation for each

                    // Left
                    if (this.sprites[i].vx > 0) {
                        this.sprites[i].moveLeft = false;

                        // Set new sprite x
                        this.sprites[i].x = e.x - this.sprites[i].width;
                    } else {
                        this.sprites[i].moveLeft = true;
                    }

                    // Right
                    if (this.sprites[i].vx < 0) {
                        this.sprites[i].moveRight = false;

                        // Set new sprite x
                        this.sprites[i].x = e.x + e.width;
                    } else {
                        this.sprites[i].moveRight = true;
                    }

                    // Top
                    if (this.sprites[i].vy > 0) {
                        this.sprites[i].moveDown = false;

                        // Set new sprite y
                        this.sprites[i].y = e.y - this.sprites[i].height;
                    } else {
                        this.sprites[i].moveDown = true;
                    }

                    // Bottom
                    if (this.sprites[i].vy < 0) {
                        this.sprites[i].moveUp = false;

                        // Set new sprite y
                        this.sprites[i].y = e.y + e.height;
                    } else {
                        this.sprites[i].moveUp = true;
                    }

                } // end if

            } // end for

        } // end for

        this.render();

    };

    // Update the scene's collision
    this.updateAsPlatformer = function (gravity) {

        // Define local vars
        var i, j, e;

        // Set the player's gravity (downward acceleration)
        this.playerSprite.ay = gravity;

        // Loop through sprites for checking against player
        for (i = 0; i < this.sprites.length; i++) {

            // Check player boundaries
            if (this.playerSprite.boundaries !== null) {
                if (this.playerSprite.x < 0) this.playerSprite.x = 0;
                if (this.playerSprite.x + this.playerSprite.width > this.playerSprite.boundaries.width) this.playerSprite.x = this.playerSprite.boundaries.width - this.playerSprite.width;
                if (this.playerSprite.y < 0) this.playerSprite.y = 0;
                if (this.playerSprite.y + this.playerSprite.height > this.playerSprite.boundaries.height) this.playerSprite.y = this.playerSprite.boundaries.height - this.playerSprite.height;
            }

            // Set a local var to current sprite (for shorthand purposes)
            e = this.sprites[i];

            // Check if we are going to perfrom collision detection on the current sprite
            if (!e.collide)

                // If not, skip to next sprite
                continue;


            // Check to see if the player is colliding with the current sprite (AABB collision)
            if (this.playerSprite.x < e.x + e.width && this.playerSprite.x + this.playerSprite.width > e.x && this.playerSprite.y < e.y + e.height && this.playerSprite.y + this.playerSprite.height > e.y) {

                // Check to see which side the player is colliding on and perform a different operation for each

                // Top
                if (this.playerSprite.vy > 0) {
                    this.playerSprite.moveDown = false;

                    // Set new player y
                    this.playerSprite.y = e.y - this.playerSprite.height;
                    continue;
                }

                // Bottom
                if (this.playerSprite.vy < 0) {
                    this.playerSprite.moveUp = false;

                    // Set new player y
                    this.playerSprite.y = e.y + e.height;
                    continue;
                }

                // Left
                if (this.playerSprite.vx > 0) {
                    this.playerSprite.moveLeft = false;
                    if (!this.playerSprite.moveDown || !this.playerSprite.moveUp)
                        continue;

                    // Set new player x
                    this.playerSprite.x = e.x - this.playerSprite.width;
                    continue;
                }

                // Right
                if (this.playerSprite.vx < 0) {
                    this.playerSprite.moveRight = false;

                    // Set new player x
                    this.playerSprite.x = e.x + e.width;
                    continue;
                }

            } else {

                // Set all values to true
                this.playerSprite.moveLeft = true;
                this.playerSprite.moveRight = true;
                this.playerSprite.moveDown = true;
                this.playerSprite.moveUp = true;

            }

        } // end for

        // Loop through sprites for checking against other sprites
        for (i = 0; i < this.sprites.length; i++) {

            // Check if we are going to perfrom collision detection on the current sprite
            if (!this.sprites[i].collide)

                // If not, skip to next sprite
                continue;

            // Check sprite boundaries
            if (this.sprites[i].boundaries !== null) {
                if (this.sprites[i].x < 0) this.sprites[i].x = 0;
                if (this.sprites[i].x + this.sprites[i].width > this.sprites[i].boundaries.width) this.sprites[i].x = this.sprites[i].boundaries.width - this.sprites[i].width;
                if (this.sprites[i].y < 0) this.sprites[i].y = 0;
                if (this.sprites[i].y + this.sprites[i].height > this.sprites[i].boundaries.height) this.sprites[i].y = this.sprites[i].boundaries.height - this.sprites[i].height;
            }

            // Loop though sprites
            for (j = 0; j < this.sprites.length; j++) {

                // Check if we are going to perfrom collision detection on the current sprite
                if (!e.collide)
                    break;

                // Check if the loops are on the same indice
                if (i === j)

                    // If so, skip to next sprite
                    continue;

                // Set a local var to current sprite (for shorthand purposes)
                e = this.sprites[i];

                // Check to see if the sprites are colliding (AABB collision)
                if (this.sprites[i].x < e.x + e.width && this.sprites[i].x + this.sprites[i].width > e.x && this.sprites[i].y < e.y + e.height && this.sprites[i].y + this.sprites[i].height > e.y) {

                    // Check to see which side the sprite is colliding on and perform a different operation for each

                    // Left
                    if (this.sprites[i].vx > 0) {
                        this.sprites[i].moveLeft = false;

                        // Set new sprite x
                        this.sprites[i].x = e.x - this.sprites[i].width;
                    } else {
                        this.sprites[i].moveLeft = true;
                    }

                    // Right
                    if (this.sprites[i].vx < 0) {
                        this.sprites[i].moveRight = false;

                        // Set new sprite x
                        this.sprites[i].x = e.x + e.width;
                    } else {
                        this.sprites[i].moveRight = true;
                    }

                    // Top
                    if (this.sprites[i].vy > 0) {
                        this.sprites[i].moveDown = false;

                        // Set new sprite y
                        this.sprites[i].y = e.y - this.sprites[i].height;
                    } else {
                        this.sprites[i].moveDown = true;
                    }

                    // Bottom
                    if (this.sprites[i].vy < 0) {
                        this.sprites[i].moveUp = false;

                        // Set new sprite y
                        this.sprites[i].y = e.y + e.height;
                    } else {
                        this.sprites[i].moveUp = true;
                    }

                } // end if

            } // end for

        } // end for

        this.render();

    };

    // Render the current scene and all its current and visible objects
    this.render = function () {

        // Render the background
        if (this.background !== null) {

            // Draw the image specified in background
            this.context.drawImage(this.background.image, 0, 0, this.width, this.height);

        } else {

            // Draw the color specified in backgroundColor
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.width, this.height);

        }

        // Loop through sprites and update each
        for (i = 0; i < this.sprites.length; i++)
            this.sprites[i].update(this.context);

        // Update the player's sprite
        this.playerSprite.update(this.context);

        // If showInfo is true, display information about the scene (n of sprites being rendered)
        if (this.showInfo) {

            this.context.font = "13pt sans-serif";
            this.context.color = "black";
            this.context.fillText("60 FPS; " + (this.sprites.length + 1) + " objects", 10, 20);

        }

        // Loop though actions
        for (i = 0; i < this.actionList.length; i++) {

            var result = this.actionList[i].condition();

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

}

/*
    Vector object constructor
    desc: Contains data about a certain defined point on the canvas
*/

function Vector(x, y) {

    this.x = x;
    this.y = y;

}

/*
    Polygon object constructor
    desc: Used to draw a polygon on a scene
*/

function Polygon(vectors) {

    this.vectors = vectors;
    this.color = RGBSet(0, 0, 0);
    this.lineWidth = 1;
    this.lineCap = "butt";
    this.fill = false;
    this.shadow = null;
    this.visible = true;

    // Dummy function, only used to be drawn from a scene
    this.update = function (context) {

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

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent

    };

    // Draw the line
    this.draw = function (context) {

        // Define local vars
        var i;

        // Set drawing parameters
        context.fillStyle = this.color.getAsString();
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

}

/*
    Line object constructor
    desc: Used to draw a simple line between two vectors on a scene
*/

function Line(v1, v2) {

    this.vectors = [v1, v2];
    this.color = RGBSet(0, 0, 0);
    this.width = 1;
    this.shadow = null;
    this.visible = true;

    // Dummy function, only used to be drawn from a scene
    this.update = function (context) {

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent

    };

    // Draw the line
    this.draw = function (context) {

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

}

/*
    Curve object constructor
    desc: Draws either a quadratic or bezier curve
*/

function Curve(vectors, type) {

    this.vectors = vectors;
    this.type = type || "quadratic";
    this.shadow = null;
    this.visible = true;

    // Update the curve
    this.update = function (context) {

        // If type is not valid
        if (this.type !== "quadratic" && this.type !== "bezier") {

            // Log error
            console.error("Type attribute must be either \"quadratic\" or \"bezier\"! {Curve.update(), " + this.type + "}");

            // Then exit function
            return 0;

        } // If false, stay silent

        // If length is not valid
        if ((this.vectors.length !== 3 && this.type === "quadratic") || (this.vectors.length !== 4 && this.type === "bezier")) {

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

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent

    };

    // Draw the curve
    this.draw = function (context) {

        // Define local vars
        var i;
        
        // Start path
        context.beginPath();
        context.moveTo(this.vectors[0].x, this.vectors[0].y);

        // If curve type is quadratic
        if (this.type === "quadratic")

            // Then draw the curve
            context.quadraticCurveTo(this.vectors[1].x, this.vectors[1].y, this.vectors[2].x, this.vectors[2].y);
        else

            // Otherwise, draw a bezier curve
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

}

/*
    Sprite object constructor
    desc: Defines an object that can be used to draw an image on the screen with other various modifiable properties
*/

function Sprite(image) {

    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.canMove = true;
    this.oldX = 0;
    this.oldY = 0;
    this.image = image || null;
    this.width = this.image === null ? 0 : this.image.image.width;
    this.height = this.image === null ? 0 : this.image.image.height;
    this.boundaries = null;
    this.collide = true;
    this.name = null;
    this.spriteSheet = null;
    this.frame = 0;
    this.changeFrame = true;
    this.activeKeys = [];
    this.keybinds = [];
    this.moveLeft = true;
    this.moveRight = true;
    this.moveDown = true;
    this.moveUp = true;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.clicked = false;
    this.activeButtons = [];
    this.shadow = null;
    this.visible = true;
    this.rotate = 0;
    this.scale = [0, 0];
    this.onGround = false;

    // Get the mouse data as set in mousePositionX and mousePositionY
    this.getMouseData = function () {

        // Return an array of the data [x, y]
        return [this.mousePositionX, this.mousePositionY];

    };

    // Check if a requested key is pressed
    this.isKeyPressed = function (key) {

        // If it exists in activeKeys
        if (this.activeKeys.indexOf(key) > -1)

            // Return true
            return 1;
        else

            // Otherwise, return false
            return 0;

    };

    // Check if a requested mouse button is pressed
    this.isButtonPressed = function (button) {

        // If it exists in activeButtons
        if (this.activeButtons.indexOf(button) > -1)

            // Return true
            return 1;
        else

            // Otherwise, return false
            return 0;

    };

    // Check if the sprite is near the other specified sprite by "units" pixels
    this.near = function (sprite, units) {

        // If true
        if (distance(this.x, this.y, sprite.x, sprite.y) <= units)

            // Return true
            return 1;
        else

            // Otherwise, return false
            return 0;

    };

    // Set the name of the sprite to be visibly rendered
    this.setName = function (text) {

        this.name = text;

    };

    // Set the (x,y) position of the sprite
    this.setPosition = function (x, y) {

        this.x = x;
        this.y = y;

    };

    // Set the (x,y) velocity of the sprite
    this.setVelocity = function (vx, vy) {

        this.vx = vx;
        this.vy = vy;

    };

    // Set the (x,y) acceleration of the object
    this.setAccel = function (ax, ay) {

        this.ax = ax;
        this.ay = ay;

    };

    // Make the sprite jump using the provided velocity and gravity
    this.jump = function (velocity, gravity, onGround) {

        // Incase onGround was undefined then set it to true
        onGround = onGround || true;

        // If the player can only jump if he is on the ground
        if (!this.onGround && onGround) 
        
            // Then return nothing
            return 0;

        // If false, stay silent

        // Set the velocity and acceleration of the sprite
        this.vy = -velocity;
        this.ay = gravity;

    };

    // Add a new keybind that will run (fn) upon press
    this.addKeybind = function (key, fn) {

        // Push the keybind object to the keybinds array property
        this.keybinds.push({ key: key, fn: fn });

    };

    // Add basic keyboard controls to the sprite
    this.addBasicControls = function (movementSpeed) {

        // Set the speed property of the sprite
        this.speed = movementSpeed;

        // Add event listeners to the provided DOM object
        window.addEventListener('keydown', bind(this, this.onKeyDown), false);
        window.addEventListener('keyup', bind(this, this.onKeyUp), false);

    };

    this.addPlatformerControls = function (movementSpeed) {

        // Set the speed property of the sprite
        this.speed = movementSpeed;

        // Add event listeners to the provided DOM object
        window.addEventListener('keydown', bind(this, this.onKeyDownPlatformer), false);
        window.addEventListener('keyup', bind(this, this.onKeyUpPlatformer), false);

    };

    // Add an event listener for the mouse to the sprite
    this.addMouseListener = function () {

        // Add event listeners to the provided DOM object
        window.addEventListener('mousemove', bind(this, this.onMouseMove), false);
        window.addEventListener('mousedown', bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup', bind(this, this.onMouseUp), false);
    };

    // Called if event listener is active
    this.onMouseMove = function (evt) {

        // Set the mousePositionX and mousePositionY properties
        this.mousePositionX = evt.pageX;
        this.mousePositionY = evt.pageY;

    };

    // Called if event listener is active
    this.onMouseDown = function (evt) {

        // Switch for button code
        switch (evt.button) {

            // Set various values based on mouse input
            case 0: /*left*/

                // If the mouse is pressed on top of the sprite
                if (this.mousePositionX >= this.x && this.mousePositionX <= this.x + this.width && this.mousePositionY >= this.y && this.mousePositionY <= this.y + this.width)

                    // Set the clicked property to true
                    this.clicked = true;

                // Then break
                break;

        }

        // Push the current button code to the activeButton array
        this.activeButtons.push(evt.button);

    };

    // Called if event listener is active
    this.onMouseUp = function (evt) {

        // Get the index of the button code in activeButtons
        var index = this.activeButtons.indexOf(evt.button);

        // If it exists in activeButtons
        if (index > -1)

            // Then remove it from the array
            this.activeButtons.splice(index, 1);

        // Set the clicked property to false
        this.clicked = false;

    };

    // Called if event listener is active
    this.onKeyDownPlatformer = function (evt) {

        // Switch for the current key code
        switch (evt.keyCode) {

            // Set the velocity to "speed" based on what key is pressed
            case 37: /*left*/ this.vx = -this.speed; break;
            case 65: /*A*/    this.vx = -this.speed; break;
            case 40: /*down*/ this.vy = this.speed; break;
            case 83: /*S*/    this.vy = this.speed; break;
            case 39: /*right*/this.vx = this.speed; break;
            case 68: /*D*/    this.vx = this.speed; break;
            case 32: /*space*/this.jump(-400, 600); break;
            default: break;

        }

        // Push the key code to the activeKeys array
        this.activeKeys.push(evt.keyCode);

    };

    // Called if event listener is active
    this.onKeyUpPlatformer = function (evt) {

        // Switch for current key code
        switch (evt.keyCode) {

            // Set the velocity to 0 based on what key is pressed
            case 38: /*up*/   this.vy = 0; break;
            case 87: /*W*/    this.vy = 0; break;
            case 37: /*left*/ this.vx = 0; break;
            case 65: /*A*/    this.vx = 0; break;
            case 40: /*down*/ this.vy = 0; break;
            case 83: /*S*/    this.vy = 0; break;
            case 39: /*right*/this.vx = 0; break;
            case 68: /*D*/    this.vx = 0; break;
            default: break;

        }

        // Get the index of the key in activeKeys
        var index = this.activeKeys.indexOf(evt.keyCode);

        // If it exists in activeKeys
        if (index > -1)

            // Then remove it from the array
            this.activeKeys.splice(index, 1);

    };

    // Called if event listener is active
    this.onKeyDown = function (evt) {

        // Switch for the current key code
        switch (evt.keyCode) {

            // Set the velocity to "speed" based on what key is pressed
            case 38: /*up*/   this.vy = -this.speed; break;
            case 87: /*W*/    this.vy = -this.speed; break;
            case 37: /*left*/ this.vx = -this.speed; break;
            case 65: /*A*/    this.vx = -this.speed; break;
            case 40: /*down*/ this.vy = this.speed; break;
            case 83: /*S*/    this.vy = this.speed; break;
            case 39: /*right*/this.vx = this.speed; break;
            case 68: /*D*/    this.vx = this.speed; break;
            default: break;

        }

        // Push the key code to the activeKeys array
        this.activeKeys.push(evt.keyCode);

    };

    // Called if event listener is active
    this.onKeyUp = function (evt) {

        // Switch for current key code
        switch (evt.keyCode) {

            // Set the velocity to 0 based on what key is pressed
            case 38: /*up*/   this.vy = 0; break;
            case 87: /*W*/    this.vy = 0; break;
            case 37: /*left*/ this.vx = 0; break;
            case 65: /*A*/    this.vx = 0; break;
            case 40: /*down*/ this.vy = 0; break;
            case 83: /*S*/    this.vy = 0; break;
            case 39: /*right*/this.vx = 0; break;
            case 68: /*D*/    this.vx = 0; break;
            default: break;

        }

        // Get the index of the key in activeKeys
        var index = this.activeKeys.indexOf(evt.keyCode);

        // If it exists in activeKeys
        if (index > -1)

            // Then remove it from the array
            this.activeKeys.splice(index, 1);

    };

    // Used to update the sprite's collision, position, and animation frame
    this.update = function (context) {

        // Define local vars
        var i;

        // Loop through the keybinds array property
        for (i = 0; i < this.keybinds.length; i++)

            // If the key is pressed of the current array indice
            if (this.isKeyPressed(this.keybinds[i].key))

                // Then run the function associated with the key
                this.keybinds[i].fn();

            // If false, stay silent


        // If the scale is 0
        if (this.scale === [0, 0])

            // Then set it to the width and height of the sprite
            this.scale = [this.width, this.height];

        // Then set it to the width and height of the sprite

        // Check to see if the spriteSheet property is null
        // (used on first call to update)
        if (this.spriteSheet === null)

            // If true, create a sprite sheet object containing the image property (for drawing)
            this.spriteSheet = new SpriteSheet([this.image]);

        // If false, stay silent

        // Check to see if the width and height have been set yet
        // (used on first call to update)
        if (this.width === 0 && this.height === 0) {

            // If true, set the width and height to the image's properties
            this.width = this.spriteSheet.images[0].image.width;
            this.height = this.spriteSheet.images[0].image.height;

        } // If false, stay silent

        // Set velocity if collision detection was recently performed
        if (!this.moveLeft && this.vx > 0)
            this.vx = 0;
        else
            this.moveLeft = true;

        if (!this.moveRight && this.vx < 0)
            this.vx = 0;
        else
            this.moveRight = true;

        if (!this.moveDown && this.vy > 0) {
            this.onGround = true;
            this.vy = 0;
        } else {
            this.onGround = false;
            this.moveDown = true;
        }

        if (!this.moveUp && this.vy < 0)
            this.vy = 0;
        else
            this.moveUp = true;

        // Update the position and velocity
        this.vx += this.ax / 60;
        this.vy += this.ay / 60;
        this.x += this.vx / 60;
        this.y += this.vy / 60;

        // If we are going to change the animation frame
        if (this.changeFrame)

            // Increment frame
            this.frame++;

        // If false, stay silent

        // If we have reached the end of the frame list
        if (this.frame === this.spriteSheet.images.length)

            // Then return to the first frame
            this.frame = 0;

        // If false, stay silent

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent
    };

    this.transform = function (rotate, scale) {

        this.rotate = rotate;
        this.scale = scale;

    };

    // Draw the sprite on the provided context
    this.draw = function (context) {

        // If we are to transform the sprite
        if (this.rotate !== 0 || this.scale[0] !== 0 || this.scale[1] !== 0) {

            // Set properties for transformations
            context.save();
            context.rotate(this.rotate);
            context.scale(this.scale[0], this.scale[1]);

            // Draw the image on the canvas at (x,y) at the current frame
            context.drawImage(this.spriteSheet.images[this.frame].image, this.x, this.y);

            // Draw the new coord system
            context.restore();

        } else

            // Otherwise, draw the image on the canvas at (x,y) at the current frame
            context.drawImage(this.spriteSheet.images[this.frame].image, this.x, this.y);
        
        // If the name property is not set
        if (this.name === null)

            // Then return true
            return 1;

        // If false, stay silent

        // Draw the sprite's name
        this.name.x = this.x;
        this.name.y = this.y - 25;
        this.name.draw(context);

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

        // If false, stay silent

    };
}

/*
    GameMenu object constructor
    desc: Creates a visible menu that can contain buttons and other text that can be clicked
*/

function GameMenu() {

    this.x = 0;
    this.y = 0;
    this.elements = [];
    this.alwaysActive = false;
    this.collide = false;
    this.background = null;
    this.backgroundColor = new RGBSet(255, 255, 255);
    this.width = 200;
    this.height = 200;
    this.editMode = false;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.dragging = false;

    // Add a new element to the menu
    this.add = function (element) {

        // Push the provided element to the elements array
        this.elements.push(element);

    };

    // Add a mouse event listener to the menu
    this.addMouseListener = function () {

        // Add a listener to the provided DOM object
        window.addEventListener('mousemove', bind(this, this.onMouseMove), false);
        window.addEventListener('mousedown', bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup', bind(this, this.onMouseUp), false);

    };

    // Called if event listener is active
    this.onMouseMove = function (evt) {

        // Set the mouse position properties
        this.mousePositionX = evt.pageX;
        this.mousePositionY = evt.pageY;

        // If we are dragging the mouse
        if (this.dragging !== false) {

            // Then set the position of the object being dragged to the current mouse position
            this.dragging.x = this.mousePositionX;
            this.dragging.y = this.mousePositionY;

        } // If false, stay silent

    };

    // Called if event listener is active
    this.onMouseDown = function (evt) {

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
                        if (this.mousePositionX >= this.elements[i].x && this.mousePositionX <= this.elements[i].x + 100 && this.mousePositionY >= this.elements[i].y && this.mousePositionY <= this.elements[i].y + 100)

                            // If true, set the dragging property to the current element index
                            this.dragging = this.elements[i];

                        // If false, stay silent

                        // Then break (we only want to drag one object at a time)
                        break;
                    }

                    // If the current object is not a text element, and the mouse is colliding with it (AABB collsion)
                    if (this.mousePositionX >= this.elements[i].x && this.mousePositionX <= this.elements[i].x + this.elements[i].width && this.mousePositionY >= this.elements[i].y && this.mousePositionY <= this.elements[i].y + this.elements[i].width)

                        // Then set the dragging property to the current element index
                        this.dragging = this.elements[i];

                    // If false, stay silent

                } // end for

                // Do not continue in switch
                break;

        } // end switch

    };

    // Called if event listener is active
    this.onMouseUp = function (evt) {

        // Set the dragging property to false
        this.dragging = false;

    };

    // Updates the menu
    this.update = function (context) {

        // If edit mode is enabled
        if (this.editMode !== false)

            // Add a mouse listener to the menu using "editMode" DOM object
            this.addMouseListener(this.editMode);

        // If false, stay silent

        // If we are dragging an object
        if (this.dragging !== false) {

            // Then update the current selected element's position
            this.dragging.x = this.mousePositionX;
            this.dragging.y = this.mousePositionY;

        } // If false, stay silent

        // If we are to draw the menu automatically
        if (this.alwaysActive)

            // Call draw
            this.draw(context);

        // If false, stay silent

    };

    // Updates the menu, used if the alwaysActive property is false
    this.active = function (scene) {

        // Call update using the scene's context
        this.update(scene.context, null);

    };

    // Draw the menu
    this.draw = function (context) {

        // If the background is an RGBASet
        if (this.backgroundColor.r !== undefined)

            // Then set the fillStyle to a color string ("rgba(r, g, b, a)")
            context.fillStyle = this.backgroundColor.getAsString();

        else

            // Otherwise, set the fillStyle to whatever background color is
            context.fillStyle = this.backgroundColor;

        // If the bacground is an image
        if (this.background !== null)

            // Then draw the image
            context.drawImage(this.background.image, this.x, this.y, this.width, this.height);
        else

            // Otherwise, fill the scene with the set color
            context.fillRect(this.x, this.y, this.width, this.height);

        // Loop through the menu's elements
        for (var i = 0; i < this.elements.length; i++) {

            // Update the current element
            this.elements[i].update(context);

            // If we are dragging an element
            if (this.dragging !== false) {

                // Render text showing (x,y) of the element being dragged
                context.fillStyle = "white";
                context.font = "14pt sans-serif";
                context.fillText(this.elements[i].x + ", " + this.elements[i].y, this.elements[i].x, this.elements[i].y - 30);

            } // If false, stay silent

        } // end for

    }; // end function

}

/*
    Button object constructor
    desc: A simple button that can be clicked and can be set to any color and can use any text
*/

function Button(text, rect) {

    this.x = 0;
    this.y = 0;
    this.text = text;
    this.rect = rect;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.clicked = false;
    this.width = this.rect.width;
    this.height = this.rect.height;
    this.visible = true;

    // Add a mouse event listener to the button
    this.addMouseListener = function () {

        // Bind listener functions to mouse events using the provided DOM object
        window.addEventListener('mousemove', bind(this, this.onMouseMove), false);
        window.addEventListener('mousedown', bind(this, this.onMouseDown), false);
        window.addEventListener('mouseup', bind(this, this.onMouseUp), false);

    };

    // Called if event listener is active
    this.onMouseMove = function (evt) {

        // Set the mousePositionX and mousePositionY properties to the mouse's (x,y)
        this.mousePositionX = evt.pageX;
        this.mousePositionY = evt.pageY;

    };

    // Called if event listener is active
    this.onMouseDown = function (evt) {

        // Switch through mouse buttons
        switch (evt.button) {

            // If left mouse button is down
            case 0: /*left*/

                // If the mouse is colliding against the button (AABB collision)
                if (this.mousePositionX >= this.x && this.mousePositionX <= this.x + this.rect.width && this.mousePositionY >= this.y && this.mousePositionY <= this.y + this.rect.width)

                    // Then set the clicked property to true
                    this.clicked = true;

                // If false, stay silent

                // Then break
                break;
        }

    };

    // Called if event listener is active
    this.onMouseUp = function (evt) {

        // Set the clicked property to false
        this.clicked = false;

    };

    // Set the position of the button
    this.setPosition = function (x, y) {

        // Set the (x,y) of the button
        this.x = x;
        this.y = y;

    };

    // Update the button using the provided context
    this.update = function (context) {

        // Draw the button's shape
        this.rect.draw(context);

        // If the mouse is colliding with the button (AABB collision)
        if (this.mousePositionX >= this.x && this.mousePositionX <= this.x + this.rect.width && this.mousePositionY >= this.y && this.mousePositionY <= this.y + this.rect.height)

            // Then draw the button using a slightly lighter color
            this.rect.draw(context, new RGBASet(this.rect.color.r + 50, this.rect.color.g + 50, this.rect.color.b + 50, this.rect.color.a));

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

        // If the object is visible
        if (this.visible)

            // Then draw it
            this.draw(context);

         // If false, stay silent

    };

    // Used to draw the button's text
    this.draw = function (context) {

        // Draw the text
        this.text.draw(context);

    };

}

/*
    Rect object constructor
    desc: A rectangle that can be drawn at any width and height
*/

function Rect(width, height) {

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.color = new RGBASet(100, 100, 100, 1);
    this.border = this.color;
    this.borderWidth = 2;
    this.shadow = null;
    this.visible = true;
    this.collide = false;

    // Set the rect's position to (x,y)
    this.setPosition = function (x, y) {

        // Set the (x,y) properties
        this.x = x;
        this.y = y;

    };

    // Upadte the rect using the provided context
    this.update = function (context) {

        // Update the (x,y) using the set velocity
        this.x += this.vx / 60;
        this.y += this.vy / 60;

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
    this.draw = function (context, color) {

        // If the user provided a color
        if (color !== undefined) {

            // Then set the fillStyle and strokeStyle to it
            context.fillStyle = color.getAsString();
            context.strokeStyle = this.border.getAsString();

        } else {

            // Otherwise, set the fillStyle and strokeStyle to the set color property
            context.fillStyle = this.color.getAsString();
            context.strokeStyle = this.border.getAsString();

        }

        // Draw the rect
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

    };

}

/*
    Circle object constructor
    desc: A simple circle that can be drawn using any radius
*/

function Circle(size) {

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = size;
    this.color = "white";
    this.border = this.color;
    this.borderWidth = 2;
    this.shadow = null;
    this.visible = true;

    // Set the position of the circle
    this.setPosition = function (x, y) {

        // Set the (x,y) property to (x,y)
        this.x = x;
        this.y = y;

    };

    // Update the circle
    this.update = function (context) {

        // Update the (x,y) property using the set velocity
        this.x += this.vx / 60;
        this.y += this.vy / 60;

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

    // Draw the circle
    this.draw = function (context) {

        // Set the color, border, border width
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        context.lineWidth = this.borderWidth;

        // Draw the circle
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.stroke();

        // If user defined a shadow
        if (this.shadow !== null)

            // Then disable it, since we already drew it
            this.shadow.disable(context);

    };

}

/*
    Client object constructor
    desc: Establishes a connection to a WebSocket and can be used to send and pull data from it
*/

function Client(url) {

    this.url = url;
    server = new WebSocket(url);
    currentData = null;

    // Called on messages or events from the socket
    this.event = function (event) {

        // Set the currentData property to whatever was sent
        currentData = event;

    };

    // Send a new message to the socket
    this.sendMessage = function (data) {

        // Send the data
        server.send(data);

    };

    // Get the last message recieved from the socket
    this.getMessage = function () {

        // Return the data to the user
        return currentData.data;

    };

    // Called automatically to connect to the server
    this.setup = function () {

        // Warn the user of possible errors
        console.warn("Canvas5 WebSocket implementation is currently very limited and buggy!");

        // Set the event handlers
        server.onopen = this.event;
        server.onclose = this.event;
        server.onmessage = this.event;
        server.onerror = this.event;

    };

    // Call setup to connect to the server
    this.setup();

}

/*
    LocalStorageSet object constructor
    desc: Sets key:value pairs in the localStorage of the browser
*/

function LocalStorageSet() {

    this.keyList = [];

    // Create a new key:value pair
    this.newItem = function (key, value) {

        // Set the data in the global localStorage database
        localStorage.setItem(key, value);

        // Push the item to the keyList array
        this.keyList.push(key);

    };

    // Get an item set in localStorage
    this.getItem = function (key) {

        // Return the data to the user
        return localStorage.getItem(key);

    };

    // Get all the items that have been set in localStorage (through this instance)
    this.getAllItems = function () {

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
    this.clear = function () {

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

}

/*
    AudioElement object constructor
    desc: Creates a new HTML audio element that can be played using JavaScript
*/

function AudioElement(src) {

    this.domElement = document.createElement('audio');
    this.src = src;

    // Play the audio
    this.play = function () {

        // Play the audio using the audio HTML element
        this.domElement.play();

    };

    // Pause the audio
    this.pause = function () {

        // Pause the audio using the audio HTML element
        this.domElement.pause();

    };

    // Pause the audio and rewind it to the beginning
    this.stop = function () {

        // Pause the audio
        this.pause();

        // Set the current audio time to 0
        this.setTime(0);

    };

    // Set the audio play time
    this.setTime = function (time) {

        // Change the currentTime DOM property of the audio
        this.domElement.currentTime = time;

    };

    // Set the audio volume
    this.setVolume = function (volume) {

        // Change the volume DOM property of the audio
        this.domElement.volume = volume;

    };

    // Called automatically on new instance
    this.setup = function () {

        // Set the source of the audio to the filepath provided
        this.domElement.setAttribute('src', this.src);

    };

    // Call setup to setup the audio
    this.setup();
}

/*
    MessageBox object constructor
    desc: A block of text that can be drawn on the screen
*/

function MessageBox(text, x, y) {

    this.x = x || 0;
    this.y = y || 0;
    this.text = text;
    this.font = "12pt sans-serif";
    this.color = new RGBASet(100, 100, 100, 1);
    this.shadow = null;
    this.alwaysActive = false;

    // Set the position of the text using (x,y)
    this.setPosition = function (x, y) {

        // Set the (x,y) position of the text
        this.x = x;
        this.y = y;

    };

    // Update the text
    this.update = function (context) {

        // If user defined a shadow
        if (this.shadow !== null)

            // Then enable it
            this.shadow.enable(context);

        // If false, stay silent

        // If it is to be drawn automatically
        if (this.alwaysActive !== false)

            // Then draw it
            this.draw(context);

        // If false, stay silent

    };

    // Activate the text, called by the user
    this.active = function (scene) {

        // Draw the text
        this.draw(scene.context);

    };

    // Draw the text using the provided context
    this.draw = function (context) {

        // Set the color of the text using the color property
        context.fillStyle = this.color.getAsString();

        // Set the font of the text using the font property
        context.font = this.font;

        // Draw the text at (x,y)
        context.fillText(this.text, this.x, this.y);

        // If the user defined a shadow
        if (this.shadow !== null)

            // Then disable it since we already drew the text
            this.shadow.disable(context);

    };

}

/*
    Dialogue object constructor
    desc: Uses a MessageBox array to loop through as dialogue
*/

function Dialogue(text) {

    this.text = text;
    this.index = 0;

    // Go to next line of dialogue
    this.next = function () {

        // Increment index
        this.index++;

        // If index is over dialogue length
        if (this.index >= this.text.length)

            // Then set index to 0
            this.index = 0;

        // If false, stay silent

    }

    // Update the current text
    this.update = function (context) {

        // Update and draw the text
        this.text[this.index].update(context);

    };

}

/*
    GameImage object constructor
    desc: Used to create a new DOM image
*/

function GameImage(src) {

    this.image = new Image();
    this.src = src;

    // Called automatically upon new instance
    (function (obj) {

        // Set the source of the image property
        obj.image.src = obj.src;

    })(this);

}

/*
    SpriteSheet object constructor
    desc: A collection of images used for animation
*/

function SpriteSheet(sprites) {

    this.images = sprites;

}

/*
    RGBSet object constructor
    desc: Creates a new Red-Green-Blue color value
*/

function RGBSet(r, g, b) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;

    // Get the RGB values as a CSS string
    this.getAsString = function () {

        // Return a CSS RGB string value ("rgba(r, g, b)")
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";

    }

}

/*
    RGBASet object constructor
    desc: Creates a new Red-Green-Blue-Alpha color value
*/

function RGBASet(r, g, b, a) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    // Get the RGBA values as a CSS string
    this.getAsString = function () {

        // Return a CSS RGBA string value ("rgba(r, g, b, a)")
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";

    }

}

/*
   HSLSet object constructor
   desc: Creates a new Hue-Saturation-Lightness color value
*/

function HSLSet(h, s, l) {

    this.h = h;
    this.s = s;
    this.l = l;
    this.a = 255;

    // Get the HSL values as a CSS string
    this.getAsString = function () {

        // Return a CSS HSL string value ("hsl(h, s, l)")
        return "hsl(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";

    }

}

/*
    HSLASet object constructor
    desc: Creates a new Hue-Saturation-Lightness-Alpha color value
*/

function HSLASet(h, s, l, a) {

    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;

    // Get the HSLA values as a CSS string
    this.getAsString = function () {

        // Return a CSS HSLA string value ("hsla(h, s, l, a)")
        return "hsla(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";

    }

}

/*
    Shadow object constructor
    desc: Creates a shadow that can be used on different objects
*/

function Shadow (offsetX, offsetY) {

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.color = new RGBASet(0, 0, 0, 0.75);
    this.blur = 5;

    // Enable the shadow in the context
    this.enable = function (context) {

        // Set context properties for the shadow
        context.shadowOffsetX = this.offsetX;
        context.shadowOffsetY = this.offsetY;
        context.shadowColor = this.color.getAsString();
        context.shadowBlur = this.blur;

    };

    // Disable the shadow in the context
    this.disable = function (context) {

        // Set all shadow values to 0 and make the shadow transparent
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.color = "rgba(0, 0, 0, 0)";
        context.shadowBlur = 0;

    };

}

/*
    Helper functions:
    - Rad2Deg
    - isColliding
    - distance
*/

// Radians to (2) Degrees
function Deg2Rad(degrees) {

    // Return the new value
    return degrees * (Math.PI / 180);

}

// Degrees to (2) Radians
function Rad2Deg(radians) {

    // Return the new value
    return radians / (Math.PI / 180);

}

function isColliding(xy1, xy2) {

    // If the two objects are colliding (AABB collision)
    if (xy1.x >= xy2.x && xy1.x <= xy2.x + xy2.width && xy1.y >= xy2.y && xy1.y <= xy2.y + xy2.height)

        // Then return true
        return true;

    else

        // Otherwise, return false
        return false;

}

function distance(x0, y0, x1, y1) {

    // Get the distance between two points
    // Set local vars
    var dx = x1 - x0, dy = y1 - y0;

    // Return the square root of dx squared plus dy squared, which gets the distance
    return Math.sqrt((dx * dx) + (dy * dy));

}

function getKeyCode(code) {

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

/*
* Bind() function
* (c) paulirish, mrdoob, alteredq
*/
function bind(scope, fn) {

    return function () {

        fn.apply(scope, arguments);

    };

};
