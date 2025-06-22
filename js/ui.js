// UI management for the fighting game

// UI Controller
class UiController {
    constructor(gameState) {
        this.gameState = gameState;
        this.screens = {
            titleScreen: document.getElementById('titleScreen'),
            characterSelect: document.getElementById('characterSelect'),
            vsScreen: document.getElementById('vsScreen'),
            stageSelect: document.getElementById('stageSelect'),
            fightingScreen: document.getElementById('fightingScreen'),
            gameOverScreen: document.getElementById('gameOverScreen')
        };
        
        this.elements = {
            // Character select
            characterGrid: document.getElementById('characterGrid'),
            characterInfo: document.getElementById('characterInfo'),
            infoName: document.getElementById('infoName'),
            infoStory: document.getElementById('infoStory'),
            infoMoves: document.getElementById('infoMoves'),
            selectTimer: document.getElementById('selectTimer'),
            
            // VS screen
            fighter1Name: document.getElementById('fighter1Name'),
            fighter2Name: document.getElementById('fighter2Name'),
            fighter1Portrait: document.getElementById('fighter1Portrait'),
            fighter2Portrait: document.getElementById('fighter2Portrait'),
            
            // Stage select
            stageGrid: document.getElementById('stageGrid'),
            
            // Fighting screen
            player1Name: document.getElementById('player1Name'),
            player2Name: document.getElementById('player2Name'),
            player1Health: document.getElementById('player1Health'),
            player2Health: document.getElementById('player2Health'),
            player1Energy: document.getElementById('player1Energy'),
            player2Energy: document.getElementById('player2Energy'),
            roundTimer: document.getElementById('roundTimer'),
            fighter1: document.getElementById('fighter1'),
            fighter2: document.getElementById('fighter2'),
            stageBackground: document.getElementById('stageBackground'),
            fightArena: document.getElementById('fightArena'),
            
            // Game over
            gameOverText: document.getElementById('gameOverText'),
            winnerName: document.getElementById('winnerName')
        };
    }
    
    // Show a specific screen
    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        this.screens[screenId].classList.add('active');
        this.gameState.currentScreen = screenId;
        
