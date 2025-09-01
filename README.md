# Recipe Recommender

A simple, responsive web app for suggesting recipes based on your ingredients.

## Project Structure

```
index.html
frontend/
  ├── style.css
  └── script.js
app.py
README.md
.env
requirements.txt
```

## Features

- User registration and login (instant access, no manual approval)
- Recipe suggestions powered by OpenAI
- Premium upgrade via M-Pesa (IntaSend)
- Responsive design for all devices (mobile, tablet, desktop)
- PostgreSQL backend with premium status defaulting to FALSE
- Frontend and backend deployed separately (Vercel & Render)
- Toast message for recipe selection (mobile-friendly)

## Usage

1. Clone the repository.
2. Install backend dependencies and set up your `.env` file.
3. Update your PostgreSQL schema:
    - Ensure the `premium` column exists and defaults to `FALSE`.
    - Example SQL:
      ```
      ALTER TABLE users ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ALTER COLUMN premium SET DEFAULT FALSE;
      UPDATE users SET premium = FALSE WHERE premium IS NULL;
      ```
4. Run the backend (`app.py`) and open `index.html` in your browser.

## Mobile Support

- The site is fully responsive and works on phones, tablets, and desktops.
- CSS media queries and flexible layouts ensure usability on all devices.
- Toast messages provide a better experience for mobile users.

## Prompts Used

- "generate a front-end using index.html,script.js and style to come up with a simple recipe recommender..."
- "add authentication, premium features, OpenAI suggestions, IntaSend payments"
- "secure secrets and clean git history"
- "migrate backend to cloud PostgreSQL"
- "deploy front-end to Vercel and backend to Render"
- "resolve CORS and deployment issues"
- "clarify payment approval messaging"
- "update style.css so the websites fits every device accordingly ,update the index.html,README.md and everything where necessary"
- "Review the script.js for mobile usabilty and Update README.md file to include all the changes made and the prompts i have used and then push the changes"
- "Update the README.md to include all the project file with prompts and add the toast message code to my script.js .Commit and push changes"

## Deployment

- Frontend: Vercel
- Backend: Render

## License

MIT