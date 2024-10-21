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

        // Auto paralax layers
        const map2 = this.add.tilemap('map-test');
        const tileset2 = map2.addTilesetImage('tiles');
        const layer1 = map2.createLayer('ground', tileset2, 0, 0);

        layer1.setScale(0.85);
        layer1.setTint(0x0000AA);
        layer1.setScrollFactor(0.8);
        layer1.setDepth(-1);

        const map3 = this.add.tilemap('map-test');
        const tileset3 = map3.addTilesetImage('tiles');
        const layer2 = map3.createLayer('ground', tileset3, 0, 0);

        layer2.setScale(0.75);
        layer2.setTint(0x000088);
        layer2.setScrollFactor(0.7);
        layer2.setDepth(-2);


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
        this.cameras.main.setBackgroundColor(0x000044);

        // Launch HUD
        this.scene.launch('scene-hud', { parentScene: this });
        this.hud = this.scene.get('scene-hud');
    }

    update() {
        this.bubbie.update();

        this.enemies.forEach((enemy) => {
            if (enemy && typeof enemy.update === 'function') enemy.update();
        });
    }
}

export default MainScene;
