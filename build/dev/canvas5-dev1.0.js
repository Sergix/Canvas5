/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine dev1.0 Original Full Script
* (c) 2016 Sergix
*/

function Scene(domElement) {
    this.domElement      = domElement;
    this.canvas          = this.domElement.getElementById("CanvasGame");
    this.context         = this.canvas.getContext("2d");
    this.width           = this.canvas.width;
    this.height          = this.canvas.height;
    this.sprites         = [];
    this.playerSprite    = null;
    this.background      = null;
    this.backgroundColor = "white";
    this.add = function (sprite) {
        this.sprites.push(sprite);
    };
    this.remove = function (sprite) {
        var index = this.sprites.indexOf(sprite);
        if (index > -1)
            this.sprites.splice(index, 1);
    };
    this.update = function () {
        for (i = 0; i < this.sprites.length; i++) {
            if (this.playerSprite.boundaries !== null) {
                if (this.playerSprite.x <= 0) this.playerSprite.x = 0;
                if (this.playerSprite.x + this.playerSprite.width >= this.playerSprite.boundaries.width) this.playerSprite = this.playerSprite.boundaries.width;
                if (this.playerSprite.y <= 0) this.playerSprite.y = 0;
                if (this.playerSprite.y + this.playerSprite.height >= this.playerSprite.boundaries.height) this.playerSprite = this.playerSprite.boundaries.height;
            }
            var e = this.sprites[i];
            if (!e.collide) break;
            if (((e.x + e.width) >= this.playerSprite.x) && (e.x <= (this.playerSprite.x + this.playerSprite.width)) && ((e.y + e.height) >= this.playerSprite.y) && (e.y <= (this.playerSprite.y + this.playerSprite.height))) {
                if (!this.playerSprite.canMove) {
                    this.playerSprite.canMove = true;
                    this.playerSprite.oldX = this.playerSprite.x;
                    this.playerSprite.oldY = this.playerSprite.y;
                }
                this.playerSprite.x = this.playerSprite.oldX;
                this.playerSprite.y = this.playerSprite.oldY;
            } else {
                this.playerSprite.canMove = false;
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

        if (this.alwaysActive !== undefined)
            if (this.alwaysActive)
                this.update(this.context, fps);

        this.playerSprite.update(this.context, fps);
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
    this.image = image;
    this.width = this.image.image.width;
    this.height = this.image.image.height;
    this.boundaries = null;
    this.collide = true;
    this.name = null;
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
    };
    this.update = function (context, fps) {
        this.x  += this.vx / fps;
        this.y  += this.vy / fps;
        this.vx += this.ax / fps;
        this.vy += this.vy / fps;
        this.draw(context);
    };
    this.draw = function (context) {
        context.drawImage(this.image.image, this.x, this.y);
        if (this.name === null) return 1;
        this.name.x = this.x;
        this.name.y = this.y - 25;
        this.name.draw(context);
    };
}

function MessageBox(text, x=0, y=0) {
    this.x      = x;
    this.y      = y;
    this.text   = text;
    this.font   = "12pt sans-serif";
    this.color  = "black";
    this.alwaysActive = false;
    this.update = function (context, fps) {
        this.draw(context);
    };
    this.active = function (context) {
        this.draw(context);
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

/*
* Bind() function
* (c) paulirish, mrdoob, alteredq
*/
function bind(scope, fn) {
    return function () { fn.apply(scope, arguments); };
};