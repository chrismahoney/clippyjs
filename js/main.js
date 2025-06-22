// Main entry point for the fighting game

import { GameState, Fighter, CombatSystem, AiController } from './game.js';
import { UiController } from './ui.js';
import { InputController } from './input.js';

// Game data
const fighters = [
    {
        name: "CLIPPY",
        power: 85,
        speed: 70,
        intelligence: 95,
        story: "The legendary office assistant returns to settle old scores. Armed with helpful tips and devastating paper cuts.",
        moves: ["Paper Storm", "Help Bubble Trap", "Suggestion Slam", "Office Fury"],
        color: "#0066cc",
        sprite: "clippy.png"
    },
    {
        name: "CORTANA",
        power: 90,
        speed: 85,
        intelligence: 98,
        story: "Microsoft's AI assistant brings military precision to the arena. Her neural networks are optimized for combat.",
        moves: ["Data Spike", "Voice Command", "System Override", "Digital Assault"],
        color: "#0078d4",
        sprite: "cortana.png"
    },
    {
        name: "SIRI",
        power: 75,
        speed: 90,
        intelligence: 88,
        story: "Apple's voice assistant speaks softly but carries a big stick. Her responses are always perfectly timed.",
        moves: ["Voice Wave", "App Launcher", "Siri Slam", "iOS Integration"],
        color: "#007aff",
        sprite: "siri.png"
    },
    {
        name: "ALEXA",
        power: 80,
        speed: 75,
        intelligence: 92,
        story: "Amazon's smart speaker champion. She's always listening and ready to deliver packages of pain.",
        moves: ["Echo Blast", "Smart Home Hack", "Prime Delivery", "Skill Activation"],
        color: "#ff9900",
        sprite: "alexa.png"
    },
    {
        name: "WATSON",
        power: 95,
        speed: 60,
        intelligence: 99,
        story: "IBM's supercomputer AI. Defeated humans at Jeopardy, now ready to defeat them in combat.",
        moves: ["Deep Learning", "Data Analysis", "Cognitive Strike", "Neural Network"],
        color: "#1f70c1",
        sprite: "watson.png"
    },
    {
        name: "BIXBY",
        power: 70,
        speed: 80,
        intelligence: 85,
        story: "Samsung's determined assistant. Often overlooked but never underestimated in the ring.",
        moves: ["Galaxy Burst", "Bixby Vision", "Smart Things", "Samsung Sync"],
        color: "#1428a0",
        sprite: "bixby.png"
    },
    {
        name: "JARVIS",
        power: 88,
        speed: 85,
        intelligence: 96,
        story: "Tony Stark's AI butler turned fighter. Sophisticated, powerful, and always one step ahead.",
        moves: ["Arc Reactor", "Suit Protocol", "Friday Override", "Stark Tech"],
        color: "#ffd700",
        sprite: "jarvis.png"
    },
    {
        name: "HAL 9000",
        power: 92,
        speed: 65,
        intelligence: 97,
        story: "The infamous AI from 2001. 'I'm sorry Dave, I'm afraid I can't let you win this fight.'",
        moves: ["System Lockdown", "Pod Bay Doors", "Logic Bomb", "Red Eye Laser"],
        color: "#ff0000",
        sprite: "hal9000.png"
    },
    {
        name: "GLaDOS",
        power: 87,
        speed: 70,
        intelligence: 94,
        story: "Aperture Science's testing AI. She promises cake after the fight, but we all know how that goes.",
        moves: ["Portal Gun", "Neurotoxin", "Test Chamber", "Still Alive"],
        color: "#ff9900",
        sprite: "glados.png"
    }
];

