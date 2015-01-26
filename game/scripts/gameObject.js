(function() {
    function GameObject(params) {
            this.sprite = params.sprite,
            this.width = params.width,
            this.height = params.height,
            this.posX = params.posX,
            this.posY = params.posY,
            this.frameCount = params.frameCount,
            this.frameIndx = 0,
            this.rotation = params.rotation,
            this.speedX = params.speedX,
            this.speedY = params.speedY,
            this.dx = params.posX,
            this.dy = params.posY,
            this.speed = params.speed,
            this.context = params.context,
            this.thick = 0,
            this.isLive = true,
            this.offsetX = params.offsetX,
            this.offsetY = params.offsetY
    }

    GameObject.prototype = {
        update: function() {
            if (this.thick !== 0) {
                this.thick--;
                this.move();
                if (this.frameIndx < this.frameCount) {
                    this.frameIndx += this.thick % 2;
                } else {
                    this.frameIndx = 0;
                }

            } else {
                player.frameIndx = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.isLive = false;
            }
        },
        move: function() {
            if (this.speed !== 0) {
                this.posX += this.speedX;
                this.posY += this.speedY;
            }
        },
        render: function() {

            this.context.translate(this.posX, this.posY);
            this.context.rotate(this.rotation);
            this.context.translate(-this.posX, -this.posY);

            this.context.drawImage(
                this.sprite, (0 + this.frameIndx * this.width),
                0,
                this.width,
                this.height,
                this.posX - this.offsetX,
                this.posY - this.offsetY,
                this.width,
                this.height
            );
        }
    }

    window.GameObject = GameObject;
})();
