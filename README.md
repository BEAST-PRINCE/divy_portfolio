# 🚀 Divyanshu's(My) Portfolio 

Welcome to the codebase of my personal portfolio. If you're a recruiter reading this, **hire me now** before the AI does! This isn't just another boring static site; it's a dynamic, fully-featured web app that proves I know a thing or two about backend systems, frontend flair, and letting the machines do the heavy lifting.

🔴 **Live Demo**: [Check it out right here!](https://divy-portfolio-1x47.onrender.com/)

🦖 **For Fun (The "Before AI" Era)**: Want to see what my portfolio looked like before I turbocharged it with Agentic AI? [Behold the legacy version here](https://divyanshu-project-portfolio.vercel.app/). Quite the glow-up, right?

## 🤔 Wait, who built this?

This project was built with a potent combination of human ingenuity (mine) and artificial intelligence (Google DeepMind's **Antigravity**). Yes, I pair-programmed with a state-of-the-art AI agent. We argued over CSS, optimized Django settings together, and gracefully managed Render deploy scripts without breaking a sweat. It's the future of software engineering, and I'm surfing the wave. 🏄‍♂️

## ✨ The Magic Inside (Features)

*   **Dark Mode by Default (Obviously)**: Because I value your retinas. But there's a light mode toggle if you're feeling chaotic.
*   **The "Recruiter Trap" 3D Cube**: An interactive Three.js cube that spins and showcases my skills. It's guaranteed to hypnotize anyone who gazes upon it.
*   **Live GitHub Pulse**: Fetches my top repositories in real-time. No more manually updating a JSON file every time I push code.
*   **Butter-Smooth Animations**: Uses the `IntersectionObserver` API so elements glide onto the screen like they own the place.
*   **Built for Production**: Configured with WhiteNoise and Gunicorn because `manage.py runserver` is for amateurs.

## 🛠️ Tech Stack 

*   **Backend Strategy**: Python & Django (Routing, templates, data services)
*   **Visual Wizardry**: Tailwind CSS v4 (Compiled via CLI for maximum velocity)
*   **Frontend Logic**: Vanilla ES6 JavaScript (No bloated frameworks needed, thanks!)
*   **3D Graphics**: Three.js (For the ✨aesthetics✨)
*   **Hosting**: Render (With auto-host detection and battle-tested deployment scripts)

## 🏃‍♂️ How to Run it Locally

If you really want to spin this up on your own machine (maybe you want to steal the CSS, I don't blame you), here is the spellbook:

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/BEAST-PRINCE/divy_portfolio.git
   cd divy_portfolio
   ```

2. **Activate the Virtual Environment:**
   *(You know the drill. `python -m venv venv` and `source venv/bin/activate` or `\Scripts\activate` on Windows).*

3. **Install the Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the missing blanks. (No, you can't have my Secret Key).

5. **Build the Tailwind Magic:**
   ```bash
   npm install
   npm run build:css
   ```

6. **Serve It Up:**
   ```bash
   python manage.py collectstatic --no-input
   python manage.py runserver
   ```
   *Boom.* Head over to `http://localhost:8000`.

## 🤝 Let's Connect

Did I mention you should hire me? Check out my [LinkedIn](https://www.linkedin.com/in/divyanshu-prince-72ba2a22a/) or explore the rest of my [GitHub](https://github.com/BEAST-PRINCE). 

---
*Built with ❤️, Python, and a whole lot of AI Antigravity.*
