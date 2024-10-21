import { GameObjects, Display, Math as pMath } from 'phaser';

const {Sprite} = GameObjects;

class Gargoyle extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'gargoyle');

		this.scene = scene;
		this.target = scene.bubbie;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);

		this.body.setAllowGravity(true);
		this.body.setBounce(0.35);
		this.body.setSize(14, 20);
		this.body.setOffset(13, 13);

		const {ground} = this.scene;

		this.scene.physics.add.collider(this, ground, () => {
			if (this.isActive && !this.hitMap) {
				this.hitMap = true;

				this.scene.time.delayedCall(this.restTimeMs, () => {
					if (!this.body) return;

					this.isAtk = false;
					this.hitMap = false;
					this.body.setAllowGravity(false);
				});
			}
		});

		// Damage overlap systems
		const {bubbie} = this.scene;

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

		this.isActive = false;
		this.activateThreshold = 105;
		this.fallThreshold = 8;
		this.clearThreshold = 10;
		this.clearance = 110;
		this.isAtk = false;
		this.hitMap = false;
		this.speed = 50;
		this.restTimeMs = 1800;
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
		this.maxHp = 3;
		this.hp = this.maxHp;
		this.invincible = false;

		this.blood = this.scene.add.particles(0, 0, 'pixel', this.bloogConfig);
		this.blood.stop();
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

				this.scene.tweens.addCounter({
		            from: 0,
		            to: 255,
		            duration: 1000,
		            onUpdate: (tween) => {
		                const value = Math.floor(tween.getValue());
		                this.setTint(Display.Color.GetColor(value, 0, 0));
		            }
		        });

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
				this.destroy();
			}
		}
	}

	update() {
		if (!this.body) return;
		
		const {x: tx, y: ty} = this.target;
		const {x, y, fallThreshold: ft, speed: s, isAtk, clearance, hitMap, isActive, activateThreshold, clearThreshold} = this;

		if (!isActive) {
			const d2t = pMath.Distance.Between(x, y, tx, ty);

			if (d2t <= activateThreshold) {
				this.isActive = true;
			}
		}
		else {
			if (!isAtk) {
				const aboveBubbie = (x >= tx - ft && x <= tx + ft && y < ty - (clearance * 0.75));

				if (aboveBubbie) {
					this.isAtk = true;
					this.body.setAllowGravity(true);

					this.body.setVelocity(0, 0);
				}
				else {
					const xVel = ((x < tx ? 1 : -1) * s * 0.6);
					let yVel = ((y < ty - clearance ? 1 : -1) * s);

					// Stabilize vertical movement when within clearThreshold
					if (y - clearThreshold <= ty - clearance && y + clearThreshold >= ty - clearance) {
						yVel = 0;
					}

					this.body.setVelocity(xVel, yVel);
				}
			}
		}

		if (!isActive) {
			this.play({
				key: 'Gargoyle-Slam',
				repeat: -1
			}, true);
		}
		else if (isAtk) {
			const {y: vy} = this.body.velocity;

			if (!hitMap) {
				this.play({
					key: 'Gargoyle-Dive',
					repeat: -1
				}, true);
			}
			else {
				this.play({
					key: 'Gargoyle-Slam',
					repeat: -1
				}, true);
			}
		}
		else {
			this.play({
				key: 'Gargoyle-Fly',
				repeat: -1
			}, true);

			if (x >= tx) {
				this.setFlipX(true);
				this.body.setOffset(8, 13);
			}
			else {
				this.setFlipX(false);
				this.body.setOffset(13, 13);
			}
		}
	}
}

export default Gargoyle;