from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import openai
import requests
import json
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app)

# MySQL config
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="ramson@111",
    database="Recipe_DB"
)
cursor = db.cursor(dictionary=True)

# OpenAI config
openai.api_key = os.getenv("OPENAI_API_KEY")

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    if cursor.fetchone():
        return jsonify(success=False, message="Username already exists.")
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
    db.commit()
    return jsonify(success=True)

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()
    if user:
        session['user_id'] = user['id']
        return jsonify(success=True, user={
            'username': user['username'],
            'email': user['email'],
            'premium': user.get('premium', False)
        })
    return jsonify(success=False, message="Invalid credentials.")

# Suggest recipes using OpenAI and save to MySQL
@app.route('/suggest', methods=['POST'])
def suggest():
    data = request.json
    ingredients = data['ingredients']
    prompt = f"Suggest 3 or more simple recipes using these ingredients: {ingredients}. Format each as: Title, Ingredients, Instructions."
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        text = response.choices[0].message.content
        # Parse recipes from OpenAI response (simple parsing)
        recipes = []
        for block in text.split('\n\n'):
            lines = block.strip().split('\n')
            if len(lines) >= 3:
                title = lines[0].replace("Title:", "").strip()
                ingredients_line = lines[1].replace("Ingredients:", "").strip()
                instructions_line = lines[2].replace("Instructions:", "").strip()
                recipes.append({
                    'title': title,
                'ingredients': ingredients_line,
                    'instructions': instructions_line
                })
                # Save to MySQL
                cursor.execute("INSERT INTO recipes (title, ingredients, instructions) VALUES (%s, %s, %s)", (title, ingredients_line, instructions_line))
        db.commit()
        return jsonify(success=True, recipes=recipes)
    except Exception as e:
        return jsonify(success=False, message=str(e))

# Get all recipes
@app.route('/recipes', methods=['GET'])
def get_recipes():
    cursor.execute("SELECT * FROM recipes ORDER BY id DESC LIMIT 10")
    recipes = cursor.fetchall()
    return jsonify(success=True, recipes=recipes)

# Payment initiation endpoint
@app.route('/pay', methods=['POST'])
def pay():
    data = request.json
    phone_number = data['phone_number']
    amount = data.get('amount', 500)  # Set your premium price

    INTASEND_API_KEY = "ISSecretKey_test_dd01a7f1-7b31-4b01-8716-4b9af26935af"
    INTASEND_PUBLIC_KEY = "ISPubKey_test_d57625e7-084f-4978-a7d6-6a3c85533bae"
    INTASEND_URL = "https://sandbox.intasend.com/api/v1/checkout/mpesa/"

    payload = {
        "public_key": INTASEND_PUBLIC_KEY,
        "amount": amount,
        "currency": "KES",
        "phone_number": phone_number,
        "redirect_url": "http://127.0.0.1:5000/payment-success"
    }
    headers = {
        "Authorization": f"Bearer {INTASEND_API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(INTASEND_URL, json=payload, headers=headers)
        print("IntaSend raw response:", response.text)  # Debug print
        try:
            result = response.json()
        except Exception:
            return jsonify(success=False, message="Payment service error: " + response.text)
        return jsonify(success=True, payment_url=result.get("payment_url"))
    except Exception as e:
        return jsonify(success=False, message=str(e))

# Endpoint to mark user as premium after payment (call this after payment confirmation)
@app.route('/upgrade', methods=['POST'])
def upgrade():
    data = request.json
    username = data['username']
    cursor.execute("UPDATE users SET premium=TRUE WHERE username=%s", (username,))
    db.commit()
    return jsonify(success=True, message="Upgraded to premium.")


if __name__ == '__main__':
    app.run(debug=True)