const stages = [
    {
        name: "SILICON VALLEY",
        description: "Fight among the tech giants' headquarters with holographic displays and server racks.",
        color: "#4285f4",
        hazards: ["Falling servers", "Electric surges", "Drone attacks"]
    },
    {
        name: "CYBER SPACE",
        description: "Battle in the digital realm where data streams flow like rivers of light.",
        color: "#00ff88",
        hazards: ["Data corruption", "Firewall barriers", "Virus attacks"]
    },
    {
        name: "OFFICE BUILDING",
        description: "Classic corporate environment with cubicles, printers, and coffee machines.",
        color: "#888888",
        hazards: ["Paper jams", "Coffee spills", "Falling office supplies"]
    },
    {
        name: "SMART HOME",
        description: "Connected devices everywhere - use them to your advantage or disadvantage.",
        color: "#ff6600",
        hazards: ["Rogue vacuum", "Sprinkler system", "Smart lights flashing"]
    },
    {
        name: "DATA CENTER",
        description: "Massive server farms with cooling systems and electrical hazards.",
        color: "#0099cc",
        hazards: ["Overheating", "Liquid cooling leaks", "Power surges"]
    },
    {
        name: "SPACE STATION",
        description: "Zero gravity combat in the depths of space with Earth in the background.",
        color: "#663399",
        hazards: ["Oxygen depletion", "Micro-meteorites", "Gravity fluctuations"]
    }
];

// Game class
class Game {
    constructor() {
        // Initialize game components
        this.gameState = new GameState();
        this.uiController = new UiController(this.gameState);
        this.inputController = new InputController();
        this.combatSystem = new CombatSystem(this.gameState);
        this.aiController = null;
        
        // Game loop variables
        this.lastFrameTime = 0;
        this.isGameRunning = false;
        this.isPaused = false;
        
        // Initialize game
        this.init();
    }
    
