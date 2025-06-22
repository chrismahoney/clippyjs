// Input handling for the fighting game

// Input Controller
class InputController {
    constructor() {
        this.keys = {};
        this.gamepadState = {};
        this.touchState = {};
        this.lastTouchX = 0;
        
        // Initialize input handlers
        this.setupKeyboardControls();
        this.setupGamepadControls();
        this.setupTouchControls();
    }
    
    // Setup keyboard controls
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    // Setup gamepad controls
    setupGamepadControls() {
        window.addEventListener('gamepadconnected', (e) => {
            console.log(`Gamepad connected: ${e.gamepad.id}`);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log(`Gamepad disconnected: ${e.gamepad.id}`);
        });
    }
    
    // Setup touch controls
    setupTouchControls() {
        // Only add touch controls if we're on a touch device
        if ('ontouchstart' in window) {
            const fightingScreen = document.getElementById('fightingScreen');
            
            // Create touch controls
            const touchControls = document.createElement('div');
            touchControls.className = 'touch-controls';
            touchControls.innerHTML = `
                <div class="d-pad">
                    <div class="d-pad-up" data-key="KeyW"></div>
                    <div class="d-pad-left" data-key="KeyA"></div>
                    <div class="d-pad-right" data-key="KeyD"></div>
                    <div class="d-pad-down" data-key="KeyS"></div>
                </div>
                <div class="action-buttons">
                    <div class="button light-attack" data-key="KeyQ">A</div>
                    <div class="button heavy-attack" data-key="KeyE">B</div>
                    <div class="button special" data-key="KeyR">S</div>
                </div>
            `;
            
            fightingScreen.appendChild(touchControls);
            
            // Add touch event listeners
            const buttons = touchControls.querySelectorAll('[data-key]');
            buttons.forEach(button => {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const key = button.getAttribute('data-key');
                    this.keys[key] = true;
                    button.classList.add('active');
                });
                
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    const key = button.getAttribute('data-key');
                    this.keys[key] = false;
                    button.classList.remove('active');
                });
            });
            
            // Add swipe detection for movement
            fightingScreen.addEventListener('touchstart', (e) => {
                this.lastTouchX = e.touches[0].clientX;
            });
            
            fightingScreen.addEventListener('touchmove', (e) => {
                const touchX = e.touches[0].clientX;
                const diffX = touchX - this.lastTouchX;
                
                // Reset movement keys
                this.keys['KeyA'] = false;
                this.keys['KeyD'] = false;
                
                // Set movement based on swipe direction
                if (diffX < -10) {
                    this.keys['KeyA'] = true;
                } else if (diffX > 10) {
                    this.keys['KeyD'] = true;
                }
                
                this.lastTouchX = touchX;
            });
            
            fightingScreen.addEventListener('touchend', () => {
                // Reset movement keys
                this.keys['KeyA'] = false;
                this.keys['KeyD'] = false;
            });
        }
    }
    
    // Update gamepad state
    updateGamepadState() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            
            if (gamepad) {
                // Map gamepad buttons to keyboard keys
                this.gamepadState = {
                    // Player 1 controls (gamepad 0)
                    'KeyA': gamepad.axes[0] < -0.5,
                    'KeyD': gamepad.axes[0] > 0.5,
                    'KeyW': gamepad.buttons[0].pressed,
                    'KeyS': gamepad.buttons[1].pressed,
                    'KeyQ': gamepad.buttons[2].pressed,
                    'KeyE': gamepad.buttons[3].pressed,
                    'KeyR': gamepad.buttons[7].pressed,
                    
                    // Menu controls
                    'Enter': gamepad.buttons[9].pressed,
                    'Escape': gamepad.buttons[8].pressed
                };
                
                // Merge gamepad state with keyboard state
                Object.keys(this.gamepadState).forEach(key => {
                    if (this.gamepadState[key]) {
                        this.keys[key] = true;
                    }
                });
            }
        }
    }
    
    // Check if a key is pressed
    isKeyPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    // Get player 1 input
    getPlayer1Input() {
        return {
            left: this.isKeyPressed('KeyA'),
            right: this.isKeyPressed('KeyD'),
            up: this.isKeyPressed('KeyW'),
            down: this.isKeyPressed('KeyS'),
            lightAttack: this.isKeyPressed('KeyQ'),
            heavyAttack: this.isKeyPressed('KeyE'),
            special: this.isKeyPressed('KeyR')
        };
    }
    
    // Get player 2 input (for local multiplayer)
    getPlayer2Input() {
        return {
            left: this.isKeyPressed('ArrowLeft'),
            right: this.isKeyPressed('ArrowRight'),
            up: this.isKeyPressed('ArrowUp'),
            down: this.isKeyPressed('ArrowDown'),
            lightAttack: this.isKeyPressed('Comma'),
            heavyAttack: this.isKeyPressed('Period'),
            special: this.isKeyPressed('Slash')
        };
    }
    
    // Update input state
    update() {
        this.updateGamepadState();
    }
}

// Export input controller
export { InputController };