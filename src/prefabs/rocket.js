// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

        this.reset();

        // add object to existing scene
        scene.add.existing(this);
    }

    reset() {
        this.y = config.height - borderUISize - borderPadding;
        this.firing = false;
    }

    update() {

        if (this.firing) {
            this.y -= 2;

            if (this.y <= borderUISize * 3 + borderPadding) {
                this.reset();
            }
            return;
        }
        
        const moveSpeed = 2;
        if (keyLEFT.isDown) {
            this.x -= moveSpeed;
        }
        if (keyRIGHT.isDown) {
            this.x += moveSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.firing) {
            this.firing = true;
            this.sfxRocket.play();  // play sfx
        }
    }
}
