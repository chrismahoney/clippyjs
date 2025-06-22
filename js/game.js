// Main game logic

// Game state management
class GameState {
    constructor() {
        this.currentScreen = 'titleScreen';
        this.selectedFighter = null;
        this.cpuFighter = null;
        this.selectedStage = null;
        this.currentRound = 1;
        this.maxRounds = 3;
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.fightTimer = 99;
        this.timerInterval = null;
    }
    
    reset() {
        this.currentRound = 1;
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.selectedFighter = null;
        this.cpuFighter = null;
        this.selectedStage = null;
    }
}

// Fighter class
class Fighter {
    constructor(data) {
        // Validate data parameter to prevent null/undefined errors
        if (!data) {
            throw new Error('Fighter data cannot be null or undefined');
        }
        
        // Validate data parameter to prevent null/undefined errors
        if (!data) {
            throw new Error('Fighter data cannot be null or undefined');
        }
        
        this.name = data.name;
        this.power = data.power;
        this.speed = data.speed;
        this.intelligence = data.intelligence;
        this.color = data.color;
        this.specialMoves = data.moves;
        this.story = data.story;
        
        // Fighting state
        this.health = 100;
        this.energy = 0;
        this.position = 0;
        this.isJumping = false;
        this.isBlocking = false;
        this.isAttacking = false;
        this.direction = 1; // 1 = facing right, -1 = facing left
        this.comboCounter = 0;
        this.lastMoveTime = 0;
    }
    
    reset(startPosition, direction) {
        this.health = 100;
        this.energy = 0;
        this.position = startPosition;
        this.isJumping = false;
        this.isBlocking = false;
        this.isAttacking = false;
        this.direction = direction;
        this.comboCounter = 0;
        this.lastMoveTime = 0;
    }
    
    takeDamage(amount) {
        if (this.isBlocking) {
            // Reduce damage when blocking
            amount = Math.floor(amount / 2);
        }
        
        this.health = Math.max(0, this.health - amount);
        return amount;
    }
    
    addEnergy(amount) {
        this.energy = Math.min(100, this.energy + amount);
    }
    
    useEnergy(amount) {
        if (this.energy >= amount) {
            this.energy -= amount;
            return true;
        }
        return false;
    }
}

