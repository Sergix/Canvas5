/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine release1.2 Original Full Script
* (c) 2016 Sergix
*/

console.info("Canvas5 JavaScript Engine; version release1.2; (c) 2016 Sergix");

function Scene(domElement) {
    this.domElement      = domElement;
    this.canvas          = this.domElement.getElementById("CanvasGame");
    this.context         = this.canvas.getContext("2d");
    this.width           = this.canvas.width;
    this.height          = this.canvas.height;
    this.sprites         = [];
    this.actionList      = [];
    this.changeColorList = [0, 0, 0, 0];
    this.colorList       = [null, null, null, null];
    this.imageData       = null;
    this.playerSprite    = null;
    this.background      = null;
    this.backgroundColor = "white";
    this.showInfo        = false;
    this.modifyColors = function (rgba, area) {
        if (rgba.r === undefined) {
            console.error("Color set must be of type RGBASet! {modifyColors(), " + rgba + "}");
            return 0;
        }

        this.changeColorList[0] = rgba.r;
        this.changeColorList[1] = rgba.g;
        this.changeColorList[2] = rgba.b;
        this.changeColorList[3] = rgba.a;
        
        this.imageData = this.context.getImageData(area[0], area[1], area[2], area[3]);
        if (this.imageData.width > 200 && this.imageData.height > 200)
            console.warn("Pixel manipulation on large parts of the canvas can cause major framerate issues! {modifyColors(), null}");
        
        var index, r, g, b, a, i, j;
        
        for (i = 0; i < area[3]; i++) {
            for (j = 0; j < area[2]; j++) {
                index = (j + (i * this.imageData.width)) * 4;
                r = this.imageData.data[index];
                g = this.imageData.data[index + 1];
                b = this.imageData.data[index + 2];
                a = this.imageData.data[index + 3];

                r += this.changeColorList[0];
                g += this.changeColorList[1];
                b += this.changeColorList[2];
                a += this.changeColorList[3];

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

                this.colorList[0] = r;
                this.colorList[1] = g;
                this.colorList[2] = b;
                this.colorList[3] = a;

                this.imageData.data[index] = r;
                this.imageData.data[index + 1] = g;
                this.imageData.data[index + 2] = b;
                this.imageData.data[index + 3] = a;
            }
        }

        this.context.putImageData(this.imageData, area[0], area[1]);
    };
    this.getColors = function () {
        return this.colorList;
    };
    this.newAction = function (condition, action) {
        this.actionList.push({condition: condition, action: action});
    };
    this.add = function (sprite) {
        this.sprites.push(sprite);
    };
    this.remove = function (sprite) {
        var index = this.sprites.indexOf(sprite);
        if (index > -1)
            this.sprites.splice(index, 1);
    };
    this.setPlayerSprite = function (sprite) {
        this.playerSprite = sprite;
    };
    
    var i, j;
    
    this.update = function () {
        for (i = 0; i < this.sprites.length; i++) {
            if (this.playerSprite.boundaries !== null) {
                if (this.playerSprite.x < 0) this.playerSprite.x = 0;
                if (this.playerSprite.x + this.playerSprite.width > this.playerSprite.boundaries.width) this.playerSprite.x = this.playerSprite.boundaries.width - this.playerSprite.width;
                if (this.playerSprite.y < 0) this.playerSprite.y = 0;
                if (this.playerSprite.y + this.playerSprite.height > this.playerSprite.boundaries.height) this.playerSprite.y = this.playerSprite.boundaries.height - this.playerSprite.height;
            }
            var e = this.sprites[i];
            if (!e.collide)
               continue;

            if (this.playerSprite.x < e.x + e.width && this.playerSprite.x + this.playerSprite.width > e.x && this.playerSprite.y < e.y + e.height && this.playerSprite.y + this.playerSprite.height > e.y) {

                if (this.playerSprite.vx > 0) {
                    this.playerSprite.moveLeft = false;
                    if (!this.playerSprite.moveDown || !this.playerSprite.moveUp)
                        continue;
                    this.playerSprite.x = e.x - this.playerSprite.width;
                    continue;
                }

                if (this.playerSprite.vx < 0) {
                    this.playerSprite.moveRight = false;
                    this.playerSprite.x = e.x + e.width;
                    continue;
                }

                if (this.playerSprite.vy > 0) {
                    this.playerSprite.moveDown = false;
                    this.playerSprite.y = e.y - this.playerSprite.height;
                    continue;
                }

                if (this.playerSprite.vy < 0) {
                    this.playerSprite.moveUp = false;
                    this.playerSprite.y = e.y + e.height;
                    continue;
                } else {

                }

                this.playerSprite.moveLeft = true;
                this.playerSprite.moveRight = true;
                this.playerSprite.moveDown = true;
                this.playerSprite.moveUp = true;
            }
        }

        for (i = 0; i < this.sprites.length; i++) {
            if (!this.sprites[i].collide)
                continue;

            if (this.sprites[i].boundaries !== null) {
                if (this.sprites[i].x < 0) this.sprites[i].x = 0;
                if (this.sprites[i].x + this.sprites[i].width > this.sprites[i].boundaries.width) this.sprites[i].x = this.sprites[i].boundaries.width - this.sprites[i].width;
                if (this.sprites[i].y < 0) this.sprites[i].y = 0;
                if (this.sprites[i].y + this.sprites[i].height > this.sprites[i].boundaries.height) this.sprites[i].y = this.sprites[i].boundaries.height - this.sprites[i].height;
            }

            for (j = 0; j < this.sprites.length; j++) {

                if (!e.collide)
                    break;

                if (i === j)
                    continue;

                
                e = this.sprites[i];

                if (this.sprites[i].x < e.x + e.width && this.sprites[i].x + this.sprites[i].width > e.x && this.sprites[i].y < e.y + e.height && this.sprites[i].y + this.sprites[i].height > e.y) {

                    if (this.sprites[i].vx > 0) {
                        this.sprites[i].moveLeft = false;
                        this.sprites[i].x = e.x - this.sprites[i].width;
                    } else {
                        this.sprites[i].moveLeft = true;
                    }

                    if (this.sprites[i].vx < 0) {
                        this.sprites[i].moveRight = false;
                        this.sprites[i].x = e.x + e.width;
                    } else {
                        this.sprites[i].moveRight = true;
                    }

                    if (this.sprites[i].vy > 0) {
                        this.sprites[i].moveDown = false;
                        this.sprites[i].y = e.y - this.sprites[i].height;
                    } else {
                        this.sprites[i].moveDown = true;
                    }

                    if (this.sprites[i].vy < 0) {
                        this.sprites[i].moveUp = false;
                        this.sprites[i].y = e.y + e.height;
                    } else {
                        this.sprites[i].moveUp = true;
                    }
                }
            }
        }
    };
    this.render = function (fps) {
        this.update();
        if (this.background !== null) {
            this.context.drawImage(this.background.image, 0, 0, this.width, this.height);
        } else {
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.width, this.height);
        }

        for (i = 0; i < this.sprites.length; i++)
            this.sprites[i].update(this.context, fps);

        this.playerSprite.update(this.context, fps);

        if (this.showInfo) {
            this.context.font = "13pt sans-serif";
            this.context.color = "black";
            this.context.fillText(fps + " FPS; " + (this.sprites.length + 1) + " objects", 10, 20);
        }

        for (i = 0; i < this.actionList.length; i++)
            if(this.actionList[i].condition()) this.actionList[i].action();
    };
}

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
    this.image = image !== undefined ? image : null;
    this.width = this.image === null ? 0 : this.image.image.width;
    this.height = this.image === null ? 0 : this.image.image.height;
    this.boundaries = null;
    this.collide = true;
    this.name = null;
    this.spriteSheet = null;
    this.frame = 0;
    this.changeFrame = true;
    this.activeKeys = [];
    this.moveLeft = true;
    this.moveRight = true;
    this.moveDown = true;
    this.moveUp = true;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.clicked = false;
    this.activeButtons = [];
    this.isKeyPressed = function (key) {
        if (this.activeKeys.indexOf(key) > -1)
            return 1;
        else
            return 0;
    };
    this.isButtonPressed = function (button) {
        if (this.activeButtons.indexOf(button) > -1)
            return 1;
        else
            return 0;
    };
    this.near = function (sprite, units) {
        if (distance(this.x, this.y, sprite.x, sprite.y) <= units)
            return 1;
        else
            return 0;
    };
    this.setName = function (text) {
        this.name = text;
    };
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.setVelocity = function (vx, vy) {
        this.vx = vx;
        this.vy = vy;
    };
    this.setAccel = function (ax, ay) {
        this.ax = ax;
        this.ay = ay;
    };
    this.addBasicControls = function (movementSpeed, domElement) {
        this.speed = movementSpeed;
        domElement.addEventListener('keydown', bind(this, this.onKeyDown), false);
        domElement.addEventListener('keyup', bind(this, this.onKeyUp), false);
    };
    this.addMouseListener = function (domElement) {
        domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);
        domElement.addEventListener('mousedown', bind(this, this.onMouseDown), false);
    };
    this.onMouseMove = function (evt) {
        this.mousePositionX = evt.pageX;
        this.mousePositionY = evt.pageY;
    };
    this.onMouseDown = function (evt) {
        switch (evt.button) {
            case 0: /*left*/ if (this.mousePositionX >= this.x && this.mousePositionX <= this.x + this.width && this.mousePositionY >= this.y && this.mousePositionY <= this.y + this.width) this.clicked = true; break;
        }
        this.activeButtons.push(evt.button);
    };
    this.onMouseUp = function (evt) {
        var index = this.activeButtons.indexOf(evt.button);
        if (index > -1)
            this.activeButtons.splice(index, 1);
        this.clicked = false;
    };
    this.onKeyDown = function (evt) {
        switch (evt.keyCode) {
            case 38: /*up*/   this.vy = -this.speed; break;
            case 87: /*W*/    this.vy = -this.speed; break;
            case 37: /*left*/ this.vx = -this.speed; break;
            case 65: /*A*/    this.vx = -this.speed; break;
            case 40: /*down*/ this.vy = this.speed; break;
            case 83: /*S*/    this.vy = this.speed; break;
            case 39: /*right*/this.vx = this.speed; break;
            case 68: /*D*/    this.vx = this.speed; break;
        }
        this.activeKeys.push(evt.keyCode);
    };

    this.onKeyUp = function (evt) {
        switch (evt.keyCode) {
            case 38: /*up*/   this.vy = 0; break;
            case 87: /*W*/    this.vy = 0; break;
            case 37: /*left*/ this.vx = 0; break;
            case 65: /*A*/    this.vx = 0; break;
            case 40: /*down*/ this.vy = 0; break;
            case 83: /*S*/    this.vy = 0; break;
            case 39: /*right*/this.vx = 0; break;
            case 68: /*D*/    this.vx = 0; break;
        }
        var index = this.activeKeys.indexOf(evt.keyCode);
        if (index > -1)
            this.activeKeys.splice(index, 1);
    };
    this.update = function (context, fps) {
        if (this.spriteSheet === null)
            this.spriteSheet = new SpriteSheet([this.image]);

        if (this.width === 0 && this.height === 0) {
            this.width = this.spriteSheet.images[0].image.width;
            this.height = this.spriteSheet.images[0].image.height;
        }

        if (!this.moveLeft && this.vx > 0)
            this.vx = 0;
        else
            this.moveLeft = true;

        if (!this.moveRight && this.vx < 0)
            this.vx = 0;
        else
            this.moveRight = true;

        if (!this.moveDown && this.vy > 0)
            this.vy = 0;
        else
            this.moveDown = true;

        if (!this.moveUp && this.vy < 0)
            this.vy = 0;
        else
            this.moveUp = true;

        this.x  += this.vx / fps;
        this.y  += this.vy / fps;
        this.vx += this.ax / fps;
        this.vy += this.vy / fps;

        if (this.changeFrame)
            this.frame += 1;

        if (this.frame === this.spriteSheet.images.length)
            this.frame = 0;

        this.draw(context);
    };
    this.draw = function (context) {
        context.drawImage(this.spriteSheet.images[this.frame].image, this.x, this.y);

        if (this.name === null)
            return 1;

        this.name.x = this.x;
        this.name.y = this.y - 25;
        this.name.draw(context);
    };
}

