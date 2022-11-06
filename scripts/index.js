// github game off

// 2d vectors
class Vec2 {
    x1;
    y1;
    x2;
    y2;
    ctx;
    name;

    constructor(x1,y1,x2,y2,ctx, name="Vec2") {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.ctx = ctx;
        this.name = name;
    }
    draw() {
        ctx.save();
        ctx.lineWidth=5;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.restore();
    }
    distance() {
        let x = this.x2-this.x1;
        let y = this.y2-this.y1;
        //console.log("Distance", `${x,y}`)
        return [x,y]
    }
    displacement() {
        let x = Math.abs(this.x2-this.x1);
        let y = Math.abs(this.y2-this.y1);
        //console.log("Displacement", `${x,y}`)
        return [x,y]
    }
    mag() {
        let [x,y] = this.displacement();
        let mag = Math.sqrt(x*x + y*y)
        //console.log("Magnitude", mag)
        return mag
    }
    normalize() {
        // normalize vector
        // deltaX/magnitude, deltaY/magnitude
        let [x,y] = this.distance();
        let mag = this.mag();
        if (mag > 0) {
            let normal = [x/mag, y/mag];
            //console.log("Normalized", normal[0], normal[1])
            return normal;
        }
        return 0;
    }
    drawNormalize(steps=75) {
        // steps = how big do you want the unit vector to be when drawn
        // drawing the unit vector with it's actual size makes it too small to be seen

        let [x,y] = this.normalize();
        ctx.save();
        ctx.strokeStyle = "green";
        ctx.lineWidth=8;
        
        // draw unit vector
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x1+(x*steps), this.y1+(y*steps));
        ctx.stroke();

        // draw unit circle around player
        ctx.beginPath();
        ctx.arc(this.x1, this.y1, steps, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    drawStats(fontpx=15) {
        let fontSize = fontpx;

        // properties
        let [x,y] = this.displacement();
        let mag = this.mag();
        let normal = this.normalize();

        ctx.save();
        // draw vector
        this.draw();
        this.drawNormalize();
        ctx.font = `${fontSize}px Arial`;
        // print properties
        ctx.fillText(`(${this.x2}, ${this.y2})`, this.x2-30, this.y2-10)
        ctx.fillText(`Vec2: ${this.name} Properties`, x/2, y/2);
        ctx.fillText(`Magnitude: ${mag}`, x/2, (y/2)+(fontSize));
        ctx.fillText(`Normalized: ${normal}`, x/2, (y/2)+(fontSize*2));
        ctx.restore();
    }
}

// PLAYER
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
        //console.log(`Sprite: player_${this.state}_${this.frame}`);
    }
    setVec2(x,y, visible=false, name="PlayerVec2") {
        // create a vector between centre of player's sprite
        // and (x,y)
        let p_vector = new Vec2(
            player.x+player.sprite.width/2,
            player.y+(player.sprite.width*0.75),
            x,
            y,
            ctx,
            name
        );
        if (visible) {
            p_vector.draw();
        }
        return p_vector;
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

        // toggle debug mode
        if (e.key === "0") debug = !debug;
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
let debug;
let canvas;
let ctx;
let player;
let input;
let a;

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
    let a = player.setVec2(100, 100);
    if (debug) {
        a.drawStats();
    }
    
    window.requestAnimationFrame(process);
}

window.onload = (e) => {
    init();
};