document.addEventListener("DOMContentLoaded", () => {
    addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?");
    loadConversation();
    setupQuickReplies();
});
document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const themeSwitch = document.getElementById("theme-switch");

    // Load saved theme preference
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        themeSwitch.checked = true;
    }

    // Toggle dark mode on switch change
    themeSwitch.addEventListener("change", function () {
        document.body.classList.toggle("dark", this.checked);
        localStorage.setItem("darkMode", this.checked);
    });

    // Existing chatbot initialization
    addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?");
    loadConversation();
    setupQuickReplies();
});


// Send User Message
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();

    if (message === "") return;

    addMessage("user", message);
    saveConversation("user", message);
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser(message);
    }, 1000);

    userInput.value = "";
}

// Add Message to Chat Box
function addMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = text;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing Indicator
function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message", "typing-indicator");
    typingDiv.innerHTML = "Typing...";

    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) typingIndicator.remove();
}

// Respond to User Input
function respondToUser(userMessage) {
    const response = analyzeMood(userMessage);
    addMessage("bot", response.message);
    saveConversation("bot", response.message);

    if (response.selfCareTip) {
        setTimeout(() => {
            addMessage("bot", response.selfCareTip);
            saveConversation("bot", response.selfCareTip);
        }, 1000);
    }

    setupQuickReplies(); // Update quick replies after response
}

// Mood Analysis and Responses
function analyzeMood(response) {
    response = response.toLowerCase();

    let message = '';
    let selfCareTip = '';

    if (response.includes("not feeling good") || response.includes("not happy") || response.includes("feeling bad")) {
        message = "I'm sorry you're feeling this way. It's okay to have tough days. Maybe talking to a friend or practicing self-care can help.";
        selfCareTip = 'Remember to take breaks and do something you enjoy, like reading a book or taking a walk.';
    } else if (response.includes("not great") || response.includes("not okay") || response.includes("not well")) {
        message = "I'm here for you. Try taking a break, listening to music, or doing something you enjoy.";
        selfCareTip = 'Consider practicing deep breathing exercises or meditation to relax.';
    } else if (/(happy|good|great|joyful|excited)/.test(response) && !/(not happy|not good)/.test(response)) {
        message = "That's wonderful! Keep up the positivity. Maybe treat yourself to something nice today!";
        selfCareTip = 'Celebrate your happiness by doing something you love, like a hobby or spending time with loved ones.';
    } else if (/(sad|down|unhappy|depressed)/.test(response)) {
        message = "I'm sorry to hear that. You're not alone. Try listening to your favorite music or reaching out to someone you trust.";
        selfCareTip = 'Write down your thoughts and feelings in a journal to help process your emotions.';
    } else if (/(stressed|overwhelmed|anxious|worried)/.test(response)) {
        message = "It sounds like you’re under a lot of pressure. Deep breathing, a short walk, or mindfulness exercises might help.";
        selfCareTip = 'Try this: Inhale deeply through your nose for 4 seconds, hold for 7 seconds, and exhale slowly through your mouth for 8 seconds.';
    } else if (/(angry|frustrated|annoyed|irritated)/.test(response)) {
        message = "I understand that things can be frustrating. Maybe try relaxation exercises, journaling, or talking it out with someone.";
        selfCareTip = 'Physical activity like a quick workout or stretching can help release built-up tension.';
    } else if (/(tired|exhausted|burned out|drained)/.test(response)) {
        message = "Rest is important! Make sure to take breaks, stay hydrated, and get enough sleep.";
        selfCareTip = 'Establish a relaxing bedtime routine to improve sleep quality, like dimming the lights and avoiding screens before bed.';
    } else {
        message = "I appreciate you sharing that. Remember, self-care is important. Would you like a self-care tip?";
        selfCareTip = 'Taking short breaks during work or study sessions can help improve focus and productivity.';
    }

    return { message, selfCareTip };
}

// Save Conversation to Local Storage
function saveConversation(sender, message) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Load Previous Conversation
function loadConversation() {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(entry => {
        addMessage(entry.sender, entry.message);
    });
}

// Quick Reply Buttons
function setupQuickReplies() {
    const quickRepliesContainer = document.getElementById("quick-replies");
    quickRepliesContainer.innerHTML = '';

    const replies = ["I'm feeling good!", "I'm a bit stressed.", "I'm tired.", "Any self-care tips?"];

    replies.forEach(reply => {
        const button = document.createElement("button");
        button.textContent = reply;
        button.addEventListener("click", () => sendQuickReply(reply));
        quickRepliesContainer.appendChild(button);
    });
}