function Rectangle(width, height) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.width = width;
    this.height = height;
    this.color = "white";
    this.border = this.color;
    this.borderWidth = 2;
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.update = function (context, fps) {
        this.x += this.vx / fps;
        this.y += this.vy / fps;
        this.draw(context);
    };
    this.draw = function (context) {
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
    };
}

function Circle(size) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = size;
    this.color = "white";
    this.border = this.color;
    this.borderWidth = 2;
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.update = function (context, fps) {
        this.x += this.vx / fps;
        this.y += this.vy / fps;
        this.draw(context);
    };
    this.draw = function (context) {
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        context.lineWidth = this.borderWidth;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
        context.stroke();
    };
}

function Client(url) {
    this.url = url;
    server = new WebSocket(url);
    currentData = null;
    this.event = function (event) {
        currentData = event;
    };
    this.sendMessage = function (data) {
        server.send(data);
    };
    this.getMessage = function () {
        return currentData.data;
    };
    this.setup = function () {
        console.warn("Canvas5 WebSocket implementation is currently very limited and buggy!");

        server.onopen = this.event;
        server.onclose = this.event;
        server.onmessage = this.event;
        server.onerror = this.event;
    };
    this.setup();
}

function LocalStorageSet() {
    this.keyList = [];
    this.newItem = function (key, value) {
        localStorage.setItem(key, value);
        this.keyList.push(key);
    };
    this.getItem = function (key) {
        return localStorage.getItem(key);
    };
    this.getAllItems = function () {
        var temp = [], i;
        for (i = 0; i < this.keyList.length; i++)
            temp.push(localStorage.getItem(this.keyList[i]));
        return temp;
    };
    this.clear = function () {
        var index, i;
        for (i = 0; i < this.keyList.length; i++) {
            localStorage.removeItem(this.keyList[i]);
            index = this.keyList.indexOf(this.keyList[i]);
            this.keyList.splice(index, 1);
        }   
    };
}

