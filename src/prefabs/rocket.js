// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.reset();

        // add object to existing scene
        scene.add.existing(this);
    }

    reset() {
        this.y = 431;
        this.firing = false;
    }

    update() {

        if (this.firing) {
            this.y -= 10;

            if (this.y < 0) {
                this.reset();
            }
            return;
        }
        
        const moveSpeed = 4;
        if (keyLEFT.isDown) {
            this.x -= moveSpeed;
        }
        if (keyRIGHT.isDown) {
            this.x += moveSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.firing = true;
        }
    }
}
