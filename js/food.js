ArrColor = ["#FF0000", "#FFFF00", "#00FF00", "#FF00FF", "#FFFFFF", "#00FFFF", "#7FFF00", "#FFCC00"];
class food {
    constructor(game, size, x, y) {
        this.game = game;
        this.size = size;
        this.value = this.size;
        this.x = x;
        this.y = y;
        this.baseX = x; // Store original position
        this.baseY = y;
        this.wiggleTime = Math.random() * 100; // Random start time for wiggle
        this.init();
    }

    init() {
        this.color = ArrColor[Math.floor(Math.random() * 99999) % ArrColor.length];
    }

    draw() {
        // Add subtle wiggle movement like slither.io
        this.wiggleTime += 0.05;
        let wiggleAmount = 2; // Small wiggle distance
        this.x = this.baseX + Math.sin(this.wiggleTime) * wiggleAmount;
        this.y = this.baseY + Math.cos(this.wiggleTime * 1.1) * wiggleAmount;

        if (this.game.isPoint(this.x, this.y)) {
            this.game.context.beginPath();
            this.game.context.arc(this.x - this.size / 4 - XX, this.y - this.size / 4 - YY, this.size / 2, 0, Math.PI * 2, false);
            this.game.context.fillStyle = this.color;
            this.game.context.fill();
            this.game.context.closePath()
        }
    }
}