function AudioElement(domElement, src) {
    this.domElement = domElement.createElement('audio');
    this.src = src;
    this.play = function () {
        this.domElement.play();
    };
    this.pause = function () {
        this.domElement.pause();
    };
    this.stop = function () {
        this.pause();
        this.setTime(0);
    };
    this.setTime = function (time) {
        this.domElement.currentTime = time;
    };
    this.setVolume = function (volume) {
        this.domElement.volume = volume;
    };
    this.setup = function () {
        this.domElement.setAttribute('src', this.src);
    };
    this.setup();
}

function MessageBox(text, x, y) {
    this.x      = x !== undefined ? x : 0;
    this.y      = y !== undefined ? y : 0;
    this.text   = text;
    this.font   = "12pt sans-serif";
    this.color  = "black";
    this.alwaysActive = false;
    this.update = function (context, fps) {  
        if (this.alwaysActive !== false)
            this.draw(context);
    };
    this.active = function (scene) {
        this.draw(scene.context);
    };
    this.draw = function (context) {
        context.fillStyle = this.color;
        context.font = this.font;
        context.fillText(this.text, this.x, this.y);
    };
}

function GameImage(src) {
    this.image = new Image();
    this.src   = src;
    function create(obj) { obj.image.src = obj.src; }
    create(this);
}

