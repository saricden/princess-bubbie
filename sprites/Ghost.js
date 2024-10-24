import {GameObjects, Math as pMath} from 'phaser';
import Heart from './Heart';

const {Sprite} = GameObjects;

class Ghost extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'ghost');

		this.scene = scene;
		this.target = scene.bubbie;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);

		this.body.setAllowGravity(false);

		const {bubbie} = this.scene;

		this.scene.physics.add.overlap(this, bubbie, () => {
			bubbie.takeDamage(1, this);
			this.detonate();
		});

		this.scene.physics.add.overlap(this, bubbie.atkBox, () => {
			this.detonate();

			if (bubbie.jumpAttacking) {
				const {flipX} = bubbie;
				const xVel = ((flipX ? 1 : -1) * 150);
				const yVel = -350;	

				bubbie.body.setVelocity(xVel, yVel);
			}
		});

		this.play({
			key: 'Ghost-Float',
			repeat: -1
		});

		this.speed = 30;
		this.bloodConfig = {
			follow: this,
			tint: 0x00AA00,
			speedX: { min: -100, max: 100 },
			speedY: { min: -100, max: 100 },
			gravityY: 200,
			quantity: 2,
			scale: { min: 1, max: 4 },
			alpha: { start: 1, end: 0}
		};
		this.blood = this.scene.add.particles(0, 0, 'pixel', this.bloogConfig);
		this.blood.stop();
		this.isActive = false;
		this.activateThreshold = 105;
	}

	detonate() {
		this.scene.sound.play('sfx-kaboom');
		this.scene.cameras.main.flash(600, 0, 255, 0);
		this.blood.setConfig({
			...this.bloodConfig,
			speedX: { min: -200, max: 200 },
			speedY: { min: -200, max: 200 }
		});
		this.blood.explode(200);
		new Heart(this.scene, this.x, this.y - 10);
		this.destroy();
	}

	update() {
		if (!this.body) return;
		
		const {x: tx, y: ty} = this.target;
		const {isActive, activateThreshold, x, y, speed} = this;

		if (!isActive) {
			const d2t = pMath.Distance.Between(x, y, tx, ty);

			if (d2t <= activateThreshold) {
				this.isActive = true;
			}
		}
		else {
			this.body.setVelocity(((x <= tx ? 1 : -1) * speed), ((y <= ty ? 1 : -1) * speed));
			this.setFlipX(x >= tx);
		}
	}
}

export default Ghost;