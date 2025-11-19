const EMOJIS = {
    happy: "😄",
    sad: "😢",
    fire: "🔥",
    love: "❤️",
    cool: "😎",
    angry: "😡",
    laugh: "😂",
    cry: "😭"
};

const input = document.getElementById("word");
const result = document.getElementById("result");
const suggestions = document.getElementById("suggestions");
const emojiButtons = document.getElementById("emojiButtons");

// Show emoji when button clicked
document.getElementById("btn").addEventListener("click", () => {
    showEmoji(input.value);
});

// Auto-suggestions
input.addEventListener("input", () => {
    const text = input.value.toLowerCase();
    const matches = Object.keys(EMOJIS).filter(word => word.startsWith(text));
    suggestions.textContent = matches.length ? "Suggestions: " + matches.join(", ") : "";
});

// Create clickable emoji buttons
Object.entries(EMOJIS).forEach(([word, emoji]) => {
    const btn = document.createElement("span");
    btn.className = "emoji-btn";
    btn.textContent = emoji;
    btn.title = word;
    btn.onclick = () => {
    input.value = word;
    showEmoji(word);
    };
    emojiButtons.appendChild(btn);
});

// Show emoji function
function showEmoji(word) {
    word = word.toLowerCase().trim();
    const emoji = EMOJIS[word] || "❓";
    result.style.opacity = 0;
    setTimeout(() => {
    result.textContent = emoji;
    result.style.opacity = 1;
    }, 150);
}

// Dark/Light mode toggle
const toggleBtn = document.getElementById("toggleMode");
toggleBtn.onclick = () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light"
    : "🌙 Dark";
};