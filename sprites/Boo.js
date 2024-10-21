import {GameObjects} from 'phaser';

const {Sprite} = GameObjects;

class Boo extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'boo');

		this.scene = scene;
		this.target = scene.bubbie;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);

		this.setOrigin(0.1, 1);

		const {ground} = this.scene;

		this.scene.physics.add.collider(this, ground);
	}

	update() {
		const {x: tx} = this.scene.bubbie;

		this.setFlipX(this.x >= tx);
	}
}

export default Boo;