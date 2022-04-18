/*
### Points Breakdown - More Info in README

### Simultaneous 2 player mode - 30
### Mode Selection and differences between single player and 2 player * - 5
### Add time to the clock on hits (Single Player Only) - 20
### Paralax Scrolling - 10
### SFX Randomness / Variation - 10
### Code Refactoring using JS techniques * - 5
### Play Scene Music - 5
### Music Interactivity * - 25
### TOTAL - 110

'*' = Custom / proposed additions
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let Game = new Phaser.Game(config);

let Audio = new AudioManager;
let playStemNames = ['Drums', 'Rhythm', 'Synth 1', 'Synth 2'];
let playStemFileNames = ['assets/music/Play Music - Drums.wav', 'assets/music/Play Music - Rhythm.wav',
    'assets/music/Play Music - Synth 1.wav', 'assets/music/Play Music - Synth 2.wav'];

// reserve keyboard vars
let keyLEFT, keyRIGHT, keyUP, keyDOWN;
let keyA, keyD, keyW, keyS;
let keyR;
