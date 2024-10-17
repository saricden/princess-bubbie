import {GameObjects} from 'phaser';

const {Sprite} = GameObjects;

class Bubbie extends Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'bubbie');

		this.scene = scene;

		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setOrigin(0.5, 1);
        this.body.setSize(17, 28);
        this.body.setOffset(8, 6);

        this.scene.physics.add.collider(this, this.scene.ground);

        this.atkBox = this.scene.add.rectangle(0, 0, 17, 28);
        this.atkBox.setOrigin(0.5, 1);
        this.scene.physics.world.enable(this.atkBox);
        this.atkBox.body.setAllowGravity(false);

        this.on('animationupdate', ({key}, {index}) => {
            if (key === 'Bub-Sword-Ground' && [4, 5].includes(index)) {
                const {flipX, x, y} = this;
                const xo = ((flipX ? -1 : 1) * 15);

                this.atkBox.setPosition(x + xo, y);
            }
            else {
                this.atkBox.setPosition(0, 0);
            }
        });

        this.play({ key: 'Bub-Down', repeat: -1 }, true);

        this.attacking = false;
        this.jumpAttacking = false;

        this.on('animationcomplete-Bub-Sword-Ground', () => {
            this.attacking = false;
        });

        // Keyboard controls
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.PERIOD
        });

        // Virtual controls
        const dUp = document.querySelector('.up');
        this.vUp = false;
        const dRi = document.querySelector('.ri');
        this.vRi = false;
        const dDo = document.querySelector('.do');
        this.vDo = false;
        const dLe = document.querySelector('.le');
        this.vLe = false;

        const handlePointer = (e) => {
          let pageX = -100;
          let pageY = -100;
          if (e.targetTouches[0]) {
            pageX = e.targetTouches[0].pageX;
            pageY = e.targetTouches[0].pageY;
          }
          const targetEle = document.elementFromPoint(pageX, pageY);

          this.vRi = (targetEle === dRi);
          this.vLe = (targetEle === dLe);
        }

        document.addEventListener('touchstart', handlePointer);
        document.addEventListener('touchmove', handlePointer);
        document.addEventListener('touchend', handlePointer);

        const bA = document.querySelector('.a');
        const bB = document.querySelector('.b');

        bA.addEventListener('touchstart', () => this.actionA());
        bB.addEventListener('touchstart', () => this.actionB());

        this.scene.input.keyboard.on('keydown-FORWARD_SLASH', () => {
            this.actionB();
        });
	}

	actionA() {
        const {y: vy} = this.body.velocity;

        if (vy === 0) {
            this.body.setVelocityY(-400);
        }
    }

    actionB() {
        if (!this.attacking && !this.jumpAttacking) {
            const {y: vy} = this.body.velocity;

            this.body.setVelocityX(0);

            if (vy === 0) {
                this.play({ key: 'Bub-Sword-Ground', repeat: 0 }, true);
                this.attacking = true;
            }
            else {
                this.play({ key: 'Bub-Sword-Air', repeat: -1 }, true);
                this.body.setVelocityY(200);
                this.jumpAttacking = true;

            }
        }
    }

    update() {
    	const {up, down, left, right, jump} = this.cursors;
        const {x: vx, y: vy} = this.body.velocity;

    	if (!this.attacking && !this.jumpAttacking) {
            if (left.isDown || this.vLe) {
                this.body.setVelocityX(-200);
            }
            else if (right.isDown || this.vRi) {
                this.body.setVelocityX(200);
            }
            else {
                this.body.setVelocityX(0);
            }    
        
            if (jump.isDown && vy === 0) {
                this.actionA();
            }

            if (vx < 0) {
                this.setFlipX(true);
            }
            else if (vx > 0) {
                this.setFlipX(false);
            }


            if (vy === 0) {
                if (vx === 0) {
                    this.play({ key: 'Bub-Idle', repeat: -1 }, true);
                }
                else {
                    this.play({ key: 'Bub-Run', repeat: -1 }, true);
                }
            }
            else if (vy < 0) {
                this.play({ key: 'Bub-Up', repeat: -1 }, true);
            }
            else if (vy > 0) {
                this.play({ key: 'Bub-Down', repeat: -1 }, true);
            }
        }
        else if (this.jumpAttacking && vy === 0) {
            this.jumpAttacking = false;
        }
    }
}

export default Bubbie;