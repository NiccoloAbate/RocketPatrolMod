class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('starfield', 'assets/starfield.jpg');
    }

    create() {
        let width = config.width;
        let height = config.height;

        this.bg = this.add.tileSprite(0, 0, width, height, 'starfield').setOrigin(0, 0);
        
        let borderColor = 0xffffff;
        this.add.rectangle(0, 0, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, height - borderUISize, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, height, borderColor).setOrigin(0, 0);
        this.add.rectangle(width - borderUISize, 0, borderUISize, height, borderColor).setOrigin(0, 0);
    }

    update() {
            this.bg.tilePositionX -= 4;
    }
}