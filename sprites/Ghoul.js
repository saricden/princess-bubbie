import {GameObjects, Display, Math as pMath} from 'phaser';

const {Sprite} = GameObjects;

class Ghoul extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'ghoul');

		this.scene = scene;
		this.target = scene.bubbie;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.body.setSize(15, 32);
		this.setOrigin(0.5, 1);

		const {ground} = this.scene;

		this.lowerLeftTile = null;
		this.lowerRightTile = null;
		this.speed = 16;
		this.dir = 1;
		this.isAttacking = false;
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

		this.blood = this.scene.add.particles(0, 0, 'pixel', this.bloogConfig);
		this.blood.stop();

		this.scene.physics.add.collider(this, ground, (g, tile) => {
			this.lowerLeftTile = ground.getTileAt(tile.x - 1, tile.y + 1);
			this.lowerRightTile = ground.getTileAt(tile.x + 1, tile.y + 1);
		});

		this.atkBox = this.scene.add.rectangle(0, 0, 15, 32);
        this.atkBox.setOrigin(0.5, 1);
        this.atkBox.alive = false;
        this.scene.physics.world.enable(this.atkBox);
        this.atkBox.body.setAllowGravity(false);

        const {bubbie} = this.scene;

        // Swing attack - double damage
        this.scene.physics.add.overlap(this.atkBox, bubbie, () => {
        	if (!this.isAttacking) {
        		this.isAttacking = true;
        		this.play({ key: 'Ghoul-Slash', repeat: 0 });
        	}

        	if (this.atkBox.alive) {
				this.atkBox.setPosition(-1000, -1000);
				this.atkBox.alive = false;

				bubbie.takeDamage(2, this);        		
        	}
        });

        // Regular overlap damage
        this.scene.physics.add.overlap(this, bubbie, () => {
			bubbie.takeDamage(1, this);
		});

		// Bubbie to Ghoul damage
		this.scene.physics.add.overlap(this, bubbie.atkBox, () => {
			this.takeDamage(1, bubbie);

			if (bubbie.jumpAttacking) {
				const {flipX} = bubbie;
				const xVel = ((flipX ? 1 : -1) * 150);
				const yVel = -350;	

				bubbie.body.setVelocity(xVel, yVel);
			}
		});

        this.on('animationupdate', ({key}, {index}) => {
        	if (key === 'Ghoul-Slash' && [5, 6].includes(index)) {
        		this.atkBox.alive = true;
        	}
        	else {
        		this.atkBox.alive = false;
        	}
        });

        this.on('animationcomplete-Ghoul-Slash', () => this.isAttacking = false);
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
				this.destroy();
				this.atkBox.destroy();
			}
		}
	}

	update() {
		if (!this.body) return;

		const {speed, lowerLeftTile, lowerRightTile, isAttacking} = this;
		const {x: tx} = this.target;

		if (isAttacking) {
			this.body.setVelocityX(0);
		}
		else {
			// Change direction if blocked left/right, or at the edge
			const doTurn = (this.body.blocked.right || lowerRightTile?.index !== 1 || this.body.blocked.left || lowerLeftTile?.index !== 1);

			if (doTurn) {
				this.dir = -this.dir;
			}

			this.body.setVelocityX(this.dir * speed);
			this.setFlipX(this.dir < 0);

			this.play({ key: 'Ghoul-Walk', repeat: -1 }, true);
		}

		this.atkBox.setPosition(this.x + (this.dir * 10), this.y);
	}
}

export default Ghoul;