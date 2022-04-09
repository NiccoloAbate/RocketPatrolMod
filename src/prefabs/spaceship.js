// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        this.points = pointValue;
        this.speed = Game.settings.spaceshipSpeed;

        // add object to existing scene
        scene.add.existing(this);
    }

    reset() {
        this.x = config.width;
    }

    update() {
        this.x -= this.speed;

        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }
}