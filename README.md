# My Recipe Recommender Hackathon

A full-stack web app for recommending recipes, featuring user authentication, premium upgrades via Mpesa (IntaSend), and AI-powered suggestions using OpenAI.

---

## 🚀 Features

- **User Registration & Login:** Secure account creation and authentication.
- **Recipe Dashboard:** View, filter, and get AI-generated recipe suggestions.
- **Premium Upgrade:** Unlock unlimited AI suggestions via Mpesa payment (IntaSend sandbox).
- **OpenAI Integration:** Get smart recipe ideas based on your ingredients.
- **Sample Recipes:** Always see useful recipes, even if AI is unavailable.
- **Footer & Contact:** Modern UI with support/contact info.
- **Secure Secret Management:** All API keys and credentials stored in `.env` (never committed).

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Database:** MySQL
- **AI:** OpenAI GPT-3.5 Turbo
- **Payments:** IntaSend Mpesa (sandbox/test keys)
- **Security:** python-dotenv, `.env` file, `.gitignore`

---

## 📦 Setup Instructions

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/Ramslon/My-Recipe-Recommender-hackathon.git
   cd My-Recipe-Recommender-hackathon
   ```

2. **Install Python dependencies:**
   ```powershell
   pip install flask flask-cors mysql-connector-python openai python-dotenv requests
   ```

3. **Create a `.env` file in the project root:**
   ```env
   OPENAI_API_KEY=your_openai_key
   INTASEND_API_KEY=your_intasend_api_key
   INTASEND_PUBLIC_KEY=your_intasend_public_key
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=Recipe_DB
   FLASK_SECRET_KEY=your_flask_secret
   ```

4. **Ensure `.env` is in `.gitignore`:**
   ```gitignore
   .env
   ```

5. **Set up MySQL database:**
   - Create a database named `Recipe_DB`.
   - Create tables for `users` and `recipes` as required by the app.

6. **Run the Flask backend:**
   ```powershell
   python app.py
   ```

7. **Open `index.html` in your browser to use the app.**

---

## 💡 Development Journey

1. **Started with a simple front-end:**  
   - Built `index.html`, `style.css`, and `script.js` for recipe cards and filtering.

2. **Added authentication:**  
   - Integrated registration and login forms.
   - Connected to Flask backend and MySQL for user management.

3. **Integrated OpenAI for AI suggestions:**  
   - Added `/suggest` endpoint in Flask.
   - Used OpenAI API to generate recipes based on user input.

4. **Enabled premium features:**  
   - Added payment flow using IntaSend Mpesa (sandbox).
   - Created `/pay` and `/upgrade` endpoints.
   - Managed premium status in the database.

5. **Improved UI/UX:**  
   - Added sample recipes, log-out button, and interactive footer.

6. **Secured secrets:**  
   - Moved all API keys and credentials to `.env`.
   - Added `.env` to `.gitignore`.
   - Cleaned git history using BFG Repo-Cleaner to remove secrets.

7. **Finalized for deployment:**  
   - Verified all features and security.
   - Pushed clean codebase to GitHub.

---

## 🔒 Security Notes

- **Never commit secrets:** All sensitive keys are stored in `.env` and excluded from git.
- **If secrets were ever committed:** Used BFG Repo-Cleaner and manual edits to scrub history.
- **Push protection:** GitHub secret scanning blocks pushes with secrets—followed all steps to resolve.

---

## 📞 Contact & Support

- For issues or support, open a GitHub issue or use the contact info in the app footer.

---

## 🏆 Hackathon Journey

This project was built step-by-step, evolving from a simple recipe recommender to a secure, full-stack, AI-powered platform with payment integration and modern UI.

---

**Enjoy using My Recipe Recommender!**