        // Play transition sound
        this.playSound('transition');
    }
    
    // Update health bars
    updateHealthBars(player1Health, player2Health) {
        this.elements.player1Health.style.width = `${player1Health}%`;
        this.elements.player2Health.style.width = `${player2Health}%`;
        
        // Change color based on health
        if (player1Health < 20) {
            this.elements.player1Health.style.background = '#ff0000';
        } else if (player1Health < 50) {
            this.elements.player1Health.style.background = '#ffff00';
        }
        
        if (player2Health < 20) {
            this.elements.player2Health.style.background = '#ff0000';
        } else if (player2Health < 50) {
            this.elements.player2Health.style.background = '#ffff00';
        }
    }
    
    // Update energy bars
    updateEnergyBars(player1Energy, player2Energy) {
        this.elements.player1Energy.style.width = `${player1Energy}%`;
        this.elements.player2Energy.style.width = `${player2Energy}%`;
        
        // Pulse when full
        if (player1Energy >= 100) {
            this.elements.player1Energy.style.animation = 'pulse 1s infinite';
        } else {
            this.elements.player1Energy.style.animation = 'none';
        }
        
        if (player2Energy >= 100) {
            this.elements.player2Energy.style.animation = 'pulse 1s infinite';
        } else {
            this.elements.player2Energy.style.animation = 'none';
        }
    }
    
    // Update timer display
    updateTimerDisplay(time) {
        this.elements.roundTimer.textContent = time.toString().padStart(2, '0');
        
        // Flash timer when low
        if (time <= 10) {
            this.elements.roundTimer.style.color = time % 2 === 0 ? '#ff0000' : '#ffffff';
        } else {
            this.elements.roundTimer.style.color = '#ffffff';
        }
    }
    
    // Update fighter positions
    updateFighterPositions(player1Position, player2Position) {
        this.elements.fighter1.style.left = `${player1Position}%`;
        this.elements.fighter2.style.left = `${player2Position}%`;
        
        // Update fighter direction based on relative positions
        if (player1Position < player2Position) {
            this.elements.fighter1.style.transform = 'scaleX(1)';
            this.elements.fighter2.style.transform = 'scaleX(-1)';
        } else {
            this.elements.fighter1.style.transform = 'scaleX(-1)';
            this.elements.fighter2.style.transform = 'scaleX(1)';
        }
    }
    
    // Show round announcement
    showRoundAnnouncement(round) {
        const announcement = document.createElement('div');
        announcement.className = 'round-announcement';
        announcement.textContent = `ROUND ${round}`;
        this.elements.fightArena.appendChild(announcement);
        
        this.playSound('round');
        
        // Remove after animation
        setTimeout(() => {
            announcement.remove();
            this.playSound('fight');
            
            // Show "FIGHT!" text
            const fightText = document.createElement('div');
            fightText.className = 'round-announcement';
            fightText.textContent = 'FIGHT!';
            this.elements.fightArena.appendChild(fightText);
            
            setTimeout(() => {
                fightText.remove();
            }, 2000);
        }, 2000);
    }
    
    // Show damage number
    showDamageNumber(position, damage) {
        const damageNumber = document.createElement('div');
        damageNumber.className = 'damage-number';
        damageNumber.textContent = damage;
        damageNumber.style.left = `${position}%`;
        damageNumber.style.bottom = '60%';
        this.elements.fightArena.appendChild(damageNumber);
        
        setTimeout(() => {
            damageNumber.remove();
        }, 1000);
    }
    
    // Show special move effect
    showSpecialMoveEffect(position, color, moveName) {
        // Show move name
        const moveText = document.createElement('div');
        moveText.className = 'round-announcement';
        moveText.style.fontSize = '2rem';
        moveText.style.color = color;
        moveText.textContent = moveName;
        this.elements.fightArena.appendChild(moveText);
        
        // Create special effect
        const effect = document.createElement('div');
        effect.className = 'special-effect';
        effect.style.left = `${position}%`;
        effect.style.bottom = '30%';
        effect.style.background = `radial-gradient(circle, ${color}, transparent)`;
        this.elements.fightArena.appendChild(effect);
        
        setTimeout(() => {
            moveText.remove();
            effect.remove();
        }, 1000);
    }
    
    // Show combo counter
    showComboCounter(position, count) {
        if (count <= 1) return;
        
        const comboText = document.createElement('div');
        comboText.className = 'damage-number';
        comboText.textContent = `${count} HIT COMBO!`;
        comboText.style.left = `${position}%`;
        comboText.style.bottom = '70%';
        comboText.style.color = '#ffff00';
        this.elements.fightArena.appendChild(comboText);
        
        setTimeout(() => {
            comboText.remove();
        }, 1000);
    }
    
    // Show round winner
    showRoundWinner(winner, player1Name, player2Name) {
        const winnerText = document.createElement('div');
        winnerText.className = 'round-announcement';
        
        if (winner === 'player1') {
            winnerText.textContent = `${player1Name} WINS!`;
            winnerText.style.color = '#00ffff';
        } else if (winner === 'player2') {
            winnerText.textContent = `${player2Name} WINS!`;
            winnerText.style.color = '#ff00ff';
        } else {
            winnerText.textContent = 'DRAW!';
            winnerText.style.color = '#ffffff';
        }
        
        this.elements.fightArena.appendChild(winnerText);
        
        setTimeout(() => {
            winnerText.remove();
        }, 3000);
    }
    
    // Show stage hazard
    showStageHazard(hazard) {
        // Show hazard warning
        const warningText = document.createElement('div');
        warningText.className = 'round-announcement';
        warningText.style.fontSize = '1.5rem';
        warningText.style.color = '#ff0000';
        warningText.textContent = `WARNING: ${hazard}`;
        this.elements.fightArena.appendChild(warningText);
        
        // Play warning sound
        this.playSound('hazard');
        
        setTimeout(() => {
            warningText.remove();
            
            // Apply hazard effect
            const hazardEffect = document.createElement('div');
            hazardEffect.className = 'special-effect';
            hazardEffect.style.width = '100%';
            hazardEffect.style.height = '100%';
            hazardEffect.style.borderRadius = '0';
            hazardEffect.style.background = `rgba(255, 0, 0, 0.3)`;
            this.elements.fightArena.appendChild(hazardEffect);
            
            setTimeout(() => {
                hazardEffect.remove();
            }, 1000);
        }, 2000);
    }
    
    // Set fighter animation state
    setFighterState(fighterId, state) {
        const fighter = this.elements[fighterId];
        
        // Remove all states
        fighter.classList.remove('attacking', 'blocking', 'hit', 'special', 'jumping');
        
        // Add new state
        if (state) {
            fighter.classList.add(state);
        }
    }
    
    // Play sound effect
    playSound(type) {
        // In a real implementation, you would play actual audio files
        console.log(`Playing sound: ${type}`);
    }
}

// Export UI controller
export { UiController };