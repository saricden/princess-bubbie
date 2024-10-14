import Phaser, { Scene } from 'phaser';
import SlimJim from '../sprites/SlimJim';

class MainScene extends Scene {
    constructor() {
        super('scene-test');
    }

    create() {
        // Create the tilemap
        const map = this.add.tilemap('map-test');
        const tileset = map.addTilesetImage('tiles');
        const ground = map.createLayer('ground', tileset, 0, 0);

        // Create the Aseprite sprite and play an animation
        this.bubbie = this.physics.add.sprite(0, 0, 'bubbie');
        this.bubbie.setOrigin(0.5, 1);
        this.bubbie.body.setSize(17, 28);
        this.bubbie.body.setOffset(8, 6);

        const atkBox = this.add.rectangle(0, 0, 17, 28);
        atkBox.setOrigin(0.5, 1);

        this.physics.world.enable(atkBox);

        atkBox.body.setAllowGravity(false);

        this.bubbie.on('animationupdate', ({key}, {index}) => {
            if (key === 'Bub-Sword-Ground' && [4, 5].includes(index)) {
                const {flipX, x, y} = this.bubbie;
                const xo = ((flipX ? -1 : 1) * 15);

                atkBox.setPosition(x + xo, y);
            }
            else {
                atkBox.setPosition(0, 0);
            }
        });

        ground.setCollisionByProperty({ collides: true });

        map.getObjectLayer('spawn').objects.forEach((obj) => {
            if (obj.name === 'bubbie') {
                this.bubbie.setPosition(obj.x, obj.y);
            }
            else if (obj.name === 'slim-jim') {
                const slimJim = new SlimJim(this, obj.x, obj.y);

                slimJim.blocker = this.physics.add.collider(slimJim, this.bubbie);

                this.physics.add.overlap(slimJim, atkBox, () => {
                    atkBox.setPosition(0, 0);
                    slimJim.damage(this.bubbie.x);
                });
            }
        });

        this.physics.add.collider(this.bubbie, ground);

        // Play the default animation (or specify one, e.g., 'idle')
        this.bubbie.play({ key: 'Bub-Down', repeat: -1 }, true);

        this.cameras.main.setZoom(20);
        this.cameras.main.zoomTo(3, 1000);
        this.cameras.main.startFollow(this.bubbie);
        this.cameras.main.setBackgroundColor(0x0055AA);

        // Keyboard controls
        this.cursors = this.input.keyboard.addKeys({
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

          if ((this.vRi || this.vLe) && navigator.vibrate) {
            navigator.vibrate(50);
          }
        }

        document.addEventListener('touchstart', handlePointer);
        document.addEventListener('touchmove', handlePointer);
        document.addEventListener('touchend', handlePointer);

        const bA = document.querySelector('.a');
        const bB = document.querySelector('.b');

        bA.addEventListener('touchstart', () => this.bubActionA());
        bB.addEventListener('touchstart', () => this.bubActionB());

        this.attacking = false;
        this.jumpAttacking = false;
        this.input.keyboard.on('keydown-FORWARD_SLASH', () => {
            this.bubActionB();
        });

        this.bubbie.on('animationcomplete-Bub-Sword-Ground', () => {
            this.attacking = false;
        });
    }

    bubActionA() {
        const {y: vy} = this.bubbie.body.velocity;

        if (vy === 0) {
            this.bubbie.body.setVelocityY(-400);
        }
    }

    bubActionB() {
        if (!this.attacking && !this.jumpAttacking) {
            const {y: vy} = this.bubbie.body.velocity;

            this.bubbie.body.setVelocityX(0);

            if (vy === 0) {
                this.bubbie.play({ key: 'Bub-Sword-Ground', repeat: 0 }, true);
                this.attacking = true;
            }
            else {
                this.bubbie.play({ key: 'Bub-Sword-Air', repeat: -1 }, true);
                this.bubbie.body.setVelocityY(200);
                this.jumpAttacking = true;

            }
        }
    }

    update() {
        const {up, down, left, right, jump} = this.cursors;
        const {x: vx, y: vy} = this.bubbie.body.velocity;

        if (!this.attacking && !this.jumpAttacking) {
            if (left.isDown || this.vLe) {
                this.bubbie.body.setVelocityX(-200);
            }
            else if (right.isDown || this.vRi) {
                this.bubbie.body.setVelocityX(200);
            }
            else {
                this.bubbie.body.setVelocityX(0);
            }    
        

            if (jump.isDown && vy === 0) {
                this.bubActionA();
            }

            if (vx < 0) {
                this.bubbie.setFlipX(true);
            }
            else if (vx > 0) {
                this.bubbie.setFlipX(false);
            }


            if (vy === 0) {
                if (vx === 0) {
                    this.bubbie.play({ key: 'Bub-Idle', repeat: -1 }, true);
                }
                else {
                    this.bubbie.play({ key: 'Bub-Run', repeat: -1 }, true);
                }
            }
            else if (vy < 0) {
                this.bubbie.play({ key: 'Bub-Up', repeat: -1 }, true);
            }
            else if (vy > 0) {
                this.bubbie.play({ key: 'Bub-Down', repeat: -1 }, true);
            }
        }
        else if (this.jumpAttacking && vy === 0) {
            this.jumpAttacking = false;
        }
    }
}

export default MainScene;
