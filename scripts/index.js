// github game off

// classes
class Player {
    x;
    y;
    ctx;
    spd;
    dir;
    sprite;
    state;
    frame;
    maxFrame;

    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.sprite = document.getElementById("player_idle_0");
        this.frame = 0;
        this.dir = 0;
    }
    draw(ctx=this.ctx) {
        // left
        if (this.dir) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite,(this.x-canvas.width+(this.sprite.width))*-1,this.y);
            ctx.restore();
        // right
        } else {
            ctx.drawImage(this.sprite,this.x,this.y);
        }
    }
    animate(ms) {
        window.setInterval(() => {
            player.nextFrame();
        },ms);
    }
    setState(state, maxFrame) {
        this.state = state;
        this.frame = 0;

        switch (state) {
            case 'idle':
                this.maxFrame = 4;
                break;
            case 'walk':
                this.maxFrame = 4;
                break;
        }
        this.sprite = document.getElementById(`player_${state}_0`);
    }
    nextFrame() {
        if (this.maxFrame !== 0) this.frame++;
        if (this.frame >= this.maxFrame) this.frame = 0;
        this.sprite = document.getElementById(`player_${this.state}_${this.frame}`);
        // console.log(`player_${this.state}_${this.frame}`);
    }
}

// check for multiple keystrokes
let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

function playerInput() {
    window.addEventListener("keydown", (e) => {
        if (e.key === "w") keys.w = true;
        if (e.key === "a") keys.a = true;
        if (e.key === "s") keys.s = true;
        if (e.key === "d") keys.d = true;
        if (player.state !== "walk") {
            player.setState("walk");
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "w") keys.w = false;
        if (e.key === "a") keys.a = false;
        if (e.key === "s") keys.s = false;
        if (e.key === "d") keys.d = false;
        if (player.state !== "idle") {
            player.setState("idle");
        }
    });
}

function playerMove() {
    if (keys.w === true) player.y -= player.spd;
    if (keys.a === true) {
        player.x -= player.spd;
        player.dir = 1;
    }
    if (keys.s === true) player.y += player.spd;
    if (keys.d === true) {
        player.x += player.spd;
        player.dir = 0;
    }

    // prevent player from leaving canvas
    if (player.x <= 0) player.x = 0;
    if (player.y <= 0) player.y = 0;
    if (player.x >= canvas.width-100) player.x = canvas.width-100;
    if (player.y >= canvas.height-100) player.y = canvas.height-100;
}


// gameplay logic

// vars
let canvas;
let ctx;
let player;
let input;

function init() {
    canvas = document.getElementById("game");
    canvas.setAttribute('style', `width: 100%; height: 100%;`);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx = canvas.getContext("2d");

    player = new Player(100,100,ctx);
    player.setState("idle")
    player.draw();
    player.animate(200);
    player.spd = 10;
    playerInput();

    window.requestAnimationFrame(process);
}

function process() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    playerMove();
    player.draw();
    
    window.requestAnimationFrame(process);
}

window.onload = (e) => {
    init();
};