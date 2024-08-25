const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let playerScore = 0;
let enemyScore = -1;

let speed = 5;
let restartingGame = true;

class Paddle{
    constructor({pos, vel}){
        this.pos = pos;
        this.vel = vel;
        this.width = 10;
        this.height = 100;
        this.finKey;
    }

    DrawPaddle(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    Update(){
        this.DrawPaddle();

        this.pos.y += this.vel;
    }
}

class Ball{
    constructor({pos, vel}){
        this.pos = pos;
        this.vel = vel;
    }

    DrawBall(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    Update(){
        this.DrawBall();

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y
    }
}

//player
const playerPaddle = new Paddle({
    pos: {x: 50, y: canvas.height/2 - 50},
    vel: 0
});

//enemy
const enemyPaddle = new Paddle({
    pos: {x: 964, y: canvas.height/2 - 50},
    vel: 0
});

//ball
const ball = new Ball({
    pos: {x: 0, y: 0},
    vel: {x: 0, y: 0}
});

const keys = {
    w: {
        keyPressed: false
    },
    s: {
        keyPressed: false
    },
    arrowUp: {
        keyPressed: false
    },
    arrowDown: {
        keyPressed: false
    }
}

function BounceDirection(){
    if(ball.vel.x > 0 && ball.vel.y > 0 && ball.pos.y >= canvas.height){
        ball.vel.y = -speed; 
    }
    else if(ball.vel.x < 0 && ball.vel.y > 0 && ball.pos.y >= canvas.height){
        ball.vel.y = -speed;
    }
    else if(ball.vel.x < 0 && ball.vel.y < 0 && ball.pos.y <= 0){
        ball.vel.y = speed;
    }
    else if(ball.vel.x > 0 && ball.vel.y < 0 && ball.pos.y <= 0){
        ball.vel.y = speed;
    }
    else if(ball.vel.x < 0 && ball.pos.x <= playerPaddle.pos.x + playerPaddle.width && ball.pos.x >= playerPaddle.pos.x && ball.pos.y <= playerPaddle.pos.y + playerPaddle.height && ball.pos.y > playerPaddle.pos.y){
        ball.vel.x = speed;
    }
    else if(ball.vel.x > 0 && ball.pos.x >= enemyPaddle.pos.x && ball.pos.x <= enemyPaddle.pos.x + enemyPaddle.width && ball.pos.y <= enemyPaddle.pos.y + enemyPaddle.height && ball.pos.y > enemyPaddle.pos.y){
        ball.vel.x = -speed;
    }
}

function Score(){
    if(ball.pos.x >= canvas.width){
        playerScore++;
        restartingGame = true;
    }
    else if(ball.pos.x <= 0){
        enemyScore++;
        restartingGame = true;
    }
}

function GameLoop(){
    //loop
    window.requestAnimationFrame(GameLoop);

    //canvas ui
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (ctx.setLineDash !== undefined) {
        ctx.setLineDash([10, 10]);
    }
    
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "white";
    ctx.moveTo(canvas.width/2 - 2.5, 0);
    ctx.lineTo(canvas.width/2 - 2.5, canvas.height);
    ctx.stroke();

    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(playerScore.toString(), canvas.width/4 - 20, 120);
    ctx.fillText(enemyScore.toString(), canvas.width*3/4 - 20, 120);

    playerPaddle.Update();
    enemyPaddle.Update();
    ball.Update();

    //movement    
    playerPaddle.vel = 0;
    enemyPaddle.vel = 0;

    //player
    if(keys.w.keyPressed && playerPaddle.finKey === "w" && playerPaddle.pos.y > 0){
        playerPaddle.vel = -5;
    }
    else if(keys.s.keyPressed && playerPaddle.finKey === "s" && playerPaddle.pos.y + playerPaddle.height < canvas.height){
        playerPaddle.vel = 5;
    }

    //enemy
    if(keys.arrowUp.keyPressed && enemyPaddle.finKey === "up"  && enemyPaddle.pos.y > 0){
        enemyPaddle.vel = -5;
    }
    else if(keys.arrowDown.keyPressed && enemyPaddle.finKey === "down" && enemyPaddle.pos.y + enemyPaddle.height < canvas.height ){
        enemyPaddle.vel = 5;
    }

    //ball
    BounceDirection();

    //scoring
    Score();

    //restarting
    if(restartingGame){
        playerPaddle.pos.y = canvas.height/2 - 50;
        enemyPaddle.pos.y = canvas.height/2 - 50;
        ball.pos.x = Math.random() * (979 - 450) + 450;
        let randY = Math.random();
        if(randY = 0){
            ball.pos.y = 0;
            ball.vel.y = speed;
        }
        else{
            ball.pos.y = canvas.height;
            ball.vel.y = -speed;
        }
        let randVel = Math.random();
        if(randVel = 0){
            ball.vel.x = speed;
        }
        else{
            ball.vel.x = -speed;
        }
        restartingGame = false;
    }
    
}

GameLoop();

//input
window.addEventListener("keydown", (event) => {
    switch(event.key){
        //player
        case "w":
            keys.w.keyPressed = true;
            playerPaddle.finKey = "w";
            break
        case "s":
            keys.s.keyPressed = true;
            playerPaddle.finKey = "s";
            break
        //enemy
        case "ArrowUp":
            keys.arrowUp.keyPressed = true;
            enemyPaddle.finKey = "up";
            break
        case "ArrowDown":
            keys.arrowDown.keyPressed = true;
            enemyPaddle.finKey = "down";
            break               
    }
});

window.addEventListener("keyup", (event) => {
    switch(event.key){
        //player
        case "w":
            keys.w.keyPressed = false;
            break
        case "s":
            keys.s.keyPressed = false;
            break
        //enemy
        case "ArrowUp":
            keys.arrowUp.keyPressed = false;
            break
        case "ArrowDown":
            keys.arrowDown.keyPressed = false;
            break               
    }
});