function SpriteSheet(sprites) {
    this.images = sprites;
}

function RGBSet(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255;
    this.getAsString = function () {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
}

function RGBASet(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.getAsString = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";
    }
}

function HSLSet(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = 255;
    this.getAsString = function () {
        return "hsl(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";
    }
}

function HSLASet(h, s, l, a) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
    this.getAsString = function () {
        return "hsla(" + this.r + "," + this.g + "," + this.b + "," + (this.a > 1 ? 1 : this.a) + ")";
    }
}

function distance(x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0;
    return Math.sqrt((dx * dx) + (dy * dy));
};

/*
* Bind() function
* (c) paulirish, mrdoob, alteredq
*/
function bind(scope, fn) {
    return function () { fn.apply(scope, arguments); };
};

/*function ParticleField(entity) {
    this.particle = entity;
    this.entityList = [];
    this.explosion = function (n, context) {
        var directionX = -100, directionY = -100, temp = null;
        while (n > 0) {
            temp = this.particle;
            temp.vx = directionX;
            temp.vy = directionY;
            this.entityList.push(temp);
            directionY += 1;
            directionX += 1;
            n--;
        }
        var i;
        for (i = 0; i < this.entityList.length; i++)
            this.entityList[i].update(context, 60);
    };
    this.update = function (context, fps) {
        var i;
        for (i = 0; i < this.entityList.length; i++)
            this.entityList[i].update(context, fps);
    };
    this.draw = function (context) {
        
    };
}*/
