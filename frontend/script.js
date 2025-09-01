const API_BASE = "https://my-recipe-recommender-hackathon.onrender.com";
let currentUser = null;
let suggestionCount = 0;
const SUGGESTION_LIMIT = 3;

// Expanded sample recipes to show if AI suggestion fails
const sampleRecipes = [
    {
        title: "Tomato Pasta",
        ingredients: "Pasta, Tomato, Garlic, Olive Oil, Salt",
        instructions: "Boil pasta. Sauté garlic in olive oil, add chopped tomatoes, cook until soft. Mix with pasta and serve."
    },
    {
        title: "Chicken Stir Fry",
        ingredients: "Chicken, Bell Pepper, Onion, Soy Sauce, Oil",
        instructions: "Slice chicken and vegetables. Stir fry in oil, add soy sauce, cook until chicken is done."
    },
    {
        title: "Vegetable Omelette",
        ingredients: "Eggs, Onion, Tomato, Spinach, Salt, Pepper",
        instructions: "Beat eggs, add chopped vegetables, season. Cook in a pan until set."
    },
    {
        title: "Beef Stew",
        ingredients: "Beef, Potato, Carrot, Onion, Tomato Paste, Salt, Pepper",
        instructions: "Brown beef, add chopped vegetables, tomato paste, and water. Simmer until tender."
    },
    {
        title: "Fruit Salad",
        ingredients: "Banana, Apple, Orange, Grapes, Honey, Lemon Juice",
        instructions: "Chop fruits, mix with honey and lemon juice. Chill and serve."
    },
    {
        title: "Chapati Wraps",
        ingredients: "Chapati, Chicken, Lettuce, Tomato, Mayonnaise",
        instructions: "Fill chapati with cooked chicken, lettuce, tomato, and mayonnaise. Roll and serve."
    },
    {
        title: "Simple Pilau",
        ingredients: "Rice, Beef, Onion, Pilau Masala, Garlic, Oil",
        instructions: "Brown beef and onion, add garlic and pilau masala, then rice and water. Cook until rice is done."
    },
    {
        title: "Avocado Toast",
        ingredients: "Bread, Avocado, Salt, Pepper, Lemon Juice",
        instructions: "Toast bread, mash avocado with salt, pepper, and lemon juice. Spread on toast."
    }
];

// Show dashboard if logged in
function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    showUpgradeSection();
    fetchRecipes();
    document.getElementById('logoutBtn').style.display = 'inline-block';
}

// Account creation
document.getElementById('accountForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('accountMessage');

    fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = "Account created! You can now log in.";
            messageDiv.style.color = "#388e3c";
            document.getElementById('accountForm').reset();
        } else {
            messageDiv.textContent = data.message || "Registration failed.";
            messageDiv.style.color = "#d32f2f";
        }
    });
});

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            suggestionCount = 0;
            messageDiv.textContent = "";
            showDashboard();
        } else {
            messageDiv.textContent = data.message || "Login failed.";
            messageDiv.style.color = "#d32f2f";
        }
    });
});