// Send Quick Reply
function sendQuickReply(reply) {
    addMessage("user", reply);
    saveConversation("user", reply);
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser(reply);
    }, 1000);
}

// Self-Care Tips Button
document.getElementById("self-care-btn").addEventListener("click", () => {
    addMessage("user", "I need a self-care tip.");
    saveConversation("user", "I need a self-care tip.");
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser("I need a self-care tip.");
    }, 1000);
});

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("change", function() {
    document.body.classList.toggle("dark", this.checked);
    localStorage.setItem("darkMode", this.checked);
});


// Load Theme Preference
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    document.getElementById("theme-switch").checked = true;
}


// Respond to User Input with Resources
function respondToUser(userMessage) {
    const response = analyzeMood(userMessage);
    addMessage("bot", response.message);
    saveConversation("bot", response.message);

    if (response.selfCareTip) {
        setTimeout(() => {
            addMessage("bot", response.selfCareTip);
            saveConversation("bot", response.selfCareTip);
        }, 1000);
    }

    if (response.resources.length > 0) {
        setTimeout(() => {
            addMessage("bot", "Here are some helpful resources for you:");
            response.resources.forEach(resource => {
                addResource(resource);
            });
        }, 1500);
    }

    setupQuickReplies();
}

// Updated Mood Analysis with Resources
function analyzeMood(response) {
    response = response.toLowerCase();

    let message = '';
    let selfCareTip = '';
    let resourceLink = '';

    // Handle Greetings
    if (/(hi|hello|hey|namaste|hola)/.test(response)) {
        message = "Hello! I'm here to check in on you. How are you feeling today? 😊";
        return { message };  // No self-care tip or resource needed here
    }

    // Mood Analysis
    if (response.includes("not feeling good") || response.includes("not happy") || response.includes("feeling bad")) {
        message = "I'm sorry you're feeling this way. It's okay to have tough days. Maybe talking to a friend or practicing self-care can help.";
        selfCareTip = "Remember to take breaks and do something you enjoy, like reading a book or taking a walk.";
        resourceLink = "https://www.betterhelp.com/";
    } else if (response.includes("not great") || response.includes("not okay") || response.includes("not well")) {
        message = "I'm here for you. Try taking a break, listening to music, or doing something you enjoy.";
        selfCareTip = "Consider practicing deep breathing exercises or meditation to relax.";
        resourceLink = "https://www.headspace.com/";
    } else if (/(happy|good|great|joyful|excited)/.test(response) && !/(not happy|not good)/.test(response)) {
        message = "That's wonderful! Keep up the positivity. Maybe treat yourself to something nice today!";
        selfCareTip = "Celebrate your happiness by doing something you love, like a hobby or spending time with loved ones.";
    } else if (/(sad|down|unhappy|depressed)/.test(response)) {
        message = "I'm sorry to hear that. You're not alone. Try listening to your favorite music or reaching out to someone you trust.";
        selfCareTip = "Write down your thoughts and feelings in a journal to help process your emotions.";
        resourceLink = "https://www.samhsa.gov/find-help/national-helpline";
    } else if (/(stressed|overwhelmed|anxious|worried)/.test(response)) {
        message = "It sounds like you’re under a lot of pressure. Deep breathing, a short walk, or mindfulness exercises might help.";
        selfCareTip = "Try this: Inhale deeply through your nose for 4 seconds, hold for 7 seconds, and exhale slowly through your mouth for 8 seconds.";
        resourceLink = "https://www.anxietycanada.com/";
    } else {
        message = "I appreciate you sharing that. Would you like a self-care tip?";
        selfCareTip = "Taking short breaks during work or study can help improve focus.";
    }

    // Add resources if available
    if (resourceLink) {
        message += `\nHere are some helpful resources for you: [Click here](${resourceLink})`;
    }

    return { message, selfCareTip };
}


