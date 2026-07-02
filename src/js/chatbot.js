export function initChatbot() {
  const aiWidget = document.querySelector(".ai-widget");
  const aiFab = document.querySelector(".ai-fab");
  const aiClose = document.querySelector(".ai-close");
  const aiInput = document.querySelector(".ai-input-row input");
  const aiSubmit = document.querySelector(".ai-input-row button");
  const aiMessages = document.querySelector(".ai-messages");
  const aiSuggestions = document.querySelectorAll(".ai-suggestions button");

  if (!aiWidget || !aiFab) return;

  const toggleWidget = () => {
    aiWidget.classList.toggle("open");
    if (aiWidget.classList.contains("open")) {
      setTimeout(() => aiInput?.focus(), 300);
    }
  };

  aiFab.addEventListener("click", toggleWidget);
  aiClose?.addEventListener("click", toggleWidget);

  const mockResponses = [
    "Aureon s'intègre en moins de 5 jours grâce à nos 120+ connecteurs natifs.",
    "Vos données sont chiffrées (AES-256) et hébergées en UE. Nous sommes conformes RGPD et SOC 2.",
    "Absolument, l'automatisation de vos tâches répétitives peut augmenter votre productivité de 34% en moyenne.",
    "Je peux vous organiser une démonstration technique avec l'un de nos ingénieurs demain. Cela vous convient-il ?"
  ];

  const addMessage = (text, sender = "bot", typing = false) => {
    const msg = document.createElement("div");
    msg.className = `ai-msg ai-${sender} ${typing ? 'ai-typing-indicator' : ''}`;
    
    if (typing) {
      msg.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    } else {
      msg.innerHTML = `<p>${text}</p>`;
    }
    
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return msg;
  };

  const handleUserMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage(text, "user");
    if (aiInput) aiInput.value = "";

    // Show typing indicator
    const typingMsg = addMessage("", "bot", true);

    // Mock API delay
    setTimeout(() => {
      typingMsg.remove();
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addMessage(randomResponse, "bot");
    }, 1500 + Math.random() * 1000);
  };

  aiSubmit?.addEventListener("click", () => handleUserMessage(aiInput?.value || ""));
  aiInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserMessage(e.target.value);
  });

  aiSuggestions.forEach(btn => {
    btn.addEventListener("click", () => {
      handleUserMessage(btn.textContent);
      const suggestionsContainer = document.querySelector(".ai-suggestions");
      if (suggestionsContainer) suggestionsContainer.style.display = "none";
    });
  });
}