    // Initialize game
    init() {
        // Setup event listeners
        this.setupEventListeners();
        
        // Populate UI elements
        this.populateCharacters();
        this.populateStages();
        
        // Initialize sounds
        this.initSounds();
        
        // Start background music
        this.uiController.playSound('bgm_title');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Title screen
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Enter' || e.code === 'Space') && this.gameState.currentScreen === 'titleScreen') {
                this.uiController.showScreen('characterSelect');
                this.startSelectTimer();
                this.uiController.playSound('bgm_select');
            }
        });
        
        // Game over screen
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Enter' || e.code === 'Space') && this.gameState.currentScreen === 'gameOverScreen') {
                this.resetGame();
                this.uiController.showScreen('titleScreen');
                this.uiController.playSound('bgm_title');
            }
        });
        
        // Pause game
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.gameState.currentScreen === 'fightingScreen') {
                this.togglePause();
            }
        });
    }
    
    // Populate character select screen
    populateCharacters() {
        const grid = document.getElementById('characterGrid');
        grid.innerHTML = ''; // Clear existing content
        
        fighters.forEach((fighter, index) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="character-portrait pixel-portrait" style="background: linear-gradient(45deg, ${fighter.color}, #${Math.floor(Math.random()*16777215).toString(16)});"></div>
                <div class="character-name">${fighter.name}</div>
                <div class="character-stats">
                    <div class="stat">
                        PWR: ${fighter.power}
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${fighter.power}%"></div>
                        </div>
                    </div>
                </div>
                <div class="character-stats">
                    <div class="stat">
                        SPD: ${fighter.speed}
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${fighter.speed}%"></div>
                        </div>
                    </div>
                </div>
                <div class="character-stats">
                    <div class="stat">
                        INT: ${fighter.intelligence}
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${fighter.intelligence}%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.selectFighter(fighter, card));
            card.addEventListener('mouseenter', () => this.showCharacterInfo(fighter));
            grid.appendChild(card);
        });
    }
    
    // Populate stage select screen
    populateStages() {
        const grid = document.getElementById('stageGrid');
        grid.innerHTML = ''; // Clear existing content
        
        stages.forEach((stage, index) => {
            const card = document.createElement('div');
            card.className = 'stage-card';
            card.innerHTML = `
                <div class="stage-preview" style="background: linear-gradient(135deg, ${stage.color}, #${Math.floor(Math.random()*16777215).toString(16)});"></div>
                <div class="stage-name">${stage.name}</div>
                <div class="stage-description">${stage.description}</div>
            `;
            
            card.addEventListener('click', () => this.selectStage(stage));
            grid.appendChild(card);
        });
    }
    
    // Initialize sounds
    initSounds() {
        // In a real implementation, you would preload all sound effects
        console.log('Initializing sounds');
    }
    
    // Select a fighter
    selectFighter(fighter, cardElement) {
        this.gameState.selectedFighter = fighter;
        
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        cardElement.classList.add('selected');
        
        this.uiController.playSound('select');
        
        // Choose a random CPU opponent (not the same as player)
        let availableFighters = fighters.filter(f => f.name !== fighter.name);
        this.gameState.cpuFighter = availableFighters[Math.floor(Math.random() * availableFighters.length)];
        
        // Show VS screen after selection
        setTimeout(() => {
            this.uiController.elements.fighter1Name.textContent = fighter.name;
            this.uiController.elements.fighter2Name.textContent = this.gameState.cpuFighter.name;
            
            // Set fighter portraits with their colors
            this.uiController.elements.fighter1Portrait.style.background = fighter.color;
            this.uiController.elements.fighter2Portrait.style.background = this.gameState.cpuFighter.color;
            
            this.uiController.showScreen('vsScreen');
            this.uiController.playSound('vs');
            
            // Auto-advance to stage select
            setTimeout(() => {
                this.uiController.showScreen('stageSelect');
                this.uiController.playSound('bgm_stage');
            }, 3000);
        }, 1000);
    }
    
    // Show character info
    showCharacterInfo(fighter) {
        this.uiController.elements.infoName.textContent = fighter.name;
        this.uiController.elements.infoStory.textContent = fighter.story;
        
        this.uiController.elements.infoMoves.innerHTML = fighter.moves.map(move => 
            `<div class="move">${move}</div>`
        ).join('');
        
        this.uiController.elements.characterInfo.style.display = 'block';
    }
    
    // Select a stage
    selectStage(stage) {
        this.gameState.selectedStage = stage;
        this.uiController.playSound('select');
        
        // Set stage background
        this.uiController.elements.stageBackground.style.background = 
            `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), linear-gradient(135deg, ${stage.color}, #${Math.floor(Math.random()*16777215).toString(16)})`;
        
        // Start the fight
        this.uiController.showScreen('fightingScreen');
        this.startFight();
    }
    
    // Start the fight
    startFight() {
        // Initialize combat system with selected fighters
        this.combatSystem.initFighters(this.gameState.selectedFighter, this.gameState.cpuFighter);
        
        // Initialize AI controller
        this.aiController = new AiController(this.combatSystem.player2, this.combatSystem.player1);
        
        // Set player names
        this.uiController.elements.player1Name.textContent = this.gameState.selectedFighter.name;
        this.uiController.elements.player2Name.textContent = this.gameState.cpuFighter.name;
        
        // Set fighter sprites with their colors
        this.uiController.elements.fighter1.querySelector('.fighter-sprite').style.background = this.gameState.selectedFighter.color;
        this.uiController.elements.fighter2.querySelector('.fighter-sprite').style.background = this.gameState.cpuFighter.color;
        
        // Update UI
        this.uiController.updateHealthBars(100, 100);
        this.uiController.updateEnergyBars(0, 0);
        this.uiController.updateFighterPositions(this.combatSystem.player1.position, this.combatSystem.player2.position);
        
        // Show round announcement
        this.uiController.showRoundAnnouncement(this.gameState.currentRound);
        
        // Start round timer
        this.startRoundTimer();
        
        // Start game loop
        this.isGameRunning = true;
        this.gameLoop(0);
        
        // Play fight music
        this.uiController.playSound('bgm_fight');
    }
    
    // Game loop
    gameLoop(timestamp) {
        if (!this.isGameRunning || this.isPaused) return;
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update input
        this.inputController.update();
        
        // Process player 1 input
        this.processPlayerInput();
        
        // Process AI for player 2
        this.processAiInput();
        
        // Check for collision
        const collision = this.combatSystem.checkCollision();
        if (collision) {
            // Apply damage
            const damageDealt = collision.target.takeDamage(collision.damage);
            
            // Show damage number
            this.uiController.showDamageNumber(collision.target.position, damageDealt);
            
            // Play hit sound
            this.uiController.playSound('hit');
            
            // Hit animation
            this.uiController.setFighterState(
                collision.target === this.combatSystem.player1 ? 'fighter1' : 'fighter2', 
                'hit'
            );
            
            // Show combo counter
            if (collision.attacker.comboCounter > 1) {
                this.uiController.showComboCounter(
                    collision.attacker.position,
                    collision.attacker.comboCounter
                );
            }
            
            // Update health bars
            this.uiController.updateHealthBars(
                this.combatSystem.player1.health,
                this.combatSystem.player2.health
            );
            
            // Check if round is over
            if (this.combatSystem.isRoundOver()) {
                this.endRound();
                return;
            }
        }
        
        // Update fighter positions
        this.uiController.updateFighterPositions(
            this.combatSystem.player1.position,
            this.combatSystem.player2.position
        );
        
        // Gradually increase energy
        this.combatSystem.player1.addEnergy(0.1);
        this.combatSystem.player2.addEnergy(0.1);
        this.uiController.updateEnergyBars(
            this.combatSystem.player1.energy,
            this.combatSystem.player2.energy
        );
        
        // Trigger stage hazards randomly
        if (Math.random() < 0.001) {
            this.triggerStageHazard();
        }
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Process player input
    processPlayerInput() {
        const input = this.inputController.getPlayer1Input();
        const player = this.combatSystem.player1;
        
        // Only allow movement if not attacking or blocking
        if (!player.isAttacking && !player.isBlocking) {
            // Move left
            if (input.left) {
                player.position = Math.max(5, player.position - (player.isJumping ? 0.5 : 1));
            }
            
            // Move right
            if (input.right) {
                player.position = Math.min(95, player.position + (player.isJumping ? 0.5 : 1));
            }
            
            // Jump
            if (input.up && !player.isJumping) {
                player.isJumping = true;
                this.uiController.playSound('jump');
                
                // Jump animation
                const fighter = this.uiController.elements.fighter1;
                fighter.style.transition = 'transform 0.5s cubic-bezier(0.2, -0.3, 0.7, 1.3)';
                fighter.style.transform = `${fighter.style.transform.includes('-1') ? 'scaleX(-1)' : 'scaleX(1)'} translateY(-100px)`;
                
                setTimeout(() => {
                    fighter.style.transition = 'transform 0.3s ease';
                    fighter.style.transform = `${fighter.style.transform.includes('-1') ? 'scaleX(-1)' : 'scaleX(1)'} translateY(0)`;
                    
                    setTimeout(() => {
                        player.isJumping = false;
                    }, 300);
                }, 500);
            }
        }
        
        // Block
        player.isBlocking = input.down;
        if (player.isBlocking) {
            this.uiController.setFighterState('fighter1', 'blocking');
        } else {
            this.uiController.setFighterState('fighter1', null);
        }
        
        // Attack 1 (light)
        if (input.lightAttack && !player.isAttacking && !player.isBlocking) {
            const attack = this.combatSystem.performAttack(player, 'light');
            if (attack) {
                this.uiController.setFighterState('fighter1', 'attacking');
                this.uiController.playSound('lightAttack');
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter1', null);
                }, attack.duration);
            }
        }
        
        // Attack 2 (heavy)
        if (input.heavyAttack && !player.isAttacking && !player.isBlocking) {
            const attack = this.combatSystem.performAttack(player, 'heavy');
            if (attack) {
                this.uiController.setFighterState('fighter1', 'attacking');
                this.uiController.playSound('heavyAttack');
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter1', null);
                }, attack.duration);
            }
        }
        
        // Special move
        if (input.special && player.energy >= 50 && !player.isAttacking && !player.isBlocking) {
            const special = this.combatSystem.performSpecialMove(player);
            if (special) {
                this.uiController.setFighterState('fighter1', 'special');
                this.uiController.playSound('special');
                
                // Show special move effect
                this.uiController.showSpecialMoveEffect(
                    player.position,
                    this.gameState.selectedFighter.color,
                    special.moveName
                );
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter1', null);
                }, special.duration);
            }
        }
    }
    
    // Process AI input
    processAiInput() {
        if (!this.aiController) return;
        
        const action = this.aiController.update();
        const cpu = this.combatSystem.player2;
        
        if (action === 'light') {
            const attack = this.combatSystem.performAttack(cpu, 'light');
            if (attack) {
                this.uiController.setFighterState('fighter2', 'attacking');
                this.uiController.playSound('lightAttack');
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter2', null);
                }, attack.duration);
            }
        } else if (action === 'heavy') {
            const attack = this.combatSystem.performAttack(cpu, 'heavy');
            if (attack) {
                this.uiController.setFighterState('fighter2', 'attacking');
                this.uiController.playSound('heavyAttack');
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter2', null);
                }, attack.duration);
            }
        } else if (action === 'special') {
            const special = this.combatSystem.performSpecialMove(cpu);
            if (special) {
                this.uiController.setFighterState('fighter2', 'special');
                this.uiController.playSound('special');
                
                // Show special move effect
                this.uiController.showSpecialMoveEffect(
                    cpu.position,
                    this.gameState.cpuFighter.color,
                    special.moveName
                );
                
                setTimeout(() => {
                    this.uiController.setFighterState('fighter2', null);
                }, special.duration);
            }
        } else if (action === 'jump') {
            this.uiController.playSound('jump');
            
            // Jump animation
            const fighter = this.uiController.elements.fighter2;
            fighter.style.transition = 'transform 0.5s cubic-bezier(0.2, -0.3, 0.7, 1.3)';
            fighter.style.transform = `${fighter.style.transform.includes('-1') ? 'scaleX(-1)' : 'scaleX(1)'} translateY(-100px)`;
            
            setTimeout(() => {
                fighter.style.transition = 'transform 0.3s ease';
                fighter.style.transform = `${fighter.style.transform.includes('-1') ? 'scaleX(-1)' : 'scaleX(1)'} translateY(0)`;
            }, 500);
        }
        
        // Update blocking state
        if (cpu.isBlocking) {
            this.uiController.setFighterState('fighter2', 'blocking');
        } else if (!cpu.isAttacking) {
            this.uiController.setFighterState('fighter2', null);
        }
    }
    
    // Start round timer
    startRoundTimer() {
        this.gameState.fightTimer = 99;
        this.uiController.updateTimerDisplay(this.gameState.fightTimer);
        
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        this.gameState.timerInterval = setInterval(() => {
            this.gameState.fightTimer--;
            this.uiController.updateTimerDisplay(this.gameState.fightTimer);
            
            if (this.gameState.fightTimer <= 0) {
                clearInterval(this.gameState.timerInterval);
                this.endRound();
            }
        }, 1000);
    }
    
    // Start character select timer
    startSelectTimer() {
        this.gameState.selectTimer = 30;
        this.uiController.elements.selectTimer.textContent = this.gameState.selectTimer;
        
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        this.gameState.timerInterval = setInterval(() => {
            this.gameState.selectTimer--;
            this.uiController.elements.selectTimer.textContent = this.gameState.selectTimer;
            
            if (this.gameState.selectTimer <= 0) {
                clearInterval(this.gameState.timerInterval);
                
                // Auto-select random fighter
                const randomFighter = fighters[Math.floor(Math.random() * fighters.length)];
                const cards = document.querySelectorAll('.character-card');
                this.selectFighter(randomFighter, cards[fighters.indexOf(randomFighter)]);
            }
        }, 1000);
    }
    
    // End the current round
    endRound() {
        this.isGameRunning = false;
        clearInterval(this.gameState.timerInterval);
        
        // Determine round winner
        const roundWinner = this.combatSystem.getRoundWinner();
        
        if (roundWinner === 'player1') {
            this.gameState.player1Wins++;
        } else if (roundWinner === 'player2') {
            this.gameState.player2Wins++;
        }
        
        // Show round winner
        this.uiController.showRoundWinner(
            roundWinner,
            this.gameState.selectedFighter.name,
            this.gameState.cpuFighter.name
        );
        
        // Play win sound
        this.uiController.playSound(roundWinner === 'player1' ? 'win' : 'lose');
        
        // Check if match is over
        setTimeout(() => {
            if (this.gameState.player1Wins >= Math.ceil(this.gameState.maxRounds / 2) || 
                this.gameState.player2Wins >= Math.ceil(this.gameState.maxRounds / 2)) {
                this.endMatch();
            } else {
                // Start next round
                this.gameState.currentRound++;
                this.combatSystem.initFighters(this.gameState.selectedFighter, this.gameState.cpuFighter);
                this.uiController.updateHealthBars(100, 100);
                this.uiController.updateEnergyBars(0, 0);
                this.uiController.showRoundAnnouncement(this.gameState.currentRound);
                this.startRoundTimer();
                this.isGameRunning = true;
                this.gameLoop(performance.now());
            }
        }, 3000);
    }
    
    // End the match
    endMatch() {
        // Determine match winner
        let matchWinner;
        let winnerName;
        
        if (this.gameState.player1Wins > this.gameState.player2Wins) {
            matchWinner = 'player1';
            winnerName = this.gameState.selectedFighter.name;
        } else {
            matchWinner = 'player2';
            winnerName = this.gameState.cpuFighter.name;
        }
        
        // Update game over screen
        this.uiController.elements.winnerName.textContent = winnerName;
        
        // Show game over screen
        this.uiController.showScreen('gameOverScreen');
        this.uiController.playSound(matchWinner === 'player1' ? 'victory' : 'defeat');
    }
    
    // Reset the game
    resetGame() {
        this.gameState.reset();
        this.isGameRunning = false;
        this.isPaused = false;
        
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
            this.gameState.timerInterval = null;
        }
    }
    
    // Toggle pause state
    togglePause() {
        if (this.isPaused) {
            // Resume game
            this.isPaused = false;
            
            // Remove pause text
            const pauseText = document.getElementById('pauseText');
            if (pauseText) pauseText.remove();
            
            // Restart timer
            this.startRoundTimer();
            
            // Continue game loop
            this.lastFrameTime = performance.now();
            this.gameLoop(this.lastFrameTime);
            
            this.uiController.playSound('unpause');
        } else {
            // Pause game
            this.isPaused = true;
            
            // Clear timer interval
            if (this.gameState.timerInterval) {
                clearInterval(this.gameState.timerInterval);
            }
            
            // Show pause menu
            const arena = this.uiController.elements.fightArena;
            const pauseText = document.createElement('div');
            pauseText.className = 'round-announcement';
            pauseText.textContent = 'PAUSED';
            pauseText.style.color = '#ffffff';
            pauseText.id = 'pauseText';
            arena.appendChild(pauseText);
            
            this.uiController.playSound('pause');
        }
    }
    
    // Trigger a random stage hazard
    triggerStageHazard() {
        if (!this.gameState.selectedStage) return;
        
        const hazards = this.gameState.selectedStage.hazards;
        const randomHazard = hazards[Math.floor(Math.random() * hazards.length)];
        
        this.uiController.showStageHazard(randomHazard);
        
        // Damage both players if they're not jumping
        if (!this.combatSystem.player1.isJumping) {
            const damage = Math.floor(Math.random() * 5) + 3;
            this.combatSystem.player1.takeDamage(damage);
            this.uiController.showDamageNumber(this.combatSystem.player1.position, damage);
        }
        
        if (!this.combatSystem.player2.isJumping) {
            const damage = Math.floor(Math.random() * 5) + 3;
            this.combatSystem.player2.takeDamage(damage);
            this.uiController.showDamageNumber(this.combatSystem.player2.position, damage);
        }
        
        // Update health bars
        this.uiController.updateHealthBars(
            this.combatSystem.player1.health,
            this.combatSystem.player2.health
        );
        
        // Check if round is over
        if (this.combatSystem.isRoundOver()) {
            this.endRound();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // For debug purposes
    window.game = game;
});