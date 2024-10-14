import { GameObjects, Display } from 'phaser';

const {Sprite} = GameObjects;

class SlimJim extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'slim-jim');

		this.scene = scene;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.body.setImmovable(true);
		this.body.setAllowGravity(false);
		this.setOrigin(0.5, 0.95);

		this.hp = 10;
		this.blocker = null;

		this.bloodConfig = {
			follow: this,
			tint: 0xFF0000,
			speedX: { min: -100, max: 100 },
			speedY: { min: -100, max: 100 },
			gravityY: 200,
			quantity: 10,
			scale: { min: 1, max: 4 }
		};
		this.blood = this.scene.add.particles(0, 0, 'pixel', this.bloogConfig);
		this.blood.stop();
	}

	damage() {
		if (this.hp - 1 > 0) {
			const splatDir = (this.scene.bubbie.x < this.x ? 1 : -1);
			this.blood.setConfig({
				...this.bloodConfig,
				speedX: { min: splatDir * 100, max: splatDir * 300 }
			})
			this.blood.explode(100);
			this.scene.cameras.main.flash(200, 255, 0, 0);

			this.scene.tweens.addCounter({
	            from: 0,
	            to: 255,
	            duration: 1000,
	            onUpdate: (tween) => {
	                const value = Math.floor(tween.getValue());
	                this.setTint(Display.Color.GetColor(value, 0, 0));
	            }
	        });

	        this.hp--;
		}
		else {
			this.setTint(0xFFAAAA);
			this.blood.setConfig({
				...this.bloodConfig,
				speedX: { min: -200, max: 200 },
				speedY: { min: -200, max: 200 },
			})
			this.blood.explode(400);
			this.scene.cameras.main.flash(400, 255, 0, 0);

			this.scene.tweens.add({
	            targets: [this],
	            alpha: 0,
	            duration: 2000,
	            onComplete: () => {
	            	this.destroy();
	            }
	        });
			this.scene.physics.world.removeCollider(this.blocker);
		}
	}

	preUpdate() {
		this.setY(this.scene.bubbie.y);
	}
}

export default SlimJim;