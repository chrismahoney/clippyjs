// Main script for Clippy Agents Demo

// List of available agents
const availableAgents = [
    'Clippy', 'Bonzi', 'Genie', 'Merlin', 'Rover',
    'Links', 'F1', 'Peedy', 'Genius', 'Rocky'
];

// Greetings that agents can say
const greetings = [
    "Hello! How can I help you today?",
    "Need some assistance?",
    "I'm here to help!",
    "Looking for some help?",
    "What can I do for you?",
    "Need a hand with something?",
    "I noticed you might need some help.",
    "Any questions I can answer?",
    "I'm your friendly assistant!",
    "Let me know if you need anything."
];

// Tips that agents can give
const tips = [
    "Try clicking and dragging me to move me around!",
    "Double-click me to see a random animation!",
    "I can help you navigate your computer!",
    "Did you know you can add multiple assistants?",
    "I'm powered by ClippyJS, a modern remake of classic assistants!",
    "Each assistant has unique animations and sounds!",
    "You can clear all assistants with the button at the top!",
    "Try adding all assistants at once for maximum nostalgia!",
    "We're here to make your computing experience more fun!",
    "Remember the 90s? We do!"
];

// Store active agents
const activeAgents = {};

// Get random position within visible area
function getRandomPosition() {
    const padding = 100; // Keep agents away from edges
    return {
        x: padding + Math.random() * (window.innerWidth - padding * 2),
        y: padding + Math.random() * (window.innerHeight - padding * 2)
    };
}

// Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Add a new agent to the screen
function addAgent(agentName) {
    // Check if agent is already active
    if (activeAgents[agentName]) {
        console.log(`${agentName} is already active`);
        return;
    }
    
    // Update status
    updateStatus(`Loading ${agentName}...`);
    
    // Load the agent
    clippy.load(agentName, agent => {
        // Store the agent
        activeAgents[agentName] = agent;
        
        // Show the agent
        agent.show();
        
        // Move to random position
        const position = getRandomPosition();
        agent.moveTo(position.x, position.y);
        
        // Say hello
        agent.speak(getRandomItem(greetings));
        
        // Set up click handler for speaking
        $(agent._el).on('click', () => {
            agent.speak(getRandomItem(tips));
            agent.animate();
        });
        
        // Set up random animations
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to animate
                agent.animate();
            }
        }, 10000); // Every 10 seconds
        
        // Set up random movements
        setInterval(() => {
            if (Math.random() < 0.5) { // 50% chance to move
                const newPosition = getRandomPosition();
                agent.moveTo(newPosition.x, newPosition.y);
            }
        }, 15000); // Every 15 seconds
        
        // Update status and button state
        updateStatus();
        updateButtonState();
    });
}

// Remove an agent from the screen
function removeAgent(agentName) {
    if (activeAgents[agentName]) {
        activeAgents[agentName].hide(true, () => {
            delete activeAgents[agentName];
            updateStatus();
            updateButtonState();
        });
    }
}

// Clear all agents
function clearAllAgents() {
    Object.keys(activeAgents).forEach(agentName => {
        removeAgent(agentName);
    });
}

// Add a random agent
function addRandomAgent() {
    // Filter out already active agents
    const availableToAdd = availableAgents.filter(agent => !activeAgents[agent]);
    
    if (availableToAdd.length === 0) {
        updateStatus("All agents are already active!");
        return;
    }
    
    // Pick a random agent
    const randomAgent = getRandomItem(availableToAdd);
    addAgent(randomAgent);
}

// Update status text
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    const activeCount = Object.keys(activeAgents).length;
    
    if (message) {
        statusElement.textContent = message;
    } else if (activeCount === 0) {
        statusElement.textContent = "No agents active. Click an agent name to add it.";
    } else {
        statusElement.textContent = `${activeCount} agent${activeCount !== 1 ? 's' : ''} active. Click an agent to make it speak!`;
    }
}

// Update button states
function updateButtonState() {
    const agentButtons = document.querySelectorAll('.agent-button');
    
    agentButtons.forEach(button => {
        const agentName = button.getAttribute('data-agent');
        if (activeAgents[agentName]) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Initialize the application
function init() {
    // Set up event listeners for agent buttons
    document.querySelectorAll('.agent-button').forEach(button => {
        const agentName = button.getAttribute('data-agent');
        
        button.addEventListener('click', () => {
            if (activeAgents[agentName]) {
                removeAgent(agentName);
            } else {
                addAgent(agentName);
            }
        });
    });
    
    // Set up clear all button
    document.getElementById('clearAll').addEventListener('click', clearAllAgents);
    
    // Set up add random button
    document.getElementById('addRandom').addEventListener('click', addRandomAgent);
    
    // Add a default agent (Clippy)
    setTimeout(() => {
        addAgent('Clippy');
    }, 1000);
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', init);