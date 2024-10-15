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
    this.load.image('slim-jim', '/sprites/slim-jim.png');

    // FX
    this.load.image('pixel', '/fx/pixel.png');
  }

	create() {
		const {width: w, height: h} = this.game.scale;

		this.anims.createFromAseprite('bubbie');
		this.anims.createFromAseprite('gargoyle');

		this.add.text(w / 2, h / 2, 'Click or tap to Play').setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start('scene-test');
		});
	}
}