// Combat system
class CombatSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.player1 = null;
        this.player2 = null;
        this.collisionDistance = 10; // % of screen width
    }
    
    initFighters(fighter1Data, fighter2Data) {
        this.player1 = new Fighter(fighter1Data);
        this.player2 = new Fighter(fighter2Data);
        
        // Set initial positions
        this.player1.reset(20, 1);
        this.player2.reset(80, -1);
    }
    
    performAttack(attacker, type) {
        if (attacker.isAttacking || attacker.isBlocking) return;
        
        attacker.isAttacking = true;
        
        // Calculate attack duration
        const duration = type === 'light' ? 400 : type === 'heavy' ? 700 : 1000;
        
        // Add energy
        attacker.addEnergy(type === 'light' ? 5 : 10);
        
        // Reset attack state after duration
        setTimeout(() => {
            attacker.isAttacking = false;
        }, duration);
        
        // Check for combo
        const now = Date.now();
        if (now - attacker.lastMoveTime < 1000) {
            attacker.comboCounter++;
        } else {
            attacker.comboCounter = 0;
        }
        attacker.lastMoveTime = now;
        
        return {
            type: type,
            duration: duration,
            isCombo: attacker.comboCounter > 1
        };
    }
    
    performSpecialMove(attacker) {
        if (attacker.energy < 50 || attacker.isAttacking || attacker.isBlocking) return;
        
        if (attacker.useEnergy(50)) {
            attacker.isAttacking = true;
            
            // Reset attack state after duration
            setTimeout(() => {
                attacker.isAttacking = false;
            }, 1000);
            
            return {
                type: 'special',
                moveName: attacker.specialMoves[Math.floor(Math.random() * attacker.specialMoves.length)],
                duration: 1000
            };
        }
        
        return null;
    }
    
    checkCollision() {
        const distance = Math.abs(this.player1.position - this.player2.position);
        
        if (distance < this.collisionDistance) {
            // Check for attacks
            if (this.player1.isAttacking && !this.player2.isBlocking) {
                const damage = this.calculateDamage(this.player1, this.player2, this.player1.isAttacking);
                return {
                    target: this.player2,
                    damage: damage,
                    attacker: this.player1
                };
            }
            
            if (this.player2.isAttacking && !this.player1.isBlocking) {
                const damage = this.calculateDamage(this.player2, this.player1, this.player2.isAttacking);
                return {
                    target: this.player1,
                    damage: damage,
                    attacker: this.player2
                };
            }
        }
        
        return null;
    }
    
    calculateDamage(attacker, defender, attackType) {
        let baseDamage;
        
        if (attackType === 'light' || attackType === true) {
            baseDamage = 5;
        } else if (attackType === 'heavy') {
            baseDamage = 10;
        } else if (attackType === 'special') {
            baseDamage = 20;
        }
        
        // Apply power and intelligence modifiers
        const powerModifier = attacker.power / 100;
        const defenseModifier = defender.intelligence / 100;
        
        // Calculate final damage
        let finalDamage = Math.round(baseDamage * powerModifier * (2 - defenseModifier));
        
        // Add combo bonus
        if (attacker.comboCounter > 1) {
            finalDamage = Math.round(finalDamage * (1 + attacker.comboCounter * 0.2));
        }
        
        // Add some randomness
        finalDamage += Math.floor(Math.random() * 3) - 1;
        
        return Math.max(1, finalDamage); // Minimum 1 damage
    }
    
    isRoundOver() {
        return this.player1.health <= 0 || this.player2.health <= 0 || this.gameState.fightTimer <= 0;
    }
    
    getRoundWinner() {
        if (this.player1.health <= 0) {
            return 'player2';
        } else if (this.player2.health <= 0) {
            return 'player1';
        } else if (this.player1.health > this.player2.health) {
            return 'player1';
        } else if (this.player2.health > this.player1.health) {
            return 'player2';
        } else {
            return 'draw';
        }
    }
}

// AI Controller for CPU opponent
class AiController {
    constructor(fighter, opponent) {
        this.fighter = fighter;
        this.opponent = opponent;
        this.decisionCooldown = 0;
        this.difficulty = 0.7; // 0-1 scale, higher is more difficult
    }
    
    update() {
        if (this.decisionCooldown > 0) {
            this.decisionCooldown--;
            return;
        }
        
        // Calculate distance to opponent
        const distance = Math.abs(this.fighter.position - this.opponent.position);
        
        // Make a decision based on the situation
        const decision = Math.random();
        
        // If opponent is attacking, high chance to block
        if (this.opponent.isAttacking && decision < 0.7 * this.difficulty) {
            this.fighter.isBlocking = true;
            this.decisionCooldown = 20;
        } else {
            this.fighter.isBlocking = false;
            
            // If close to opponent, chance to attack
            if (distance < 15) {
                if (decision < 0.1 * this.difficulty && this.fighter.energy >= 50) {
                    // Special move
                    return 'special';
                } else if (decision < 0.3 * this.difficulty) {
                    // Heavy attack
                    return 'heavy';
                } else if (decision < 0.5 * this.difficulty) {
                    // Light attack
                    return 'light';
                }
            } else {
                // Move toward opponent
                if (this.fighter.position < this.opponent.position) {
                    this.fighter.position = Math.min(95, this.fighter.position + 0.5 * this.fighter.speed / 100);
                } else {
                    this.fighter.position = Math.max(5, this.fighter.position - 0.5 * this.fighter.speed / 100);
                }
                
                // Random jump
                if (decision < 0.02 * this.difficulty && !this.fighter.isJumping) {
                    this.fighter.isJumping = true;
                    
                    setTimeout(() => {
                        this.fighter.isJumping = false;
                    }, 800);
                    
                    return 'jump';
                }
            }
        }
        
        this.decisionCooldown = 10;
        return null;
    }
}

// Export game modules
export { GameState, Fighter, CombatSystem, AiController };