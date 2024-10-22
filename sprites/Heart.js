import {GameObjects} from 'phaser';

const {Sprite} = GameObjects;

class Heart extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'heart');

		this.scene = scene;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);

		const {ground, bubbie} = this.scene;

		this.body.setBounce(0.65);
		this.scene.physics.add.collider(this, ground);
		this.scene.physics.add.overlap(this, bubbie, () => {
			this.scene.sound.play('sfx-heart');

			if (bubbie.hp + 2 <= bubbie.maxHp) {
				this.scene.bubbie.hp += 2;
			}
			else {
				this.scene.bubbie.hp = bubbie.maxHp;
			}

			this.destroy();
		});

		this.body.setVelocityY(-250);
	}
}

export default Heart;