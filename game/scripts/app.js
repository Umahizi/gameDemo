var canvas = document.getElementById("gameContainer");
ctx = canvas.getContext("2d");
player = {};
rockets = [];
explosions = [];
pointers = [];
gameState = 0;
angle = 0;
playerSpeed = 5;
rocketSpeed = 8;
fps = 60 / 60;

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

canvas.addEventListener('mousemove', rotatePlayer, false);
canvas.addEventListener('mousedown', handleClick, false);

startScr = document.getElementById("startScreen");
startBtn = document.getElementById("startBtn").addEventListener("click", function() {
    startScr.style.visibility = "hidden";
    playerInit();
    requestAnimFrame(animate);
    gameState = 1;
});

resources.load([
    "assets/sniper.png",
    "assets/rocket.png",
    "assets/explosion.png"

]);

var hideStartScr = function() {
    startScr.style.visibility = "hidden";
}

//render loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderPlayer();
    renderRockets();
    renderExplosions();
    requestAnimFrame(animate);
}

function playerInit() {
    player = new GameObject({
        sprite: resources.get("assets/sniper.png"),
        width: 53,
        height: 63,
        posX: canvas.width / 2,
        posY: canvas.height / 2,
        frameCount: 7,
        rotation: 0,
        speedX: 0,
        speedY: 0,
        speed: playerSpeed,
        context: ctx,
        offsetX: 14,
        offsetY: 4
    });
}

function rotatePlayer(event) {
    event = event || window.event;
    if (gameState === 1) {
        var dot, eventDoc, doc, body, pageX, pageY;
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;
            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        } 

        ctx.save();
        var centerX = player.posX + player.width / 2;
        centerY = player.posY + player.height / 2;
        angle = Math.atan2(event.pageX - player.posX, -(event.pageY - player.posY));
        player.rotation = angle;
    }
}

function handleClick(event) {
    event = event || window.event;
    event.preventDefault();

    if (gameState === 1) {
        var button = event.which || event.button;
        switch (button) {
            case 1:
                shoot(event);
                break;
            case 3:
                point(event);
                move(event, player);
                break;
            default:
                break;
        }
    }
}

function shoot(event) {
    var bullet = new GameObject({
        sprite: resources.get("assets/rocket.png"),
        width: 26,
        height: 49,
        posX: player.posX,
        posY: player.posY,
        frameCount: 3,
        rotation: player.rotation,
        speedX: 0,
        speedY: 0,
        speed: rocketSpeed,
        context: ctx,
        offsetX: 10,
        offsetY: 0
    });

    move(event, bullet);
    rockets.push(bullet);
    var delay = fps * bullet.tick;
    console.log("I shot the sherif")
}

function renderRockets() {
    for (rocket in rockets) {
        if (rockets[rocket] instanceof GameObject) {
            if (rockets[rocket].isLive) {
                ctx.save();
                rockets[rocket].update();
                rockets[rocket].render();
                ctx.restore();
            } else {
                explode(rockets[rocket].posX, rockets[rocket].posY, rockets[rocket].rotation)
                rockets.splice(rocket, 1)
            }
        }
    }
}

function explode(x, y, a) {
    var explosion = new GameObject({
        sprite: resources.get("assets/explosion.png"),
        width: 128,
        height: 128,
        posX: x,
        posY: y,
        frameCount: 40,
        rotation: a,
        speedX: 0,
        speedY: 0,
        speed: 0,
        context: ctx,
        offsetX: 60,
        offsetY: 60
    });
    explosion.thick = 79;
    explosions.push(explosion);
}

function renderExplosions() {
    for (expl in explosions) {
        if (explosions[expl] instanceof GameObject) {
            if (explosions[expl].isLive) {
                ctx.save();
                explosions[expl].update();
                explosions[expl].render();
                ctx.restore();
            } else {
                explosions.splice(expl, 1)
            }
        }
    }
}

function point(event) {
    pointers.push({
        x: event.pageX,
        y: event.pageY,
        r: 0,
        frames: 30,
        fade: 1.0
    });
}

function move(event, entity) {
    entity.dx = event.pageX - entity.posX;
    entity.dy = event.pageY - entity.posY;
    var distance = Math.sqrt(entity.dx * entity.dx + entity.dy * entity.dy);
    var factor = distance / entity.speed;
    entity.thick = Math.round(factor);
    entity.speedX = entity.dx / factor ;
    entity.speedY = entity.dy / factor ;
}

var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, fps);
        };
})();

function renderPlayer() {
    ctx.save();
    player.update();
    player.render();
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 250);
    my_gradient.addColorStop(0, "rgba(255,0,0,0.1)");
    my_gradient.addColorStop(1, "red");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(player.posX, player.posY, 1, -500);
    ctx.restore();
    renderPointers();
}

function renderPointers() {
    for (p in pointers) {
        if (pointers[p].frames !== 0) {
            ctx.beginPath();
            ctx.arc(pointers[p].x, pointers[p].y, pointers[p].r, 0, 2 * Math.PI);
            ctx.strokeStyle = "rgba(255,0,0," + pointers[p].fade + ")";
            ctx.lineWidth = 3;
            ctx.stroke();
            pointers[p].r++;
            pointers[p].fade -= 0.05;
            pointers[p].frames--;
        } else {
            pointers.splice(p, 1)
        }

    }
}
