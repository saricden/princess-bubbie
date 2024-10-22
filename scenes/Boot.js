import { Scene } from 'phaser';

export default class Boot extends Scene {
	constructor() {
		super('scene-boot');
	}

	preload() {
	    const width = this.cameras.main.width;
	    const height = this.cameras.main.height;
	    const progressBar = this.add.graphics();
	    const progressBox = this.add.graphics();
	    
	    progressBox.fillStyle(0x222222, 0.8); // dark grey
	    progressBox.fillRect(width / 4, height / 2 - 25, width / 2, 50);

	    // Display percentage text
	    const percentText = this.make.text({
			x: width / 2,
			y: height / 2,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
	    });
	    percentText.setOrigin(0.5, 0.5);

	    // Load the Tiled tilemap and tileset image
	    this.load.tilemapTiledJSON('map-test', '/maps/test.json');
	    this.load.image('tiles', '/maps/tiles.png');

	    // Sprites
	    this.load.aseprite('bubbie', '/sprites/bubbie.png', '/sprites/bubbie.json');
	    this.load.aseprite('gargoyle', '/sprites/gargoyle.png', '/sprites/gargoyle.json');
	    this.load.image('sus', '/sprites/sus.png');
	    this.load.image('boo', '/sprites/boo.png');
	    this.load.aseprite('ghost', '/sprites/ghost.png', '/sprites/ghost.json');
	    this.load.aseprite('ghoul', '/sprites/ghoul.png', '/sprites/ghoul.json');
	    this.load.image('heart', '/sprites/heart-pickup.png');
	    this.load.aseprite('jump-skeleton', '/sprites/jump-skeleton.png', '/sprites/jump-skeleton.json');

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
	    this.load.audio('sfx-sword1', '/sfx/sword.4.mp3');
	    this.load.audio('sfx-sword2', '/sfx/sword.5.mp3');
	    this.load.audio('sfx-sword3', '/sfx/sword.7.mp3');
	    this.load.audio('sfx-heart', '/sfx/upshort.mp3');

	    // Music
	    this.load.audio('music-castle', '/music/That 90s Kid - The Whispering Shadows Dungeon.mp3');

	    // Vocals
	    this.load.audio('vo-bubbie-jump1', '/vocals/bubbie-jump1.mp3');
	    this.load.audio('vo-bubbie-jump2', '/vocals/bubbie-jump2.mp3');

	    // FX
	    this.load.image('pixel', '/fx/pixel.png');

	    // Update progress bar based on loading progress
	    this.load.on('progress', (value) => {
			percentText.setText(parseInt(value * 100) + '%');

			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1); // white
			progressBar.fillRect(width / 4 + 10, height / 2 - 15, (width / 2 - 20) * value, 30);
	    });

	    // Clean up when load is complete
	    this.load.on('complete', () => {
			progressBar.destroy();
			progressBox.destroy();
			percentText.destroy();
	    });
	  }

	create() {
		const {width: w, height: h} = this.game.scale;

		this.anims.createFromAseprite('bubbie');
		this.anims.createFromAseprite('gargoyle');
		this.anims.createFromAseprite('ghost');
		this.anims.createFromAseprite('ghoul');
		this.anims.createFromAseprite('jump-skeleton');

		this.add.text(w / 2, h / 2, 'Click to Play', {
	        font: '42px monospace',
	        fill: '#ffffff'
		}).setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start('scene-test');
		});
	}
}