// Function to Display Resources
function addResource(resource) {
    const chatBox = document.getElementById("chat-box");
    const resourceDiv = document.createElement("div");

    resourceDiv.classList.add("message", "bot-message", "resource");
    resourceDiv.innerHTML = `<a href="${resource.url}" target="_blank">${resource.text}</a>`;

    chatBox.appendChild(resourceDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// New Chat Function
function startNewChat() {
    localStorage.removeItem("chatHistory"); // Clear stored chat history
    document.getElementById("chat-box").innerHTML = ""; // Clear chat box
    addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?"); // Restart chat
    setupQuickReplies(); // Reset quick replies
}


// ##################################################
//personlity feature




// Chatbot Personalities
const personalities = {
    "emotional": {
        name: "EmoBot 🎭",
        responses: {
            happy: "That's wonderful! Keep spreading positivity! 😊",
            sad: "I'm here for you. Do you want to talk about it? 💙",
            stressed: "Try taking deep breaths. Everything will be okay. 🌿",
            tired: "Rest is important. Maybe take a short break? 😴"
        }
    },
    "companion": {
        name: "AI Companion 🤖",
        intro: "Hey there! I'm your AI buddy, here to support and listen. How’s your day?",
        responses: {
            default: "That’s interesting! Tell me more. 🤔"
        }
    },
    "multi": {
        name: "Multi-Mode 🔀",
        options: ["Friendly 🤗", "Sarcastic 😏", "Motivational 💪", "Mysterious 🕵️"],
        getResponse: function (mode) {
            const responses = {
                "Friendly 🤗": "I'm here to be your best buddy! What's up? 😊",
                "Sarcastic 😏": "Oh really? That sounds... totally normal. 😏",
                "Motivational 💪": "You got this! Believe in yourself! 💪🔥",
                "Mysterious 🕵️": "I could tell you, but then it wouldn't be a mystery anymore... 🕵️‍♂️"
            };
            return responses[mode] || "Choose a personality!";
        }
    },
    "story": {
        name: "StoryTeller 📖",
        stories: [
            "Once upon a time, a little star felt lonely in the sky. But then it realized, it was part of a beautiful galaxy. You are never alone! 🌌",
            "There was a traveler who thought they were lost. But every step led to new adventures. Sometimes, the journey is more important than the destination! 🚶‍♂️"
        ],
        getStory: function () {
            return this.stories[Math.floor(Math.random() * this.stories.length)];
        }
    },
    "mystery": {
        name: "Mystery Chatbot 🔓",
        unlockable: ["Detective 🕵️", "Wizard 🧙", "Comedian 🎭"],
        unlock: function () {
            return this.unlockable[Math.floor(Math.random() * this.unlockable.length)] + " unlocked!";
        }
    }
};

// Function to switch personality
function switchPersonality(personality) {
    if (personalities[personality]) {
        currentPersonality = personality;
        let intro = personalities[personality].intro || `Switched to ${personalities[personality].name}!`;
        appendMessage("bot", intro);
    } else {
        appendMessage("bot", "I don't know that personality yet! Try another.");
    }
}

// Function to respond based on personality
function chatbotResponse(userMessage) {
    let response = "Hmm, I’m not sure how to respond to that. 🤔";

    if (currentPersonality === "emotional") {
        if (userMessage.includes("happy")) response = personalities.emotional.responses.happy;
        else if (userMessage.includes("sad")) response = personalities.emotional.responses.sad;
        else if (userMessage.includes("stressed")) response = personalities.emotional.responses.stressed;
        else if (userMessage.includes("tired")) response = personalities.emotional.responses.tired;

    } else if (currentPersonality === "companion") {
        response = personalities.companion.responses.default;

    } else if (currentPersonality === "multi") {
        let modes = personalities.multi.options;
        let selectedMode = modes[Math.floor(Math.random() * modes.length)];
        response = personalities.multi.getResponse(selectedMode);

    } else if (currentPersonality === "story") {
        response = personalities.story.getStory();

    } else if (currentPersonality === "mystery") {
        response = personalities.mystery.unlock();
    }

    appendMessage("bot", response);
}

// Set Default Personality
let currentPersonality = "emotional";

// Add Buttons to Switch Personality
function addPersonalityButtons() {
    const chatContainer = document.querySelector(".chat-container");
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "personality-buttons";

    Object.keys(personalities).forEach((key) => {
        let btn = document.createElement("button");
        btn.innerText = personalities[key].name;
        btn.onclick = () => switchPersonality(key);
        buttonContainer.appendChild(btn);
    });

    chatContainer.appendChild(buttonContainer);
}

// Initialize Personalities
window.onload = () => {
    addPersonalityButtons();
    appendMessage("bot", "Hello! Choose a chatbot personality to begin. 🎭");
};
