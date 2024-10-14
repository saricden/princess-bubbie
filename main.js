import './style.css';
import Phaser from 'phaser';

// Scenes
import Boot from './scenes/Boot';
import Test from './scenes/Test';

const config = {
    type: Phaser.WEBGL,  // Use WebGL if available, otherwise fallback to Canvas
    width: window.innerWidth,         // Set initial width to the window's width
    height: window.innerHeight,       // Set initial height to the window's height
    scene: [
      Boot,
      Test
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },  // Example gravity, change as needed
            debug: false
        }
    },
    pixelArt: true
};

// Create the game instance with the configured settings
const game = new Phaser.Game(config);

// Adjust the game size when the window is resized
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

export default game;
