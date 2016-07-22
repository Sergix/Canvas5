/*
* @author sergix / http://sergix.visualstudio.net/
*/

/*
* Game Engine release1.1 Original Full Script
* (c) 2016 Sergix
*/

console.info("Canvas5 JavaScript Engine; version release1.1; (c) 2016 Sergix");

function Scene(domElement) {
    this.domElement      = domElement;
    this.canvas          = this.domElement.getElementById("CanvasGame");
    this.context         = this.canvas.getContext("2d");
    this.width           = this.canvas.width;
    this.height          = this.canvas.height;
    this.sprites         = [];
    this.actionList      = [];
    this.playerSprite    = null;
    this.background      = null;
    this.backgroundColor = "white";
    this.showInfo = false;
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
    this.update = function () {
        for (i = 0; i < this.sprites.length; i++) {
            if (this.playerSprite.boundaries !== null) {
                if (this.playerSprite.x <= 0) this.playerSprite.x = 0;
                if (this.playerSprite.x + this.playerSprite.width >= this.playerSprite.boundaries.width) this.playerSprite.x = this.playerSprite.boundaries.width - this.playerSprite.width;
                if (this.playerSprite.y <= 0) this.playerSprite.y = 0;
                if (this.playerSprite.y + this.playerSprite.height >= this.playerSprite.boundaries.height) this.playerSprite.y = this.playerSprite.boundaries.height - this.playerSprite.height;
            }
            var e = this.sprites[i];
            if (!e.collide)
                break;

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

        for (i = 0; i < this.sprites.length; i++) {
            if (!this.sprites[i].collide)
                continue;

            if (this.sprites[i].boundaries !== null) {
                if (this.sprites[i].x <= 0) this.sprites[i].x = 0;
                if (this.sprites[i].x + this.sprites[i].width >= this.sprites[i].boundaries.width) this.sprites[i].x = this.sprites[i].boundaries.width - this.sprites[i].width;
                if (this.sprites[i].y <= 0) this.sprites[i].y = 0;
                if (this.sprites[i].y + this.sprites[i].height >= this.sprites[i].boundaries.height) this.sprites[i].y = this.sprites[i].boundaries.height - this.sprites[i].height;
            }

            for (j = 0; j < this.sprites.length; j++) {
                if (i === j)
                    continue;

                if (!this.sprites[j].collide)
                    break;

                if (((this.sprites[j].x + this.sprites[j].width) >= this.sprites[i].x) && (this.sprites[j].x <= (this.sprites[i].x + this.sprites[i].width)) && ((this.sprites[j].y + this.sprites[j].height) >= this.sprites[i].y) && (this.sprites[j].y <= (this.sprites[i].y + this.sprites[i].height))) {
                    if (!this.sprites[i].canMove) {
                        this.sprites[i].canMove = true;
                        this.sprites[i].oldX = this.sprites[i].x;
                        this.sprites[i].oldY = this.sprites[i].y;
                    }
                    this.sprites[i].x = this.sprites[i].oldX;
                    this.sprites[i].y = this.sprites[i].oldY;
                } else {
                    this.sprites[i].canMove = false;
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

        for (i = 0; i < this.actionList.length; i++)
            if(this.actionList[i].condition()) this.actionList[i].action();

        this.playerSprite.update(this.context, fps);

        if (this.showInfo) {
            this.context.font = "13pt sans-serif";
            this.context.color = "black";
            this.context.fillText(fps + " FPS; " + (this.sprites.length + 1) + " objects", 10, 20);
        }
    };
}

function Sprite(image=null) {
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
    this.width = this.image === null ? 0 : this.image.image.width;
    this.height = this.image === null ? 0 : this.image.image.height;
    this.boundaries = null;
    this.collide = true;
    this.name = null;
    this.spriteSheet = null;
    this.frame = 0;
    this.changeFrame = true;
    this.activeKeys = [];
    this.isKeyPressed = function (key) {
        if (this.activeKeys.indexOf(key) > -1)
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

function MessageBox(text, x=0, y=0) {
    this.x      = x;
    this.y      = y;
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