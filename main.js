var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.layer = 1;
    this.control = false;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

//no inheritance
function Foreground(game, spritesheet) {
    this.x = 0;
    this.y = 30;
    this.spritesheet = spritesheet;
    this.game = game;
    this.layer = 3;
    this.control = false;
    this.ctx = game.ctx;
};

Foreground.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Foreground.prototype.update = function () {
};

function Turtle(game, spritesheet) {
    this.animation = new Animation(spritesheet, 4100/8, 353, 8, 0.17, 8, true, 0.5);
    this.x = 0;
    this.y = 135;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
    this.speed = 0;
    this.jumping = false;
    this.jumpStartTime = 0;
    this.jumpSpeed = 0;
    this.gravity = 1500;
    this.game = game;
    this.layer = 4;
    this.facingLeft = false;
    this.control = true;
    this.ctx = game.ctx;
}

Turtle.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Turtle.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime)
        this.x += this.game.clockTick * this.speed;
    
    if (this.jumping) {
    	var time = this.game.timer.gameTime - this.jumpStartTime;
    	this.y = 135 - this.jumpSpeed * time + 0.5 * this.gravity * time * time;
    	if(this.y >= 135) {
    		this.jumping = false;
    		this.y = 135;
    	}
	}
    
    if(this.w && !this.jumping) {
    	this.jumping = true;
    	this.y -= 1;
    	this.jumpStartTime = this.game.timer.gameTime;
    	this.jumpSpeed = 500;
    }
    else if(this.s && Math.abs(this.speed) < 16000) {
    	this.speed = this.speed * 2;
    	this.s = false;
    }
    else if(this.a && this.speed >= 0) {
    	this.speed = -250;
    }	
    else if(this.d && this.speed <= 0) {
    	this.speed = 250;
    }	
    
    if (this.x > 750 && this.layer === 4)  {
    	this.x = -300;
    	this.facingLeft = true;
    	this.layer = 2;
    }
    else if (this.x > 750 && this.layer === 2) {
    	this.x = -300;
    	this.facingLeft = false;
    	this.layer = 4;
    }
    else if (this.x < -300 && this.layer === 4){
    	this.x = 750;
    	this.facingLeft = true;
    	this.layer = 2;
    }
    else if (this.x < -300 && this.layer === 2){
    	this.x = 750;
    	this.facingLeft = false;
    	this.layer = 4;
    }

    
    if(!(this.w || this.s || this.a || this.d)) {
    	this.speed = 0;
    }
    Entity.prototype.update.call(this);
}


// inheritance 
function Rabbit(game, spritesheet) {
    this.animation = new Animation(spritesheet, 3618/6, 300, 6, 0.03, 6, true, 1);
    this.speed = 650;
    this.ctx = game.ctx;
    this.facingLeft = false;
    this.layer = 4;
    this.scale;
    this.control = false;
    Entity.call(this, game, 0, 28);
}

Rabbit.prototype = new Entity();
Rabbit.prototype.constructor = Rabbit;

Rabbit.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;   
    if (this.x > 700 && this.layer === 4)  {
    	this.x = -450;
    	this.facingLeft = true;
    	this.layer = 2;
    }
    else if (this.x > 700 && this.layer === 2) {
    	this.x = -450;
    	this.facingLeft = false;
    	this.layer = 4;
    }
    Entity.prototype.update.call(this);
}

Rabbit.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/rabbit.png");
AM.queueDownload("./img/turtle_sheet.png");
AM.queueDownload("./img/forrest.png");
AM.queueDownload("./img/bushes.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/forrest.png")));
    gameEngine.addEntity(new Turtle(gameEngine, AM.getAsset("./img/turtle_sheet.png")));
    gameEngine.addEntity(new Rabbit(gameEngine, AM.getAsset("./img/rabbit.png")));
    gameEngine.addEntity(new Foreground(gameEngine, AM.getAsset("./img/bushes.png")));

    ctx.drawImage(img,
            0, 0,  // source from sheet
            189, 230, // width and height of source
            250, 250, // destination coordinates
            95, 115); // destination width and height
    
    console.log("All Done!");
});