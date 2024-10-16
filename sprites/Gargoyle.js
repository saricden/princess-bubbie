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
					this.isAtk = false;
					this.hitMap = false;
					this.body.setAllowGravity(false);
				});
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
		this.restTimeMs = 1200;
	}

	update() {
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