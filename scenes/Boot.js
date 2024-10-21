import { Scene } from 'phaser';

export default class Boot extends Scene {
	constructor() {
		super('scene-boot');
	}

	preload() {
    // Load the Tiled tilemap and tileset image
    this.load.tilemapTiledJSON('map-test', '/maps/test.json');
    this.load.image('tiles', '/maps/tiles.png');

    // Sprites
    this.load.aseprite('bubbie', '/sprites/bubbie.png', '/sprites/bubbie.json');
    this.load.aseprite('gargoyle', '/sprites/gargoyle.png', '/sprites/gargoyle.json');
    this.load.image('sus', '/sprites/sus.png');
    this.load.image('boo', '/sprites/boo.png');
    this.load.aseprite('ghost', '/sprites/ghost.png', '/sprites/ghost.json');

    // UI
    this.load.aseprite('ui-heart', '/sprites/ui/heart.png', '/sprites/ui/heart.json');

    // Sound fx
    this.load.audio('sfx-step1', '/sfx/metal_steps_02.mp3');
    this.load.audio('sfx-step2', '/sfx/metal_steps_03.mp3');
    this.load.audio('sfx-step3', '/sfx/metal_steps_12.mp3');
    this.load.audio('sfx-step4', '/sfx/metal_steps_15.mp3');
    this.load.audio('sfx-step5', '/sfx/metal_steps_18.mp3');
    this.load.audio('sfx-hit1', '/sfx/hit05.mp3');
    this.load.audio('sfx-hit2', '/sfx/hit17.mp3');
    this.load.audio('sfx-hit3', '/sfx/hit24.mp3');
    this.load.audio('sfx-hit4', '/sfx/hit26.mp3');
    this.load.audio('sfx-hit5', '/sfx/hit35.mp3');
    this.load.audio('sfx-kaboom', '/sfx/kaboom.mp3');

    // FX
    this.load.image('pixel', '/fx/pixel.png');
  }

	create() {
		const {width: w, height: h} = this.game.scale;

		this.anims.createFromAseprite('bubbie');
		this.anims.createFromAseprite('gargoyle');
		this.anims.createFromAseprite('ghost');

		this.add.text(w / 2, h / 2, 'Click or tap to Play').setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start('scene-test');
		});
	}
}