// Show upgrade section if not premium
function showUpgradeSection() {
    const container = document.getElementById('upgradeContainer');
    container.innerHTML = '';
    if (!currentUser || !currentUser.premium) {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.className = 'upgrade-section';
        upgradeDiv.innerHTML = `
            <h2>Upgrade to Premium</h2>
            <input type="text" id="mpesaPhone" placeholder="Mpesa phone number" />
            <button id="upgradeBtn">Upgrade Now (KES 500)</button>
            <div id="upgradeMessage"></div>
        `;
        container.appendChild(upgradeDiv);

        document.getElementById('upgradeBtn').onclick = function() {
            const phone = document.getElementById('mpesaPhone').value.trim();
            const messageDiv = document.getElementById('upgradeMessage');
            if (!phone) {
                messageDiv.textContent = "Please enter your Mpesa phone number.";
                messageDiv.style.color = "#d32f2f";
                return;
            }
            messageDiv.textContent = "Initiating payment...";
            fetch(`${API_BASE}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phone })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.payment_url) {
                    messageDiv.textContent = "Payment initiated! Please complete payment in the opened window.";
                    window.open(data.payment_url, "_blank");
                } else {
                    messageDiv.textContent = data.message || "Payment initiation failed.";
                    messageDiv.style.color = "#d32f2f";
                }
            })
            .catch(() => {
                messageDiv.textContent = "Error connecting to payment service.";
                messageDiv.style.color = "#d32f2f";
            });
        };
    }
}

// Suggest recipes using OpenAI (limit if not premium)
document.getElementById('suggestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ingredients = document.getElementById('suggestIngredients').value.trim();
    const resultDiv = document.getElementById('suggestionResult');
    const limitMsgDiv = document.getElementById('suggestionLimitMsg');
    const sampleMsgDiv = document.getElementById('sampleRecipesMsg');
    resultDiv.textContent = "";
    limitMsgDiv.textContent = "";
    sampleMsgDiv.textContent = "";

    if (!currentUser.premium && suggestionCount >= SUGGESTION_LIMIT) {
        limitMsgDiv.textContent = "You have reached your free suggestion limit. Upgrade to premium for unlimited suggestions.";
        limitMsgDiv.style.color = "#d32f2f";
        return;
    }

    resultDiv.textContent = "Thinking...";
    fetch(`${API_BASE}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.recipes) {
            resultDiv.textContent = "";
            displayRecipes(data.recipes);
            suggestionCount++;
            if (!currentUser.premium && suggestionCount >= SUGGESTION_LIMIT) {
                limitMsgDiv.textContent = "You have reached your free suggestion limit. Upgrade to premium for unlimited suggestions.";
                limitMsgDiv.style.color = "#d32f2f";
            }
        } else {
            resultDiv.textContent = "AI suggestion is currently unavailable. Showing sample recipes below.";
            sampleMsgDiv.textContent = "Sample recipes (AI suggestion temporarily unavailable):";
            displayRecipes(sampleRecipes);
        }
    })
    .catch(() => {
        resultDiv.textContent = "AI suggestion is currently unavailable. Showing sample recipes below.";
        sampleMsgDiv.textContent = "Sample recipes (AI suggestion temporarily unavailable):";
        displayRecipes(sampleRecipes);
    });
});

// Fetch recipes from backend
function fetchRecipes() {
    fetch(`${API_BASE}/recipes`)
    .then(res => res.json())
    .then data => {
        if (data.success && data.recipes) {
            displayRecipes(data.recipes);
        }
    });
}

// Show toast message
function showToast(message) {
    let toast = document.getElementById('toastMessage');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastMessage';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#43c6ac';
        toast.style.color = '#fff';
        toast.style.padding = '14px 24px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '1.1em';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 2px 8px rgba(67,198,172,0.18)';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

// Display recipes as clickable cards with UI tweaks
function displayRecipes(recipes) {
    const container = document.getElementById('recipesContainer');
    container.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.boxShadow = "0 2px 8px rgba(67,198,172,0.15)";
        card.style.transition = "transform 0.2s";
        card.style.cursor = "pointer";
        card.innerHTML = `
            <div class="recipe-title" style="font-size:1.2em; color:#00796b; font-weight:bold; margin-bottom:8px;">${recipe.title}</div>
            <div class="recipe-ingredients" style="color:#388e3c; margin-bottom:6px;"><strong>Ingredients:</strong> ${recipe.ingredients}</div>
            <div class="recipe-instructions" style="color:#333; font-size:0.98em;"><strong>Instructions:</strong> ${recipe.instructions}</div>
        `;
        card.onmouseover = () => { card.style.transform = "scale(1.03)"; card.style.boxShadow = "0 8px 24px rgba(67,198,172,0.18)"; };
        card.onmouseout = () => { card.style.transform = "scale(1)"; card.style.boxShadow = "0 2px 8px rgba(67,198,172,0.15)"; };
        card.onclick = () => showToast(`You picked: ${recipe.title}`);
        container.appendChild(card);
    });
}

// Log out button logic
document.getElementById('logoutBtn').addEventListener('click', function() {
    currentUser = null;
    suggestionCount = 0;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('loginMessage').textContent = "You have been logged out.";
    document.getElementById('logoutBtn').style.display = 'none';

    // Reset account creation form
    document.getElementById('accountForm').reset();
    document.getElementById('accountMessage').textContent = "";

    // Reset login form
    document.getElementById('loginForm').reset();
    document.getElementById('loginMessage').textContent = "";
});

// Hide dashboard on load
document.getElementById('dashboard').style.display = 'none';