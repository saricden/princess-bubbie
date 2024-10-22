import {GameObjects, Math as pMath} from 'phaser';
import Heart from './Heart';

const {Sprite} = GameObjects;

class JumpSkeleton extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'jump-skeleton');

		this.scene = scene;
		this.target = scene.bubbie;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.body.setSize(15, 32);
		this.body.setOffset(12, 3);
		this.setOrigin(0.5, 1);

		this.play({ key: 'JumpSkeleton-Down', repeat: -1 });

		const {bubbie, ground} = this.scene;

		this.scene.physics.add.collider(this, ground);

		// Damage overlap systems
		this.scene.physics.add.overlap(this, bubbie, () => {
			bubbie.takeDamage(1, this);
		});

		this.scene.physics.add.overlap(this, bubbie.atkBox, () => {
			this.takeDamage(1, bubbie);

			if (bubbie.jumpAttacking) {
				const {flipX} = bubbie;
				const xVel = ((flipX ? 1 : -1) * 150);
				const yVel = -350;	

				bubbie.body.setVelocity(xVel, yVel);
			}
		});

		this.restTimeMs = 2000;
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
		this.maxHp = 2;
		this.hp = this.maxHp;
		this.invincible = false;
		this.jumpHeight = 300;
		this.jumpForce = 200;
		this.jumpThreshold = 115;

		this.blood = this.scene.add.particles(0, 0, 'pixel', this.bloogConfig);
		this.blood.stop();

		this.scene.time.addEvent({
			delay: this.restTimeMs,
			repeat: -1,
			callback: () => {
				if (!this.body) return;

				const {x: tx, y: ty} = this.target;
				const {x, y} = this;
				const d2t = pMath.Distance.Between(x, y, tx, ty);

				if (d2t <= this.jumpThreshold) {
					const dir = (x >= tx ? -1 : 1);

					this.body.setVelocity(this.jumpForce * dir, -this.jumpHeight);
				}
			}
		});
	}

	takeDamage(dmg, damager) {
		if (!this.invincible) {
			if (this.hp - dmg > 0) {
				const splatDir = (damager.x < this.x ? 1 : -1);
				const ri = pMath.Between(1, 5);

				this.scene.sound.play(`sfx-hit${ri}`, { volume: 0.35 });
				this.blood.setConfig({
					...this.bloodConfig,
					speedX: { min: splatDir * 100, max: splatDir * 300 }
				});
				this.blood.explode(100);

		        this.hp -= dmg;
		        this.invincible = true;

		        this.scene.time.delayedCall(500, () => this.invincible = false);
			}
			else {
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
		}
	}

	update() {
		if (!this.body) return;

		const {x, y} = this;
		const {x: tx, y: ty} = this.target;
		const {y: vy} = this.body.velocity;
		const {down: grounded} = this.body.blocked;
		const xDiff = Math.abs(x - tx);
		const doFlip = (x >= tx);

		if (doFlip) {
			this.setFlipX(true);
			this.body.setOffset(6, 3);
		}
		else {
			this.setFlipX(false);
			this.body.setOffset(12, 3);
		}

		if (y < ty && xDiff <= 10) {
			this.body.setVelocityX(0);
		}

		if (grounded) {
			this.play({ key: 'JumpSkeleton-Idle', repeat: -1 }, true);
		}
		else {
			if (vy <= 0) {
				this.play({ key: 'JumpSkeleton-Up', repeat: -1 }, true);
			}
			else {
				this.play({ key: 'JumpSkeleton-Down', repeat: -1 }, true);
			}
		}
	}
}

export default JumpSkeleton;