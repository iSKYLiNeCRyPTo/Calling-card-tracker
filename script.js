const callingCards = [
    {
        id: "1",
        name: "Abyssal Horror",
        category: "Warzone",
        challenge: "Complete the Abyss Camo challenge",
        isCompleted: false
    },
    {
        id: "2",
        name: "Verdansk",
        category: "Warzone",
        challenge: "Redeem via QR code promotion",
        isCompleted: false
    },
    {
        id: "3",
        name: "Multiplayer 100 Percenter",
        category: "100 Percenter",
        challenge: "Complete all Multiplayer Career Challenges",
        isCompleted: false
    },
    {
        id: "4",
        name: "Resourceful",
        category: "Dark Ops",
        challenge: "Complete a Warzone match using only items found in-game",
        isCompleted: false
    }
];

function loadCompletionStatus() {
    const saved = localStorage.getItem("callingCardCompletion");
    if (saved) {
        const completionData = JSON.parse(saved);
        callingCards.forEach(card => {
            card.isCompleted = !!completionData[card.id];
        });
    }
}

function saveCompletionStatus() {
    const completionData = callingCards.reduce((acc, card) => {
        acc[card.id] = card.isCompleted;
        return acc;
    }, {});
    localStorage.setItem("callingCardCompletion", JSON.stringify(completionData));
}

function updateProgress() {
    const completed = callingCards.filter(card => card.isCompleted).length;
    const total = callingCards.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    document.getElementById("progressText").textContent = `${percentage.toFixed(1)}%`;
    document.getElementById("progressBar").style.width = `${percentage}%`;
}

function renderCards(cards) {
    const cardList = document.getElementById("cardList");
    cardList.innerHTML = "";
    cards.forEach(card => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
            <input type="checkbox" ${card.isCompleted ? "checked" : ""} 
                   onchange="toggleCompletion('${card.id}')">
            <div class="card-details">
                <h5>${card.name}</h5>
                <p>Category: ${card.category} | Challenge: ${card.challenge}</p>
            </div>
        `;
        cardList.appendChild(li);
    });
    updateProgress();
}

function toggleCompletion(id) {
    const card = callingCards.find(card => card.id === id);
    if (card) {
        card.isCompleted = !card.isCompleted;
        saveCompletionStatus();
        filterAndRender();
    }
}

function filterAndRender() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    
    const filteredCards = callingCards.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchText) || 
                            card.challenge.toLowerCase().includes(searchText);
        const matchesCategory = !category || card.category === category;
        return matchesSearch && matchesCategory;
    });
    
    renderCards(filteredCards);
}

document.addEventListener("DOMContentLoaded", () => {
    loadCompletionStatus();
    renderCards(callingCards);
    document.getElementById("searchInput").addEventListener("input", filterAndRender);
    document.getElementById("categoryFilter").addEventListener("change", filterAndRender);
});
