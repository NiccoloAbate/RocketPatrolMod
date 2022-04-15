
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let Game = new Phaser.Game(config);

// reserve keyboard vars
let keyLEFT, keyRIGHT, keyUP;
let keyA, keyD, keyW;
let keyR;
