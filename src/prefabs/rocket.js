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
        if (this.keyLeft.isDown) {
            this.x -= moveSpeed;
        }
        if (this.keyRight.isDown) {
            this.x += moveSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyFire) && !this.firing) {
            this.firing = true;
            const minDetune = -1000;
            const maxDetune = 1000;
            let detune = getRandomInclusive(minDetune, maxDetune);
            let pan = (((this.x / Game.config.width) * 2.0) - 1.0);
            this.sfxRocket.setDetune(detune);
            this.sfxRocket.setPan(pan)
            this.sfxRocket.play();  // play sfx
        }
    }

    setControls(left, right, fire) {
        this.keyLeft = left;
        this.keyRight = right;
        this.keyFire = fire;
    }
}
