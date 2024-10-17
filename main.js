import './style.css';
import Phaser from 'phaser';

// Scenes
import Boot from './scenes/Boot';
import Test from './scenes/Test';

// Heads up display
import HUD from './scenes/HUD';

const config = {
    type: Phaser.WEBGL,
    width: 720,
    height: 720,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [
        Boot,
        Test,
        
        HUD
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    pixelArt: true
};

const game = new Phaser.Game(config);

document.addEventListener('contextmenu', e => e.preventDefault());

window.addEventListener('touchstart', () => document.documentElement.classList.add('virtual'));

window.addEventListener('keydown', () => document.documentElement.classList.remove('virtual'));

export default game;
