Nball = 13;
class snake {
    constructor(name, game, score, x, y) {
        this.name = name;
        this.game = game;
        this.score = score;
        this.x = x;
        this.y = y;
        this.lastGrowthScore = score;
        this.init();
    }

    init() {
        this.time = Math.floor(20 + Math.random() * 100);
        this.speed = GAME_CONFIG.NORMAL_SPEED; // Same speed for all trains
        this.size = this.game.getSize() * 1;
        this.width = this.size;
        this.angle = 0;
        this.dx = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        this.dy = Math.random() * MaxSpeed - Math.random() * MaxSpeed;

        this.v = [];
        for (let i = 0; i < 50; i++)
            this.v[i] = { x: this.x, y: this.y };
        this.sn_im = new Image();
        this.sn_im.src = "images/body/train.png";
        this.bd_im = new Image();
        this.bd_im.src = "images/body/train.png";
    }

    update() {
        this.time--;
        this.angle = this.getAngle(this.dx, this.dy);
        
        if (this.name != "HaiZuka") {
            // All AI trains use the same speed as player
            this.speed = GAME_CONFIG.NORMAL_SPEED; // Same base speed
            
            if (this.time <= 0) {
                this.time = Math.floor(20 + Math.random() * 40);
                let oldDx = this.dx;
                let oldDy = this.dy;
                
                // Much more gradual AI turning
                let targetDx = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
                let targetDy = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
                
                // Blend with current direction for train-like movement
                this.dx = (oldDx * 0.9) + (targetDx * 0.1);
                this.dy = (oldDy * 0.9) + (targetDy * 0.1);

                // Apply same turning restrictions as player
                let maxTurnSpeed = GAME_CONFIG.MAX_TURN_SPEED * 0.8;
                while (Math.abs(this.dy) * Math.abs(this.dy) + Math.abs(this.dx) * Math.abs(this.dx) > maxTurnSpeed * maxTurnSpeed && this.dx * this.dy != 0) {
                    this.dx /= 1.02;
                    this.dy /= 1.02;
                }
            }
            this.score += this.score / 1000;
        }

        this.v[0].x += this.dx * this.speed;
        this.v[0].y += this.dy * this.speed;

        // Smoother body following for train cars
        for (let i = 1; i < this.v.length; i++) {
            if (this.range(this.v[i], this.v[i - 1]) > this.size / 8) {
                let factor = 0.25;
                this.v[i].x = this.v[i].x * (1 - factor) + this.v[i - 1].x * factor;
                this.v[i].y = this.v[i].y * (1 - factor) + this.v[i - 1].y * factor;
            }
        }

        if (this.score < 200) return;
        
        // Energy cost for speed boost (only applies to player when boosting)
        if (this.name == "HaiZuka" && this.speed > GAME_CONFIG.NORMAL_SPEED)
            this.score -= this.score / 3000;

        this.updateSize();
        this.updateLength();
    }

    updateSize() {
        let scoreForSize = Math.max(0, this.score - 200);
        let sizeMultiplier = Math.pow(scoreForSize / GAME_CONFIG.GROWTH_BASE, GAME_CONFIG.GROWTH_EXPONENT);
        this.size = this.game.getSize() / 2 * (1 + sizeMultiplier);
        this.width = this.size;
    }

    updateLength() {
        let scoreForLength = Math.max(0, this.score - 200);
        let lengthMultiplier = Math.pow(scoreForLength / GAME_CONFIG.GROWTH_BASE, GAME_CONFIG.GROWTH_EXPONENT * 1.2);
        let targetLength = Math.floor(10 + 40 * lengthMultiplier);
        
        if (targetLength > this.v.length) {
            if (this.score - this.lastGrowthScore >= GAME_CONFIG.MIN_GROWTH_SCORE) {
                this.v[this.v.length] = { 
                    x: this.v[this.v.length - 1].x, 
                    y: this.v[this.v.length - 1].y 
                };
                this.lastGrowthScore = this.score;
            }
        } else if (targetLength < this.v.length) {
            this.v = this.v.slice(0, targetLength);
        }
    }

    draw() {
        this.update();

        // Draw train cars
        for (let i = this.v.length - 1; i >= 1; i--) {
            if (this.game.isPoint(this.v[i].x, this.v[i].y)) {
                this.game.context.drawImage(
                    this.bd_im, 
                    this.v[i].x - XX - this.width / 2, 
                    this.v[i].y - YY - this.width / 2, 
                    this.width, 
                    this.width
                );
            }
        }

        // Draw train head
        this.game.context.save();
        this.game.context.translate(this.v[0].x - XX, this.v[0].y - YY);
        this.game.context.rotate(this.angle - Math.PI / 2);
        this.game.context.drawImage(
            this.sn_im, 
            -this.width / 2, 
            -this.width / 2, 
            this.width, 
            this.width
        );
        this.game.context.restore();
    }

    getAngle(a, b) {
        let c = Math.sqrt(a * a + b * b);
        if (c === 0) return 0;
        let al = Math.acos(a / c);
        if (b < 0)
            al += 2 * (Math.PI - al);
        return al;
    }

    range(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
}