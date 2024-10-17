import Phaser, { Scene } from 'phaser';
import Bubbie from '../sprites/Bubbie';
import Gargoyle from '../sprites/Gargoyle';

class MainScene extends Scene {
    constructor() {
        super('scene-test');
    }

    create() {
        // Create the tilemap
        const map = this.add.tilemap('map-test');
        const tileset = map.addTilesetImage('tiles');
        this.ground = map.createLayer('ground', tileset, 0, 0);

        // Init Bubbie
        this.bubbie = new Bubbie(this, 0, 0);

        this.ground.setCollisionByProperty({ collides: true });

        this.enemies = [];

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
            else if (obj.name === 'gargoyle') {
                const gargoyle = new Gargoyle(this, obj.x, obj.y);

                this.enemies.push(gargoyle);
            }
        });

        // Setup main camera
        this.cameras.main.setZoom(20);
        this.cameras.main.zoomTo(3, 1000);
        this.cameras.main.startFollow(this.bubbie);
        this.cameras.main.setBackgroundColor(0x0055AA);

        // Launch HUD
        this.scene.launch('scene-hud', { parentScene: this });
        this.hud = this.scene.get('scene-hud');
    }

    update() {
        this.bubbie.update();

        this.enemies.forEach((enemy) => {
            if (typeof enemy.update === 'function') enemy.update();
        });
    }
}

export default MainScene;
